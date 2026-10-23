import asyncio, json, sys, hashlib
from pathlib import Path
from urllib.parse import urlparse, parse_qs
from playwright.async_api import async_playwright
from PIL import Image, ImageChops
import fitz

ROOT = Path('/workspace/connextthedots')
PHASE = sys.argv[1]
OUT = Path('/workspace/work/pr2-revision/evidence') / PHASE
OUT.mkdir(parents=True, exist_ok=True)
base = 'http://localhost:' + sys.argv[2]
locales = ['', 'de/', 'es/', 'pt/', 'fr/', 'it/', 'nl/']
targets = ['dot-to-dot-printable/', 'connect-the-dots-for-adults/']
samples = ['simple-rabbit-outline', 'cute-happy-rabbit', 'puppy-sketch', 'cute-sitting-puppy']
adult_slugs = ['6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots', '7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots']
paths = ['/' + loc + t for loc in locales for t in targets]
paths += ['/', '/printable-connect-the-dots/', '/free-animal-dot-to-dot-printables-pdf/', '/fr/printable-connect-the-dots/', '/it/printable-connect-the-dots/', '/es/printable-connect-the-dots/']
paths += ['/printables/' + s + '/' for s in samples + adult_slugs]

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        context = await browser.new_context(viewport={'width': 1440, 'height': 1000}, accept_downloads=True)
        blocked = []
        async def isolate(route):
            u = urlparse(route.request.url)
            if u.hostname not in ['127.0.0.1', 'localhost']:
                blocked.append(route.request.url)
                await route.abort()
            elif u.path.startswith('/api/'):
                blocked.append(route.request.url)
                await route.fulfill(status=200, content_type='application/json', body='[]')
            elif u.path.rstrip('/') == '/_next/image' and parse_qs(u.query).get('url', [''])[0].startswith('https:'):
                blocked.append(route.request.url)
                await route.abort()
            else:
                await route.continue_()
        await context.route('**/*', isolate)
        page = await context.new_page()
        snapshots = json.loads((OUT / 'snapshots.json').read_text()) if (OUT / 'snapshots.json').exists() else {}
        for path in (sys.argv[3:] or paths):
            await context.clear_cookies()
            response = await page.goto(base + path, wait_until='domcontentloaded', timeout=120000)
            await page.locator('main').wait_for()
            snapshot = await page.evaluate('''() => ({
                title: document.title,
                meta: [...document.head.querySelectorAll('meta')].map(n=>n.outerHTML).sort(),
                relations: [...document.head.querySelectorAll('link[rel="canonical"],link[rel="alternate"]')].map(n=>n.outerHTML).sort(),
                headings: [...document.querySelectorAll('main h1,main h2,main h3')].map(n=>[n.tagName,n.textContent.trim()]),
                jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(n=>JSON.parse(n.textContent)),
                links: [...document.querySelectorAll('main a')].map(n=>[n.getAttribute('href'),n.textContent.trim()]),
                text: document.querySelector('main').innerText
            })''')
            snapshot['status'] = response.status
            snapshots[path] = snapshot
            (OUT / 'snapshots.json').write_text(json.dumps(snapshots, ensure_ascii=False, indent=2))
            if path in ['/' + t for t in targets]:
                (OUT / (path.strip('/') + '.html')).write_text(await page.content())
                await page.screenshot(path=str(OUT / (path.strip('/') + '.png')), full_page=True)
            print(PHASE, path, response.status, flush=True)
        (OUT / 'snapshots.json').write_text(json.dumps(snapshots, ensure_ascii=False, indent=2))
        (OUT / 'blocked-requests.json').write_text(json.dumps(sorted(set(blocked)), indent=2))
        await browser.close()

asyncio.run(main())
