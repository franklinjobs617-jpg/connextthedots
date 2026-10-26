"""C05 targeted local production regression; no remote requests or PDF audit.

Run baseline main on :3100 and candidate on :3101, then python docs/c05-mountain-collection/verify.py.
Requires Python Playwright and /usr/bin/chromium. Third-party requests are blocked.
"""
import asyncio
import hashlib
import json
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlsplit

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'work/c05'
NEW = '/printables/mountain-landscape-120/'
LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl']
HEADERS = {'host': 'connectthedotsprintable.online', 'x-forwarded-host': 'connectthedotsprintable.online', 'x-forwarded-proto': 'https', 'cookie':'NEXT_LOCALE=en'}
CARD = '#printable-grid .grid > a'
SEO_JS = """html => {
 const d = new DOMParser().parseFromString(html, 'text/html');
 return {title:d.title, meta:[...d.querySelectorAll('meta')].map(x=>x.outerHTML).sort(),
 h1:[...d.querySelectorAll('h1')].map(x=>x.textContent),
 links:[...d.querySelectorAll('link[rel="canonical"],link[rel="alternate"]')].map(x=>x.outerHTML).sort(),
 schema:[...d.querySelectorAll('script[type="application/ld+json"]')].map(x=>JSON.parse(x.textContent))};
}"""


def digest(value):
    return hashlib.sha256(value if isinstance(value, bytes) else json.dumps(value, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


async def card_records(page):
    return await page.locator(CARD).evaluate_all("""cards => cards.map(c=>({href:c.getAttribute('href'),html:c.outerHTML}))""")


async def inspect(api, page, path, agent=None):
    response = await api.get(path, headers={'user-agent': agent} if agent else {}, max_redirects=0)
    body = await response.body()
    # Only normalize local test origins in inherited social metadata.
    html = body.decode().replace('http://localhost:3100', 'http://local-test.invalid').replace('http://localhost:3101', 'http://local-test.invalid')
    return {'status': response.status, 'headers': {h:response.headers.get(h) for h in ['link', 'x-robots-tag', 'location', 'refresh']},
            'seo': await page.evaluate(SEO_JS, html), 'raw_html_sha256': digest(body)}


async def run():
    report = {'base_sha':'ebdb92c1143ef149cc5dfc04e43f51cb0dbc0f13', 'scope':'Local production builds; third-party browser requests blocked', 'collections':{}, 'seo':{}, 'downloads':[], 'mobile':{}}
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        contexts = [await browser.new_context(viewport={'width':1440,'height':1000}, reduced_motion='reduce') for _ in range(2)]
        async def local_only(route):
            if urlsplit(route.request.url).hostname in ['localhost', '127.0.0.1']:
                await route.continue_()
            else:
                await route.abort()
        for context in contexts:
            await context.route('**/*', local_only)
        pages = [await c.new_page() for c in contexts]
        apis = [await p.request.new_context(base_url=f'http://localhost:{port}', extra_http_headers=HEADERS) for port in [3100,3101]]
        for locale in LOCALES:
            path = f'{"" if locale == "en" else "/"+locale}/printable-connect-the-dots/'
            snapshots = []
            for i,page in enumerate(pages):
                await page.goto(f'http://localhost:{3100+i}{path}', wait_until='networkidle')
                assert await page.locator(CARD).count() > 0
                states = []
                for index in range(5):
                    button = page.locator('#printable-grid aside button').nth(index)
                    await button.click()
                    await page.wait_for_function("document.querySelector('#printable-grid aside button.bg-brand-blue') !== null")
                    states.append({'button':await button.inner_text(), 'cards':await card_records(page)})
                snapshots.append(states)
            result = {}
            for index,key in enumerate(['all','easy','medium','hard','100+']):
                old,new = snapshots[0][index]['cards'],snapshots[1][index]['cards']
                expected_addition = locale == 'en' and index in [0,4]
                if expected_addition:
                    assert len(new) == len(old)+1
                    assert new[:-1] == old, (locale,key,'legacy card/order mismatch')
                    assert new[-1]['href'] == NEW
                else:
                    assert new == old, (locale,key,'card mismatch')
                    assert snapshots[0][index]['button'] == snapshots[1][index]['button']
                result[key] = {'before':len(old),'after':len(new),'legacy_card_html_and_order_unchanged':True,
                               'legacy_cards_sha256':digest(old)}
            assert len(snapshots[0][0]['cards']) == 49 if locale == 'en' else True
            if locale == 'en':
                assert 'All' in snapshots[1][0]['button'] and '50' in snapshots[1][0]['button']
                assert '100+ dots' in snapshots[1][4]['button']
            report['collections'][locale] = result
            before,after = [await inspect(api,pages[0],path) for api in apis]
            expected_schema_change = None
            if locale == 'en':
                # The sole Schema difference must be the accurate ItemList count.
                b = before['seo']['schema'][0]['@graph'][0]['mainEntity']
                a = after['seo']['schema'][0]['@graph'][0]['mainEntity']
                assert b['numberOfItems'] == 49 and a['numberOfItems'] == 50
                a['numberOfItems'] = 49
                expected_schema_change = {'ItemList.numberOfItems':{'before':49,'after':50}}
            assert before['seo'] == after['seo'], (locale,'SEO mismatch')
            assert before['status'] == after['status'] == 200
            assert before['headers'] == after['headers']
            if locale == 'en':
                a['numberOfItems'] = 50
            report['seo'][path] = {'protected_fields_unchanged':True, 'before':before, 'after':after, 'allowed_diff':expected_schema_change}
            print(f'PASS collection filters and SEO: {locale}', flush=True)
        for agent in [None,'Googlebot','Bingbot']:
            before,after = [await inspect(api,pages[0],NEW,agent) for api in apis]
            assert before['seo'] == after['seo'] and before['headers'] == after['headers']
            assert before['status'] == after['status'] == 200
            assert any('index, follow' in x for x in after['seo']['meta'])
            assert after['headers']['x-robots-tag'] is None
            assert 'hreflang' not in (after['headers']['link'] or '')
            report['seo'][NEW + (agent or 'browser')] = {'protected_fields_unchanged':True,'after':after}
        for locale in LOCALES[1:]:
            path = f'/{locale}{NEW}'
            before,after = [await inspect(api,pages[0],path) for api in apis]
            assert before['status'] == after['status'] == 404
            assert before['headers'] == after['headers']
            assert before['seo'] == after['seo']
            assert any('noindex' in x for x in after['seo']['meta'])
            report['seo'][path] = {'before_status':404,'after_status':404,'noindex':True}
        maps = []
        for api in apis:
            response = await api.get('/sitemap.xml')
            assert response.status == 200
            root = ET.fromstring(await response.body())
            for entry in root:
                for node in list(entry):
                    if node.tag.endswith('lastmod'):
                        entry.remove(node)
            maps.append(ET.tostring(root))
            entries = [e for e in root if any(n.tag.endswith('loc') and n.text.endswith(NEW) for n in e)]
            assert len(entries) == 1 and len(entries[0]) == 3
        assert maps[0] == maps[1]
        robots = [await (await api.get('/robots.txt')).body() for api in apis]
        assert robots[0] == robots[1]
        report['sitemap'] = {'unchanged_excluding_build_lastmod':True,'mountain_english_entries':1,'mountain_language_alternates':0,'sha256':digest(maps[0])}
        report['robots_txt'] = {'unchanged':True,'sha256':digest(robots[0])}
        page = pages[1]
        await contexts[1].clear_cookies()
        for width in [1440,390]:
            await page.set_viewport_size({'width':width,'height':1000 if width == 1440 else 844})
            await page.goto('http://localhost:3101/printable-connect-the-dots/',wait_until='networkidle')
            assert await page.locator(CARD).count() == 50
            assert await page.get_by_text('Showing 50 of 50 printables',exact=True).count() == 1
            await page.locator('#printable-grid aside button').nth(4).click()
            card = page.locator(f'{CARD}[href="{NEW}"]')
            await card.scroll_into_view_if_needed()
            text = await card.inner_text()
            assert 'Dots: 120' in text and 'Adults' in text and 'Unrated' in text
            assert 'Popularity' not in text and 'Extreme' not in text
            img = card.locator('img')
            await img.evaluate('(img)=>img.decode()')
            # With a width-descriptor srcset, naturalWidth is density-corrected.
            assert await img.evaluate('(img)=>img.naturalWidth > 0')
            assert (await img.get_attribute('src')).endswith('/v0.2/Mountain-Landscape-120-Puzzle-preview.png')
            assert await img.evaluate('(img)=>getComputedStyle(img).objectFit') == 'contain'
            assert await page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            await page.screenshot(path=str(OUT/f'collection-{width}.png'))
            await card.screenshot(path=str(OUT/f'mountain-card-{width}.png'))
            report['mobile'][str(width)] = {'no_horizontal_overflow':True,'mountain_thumbnail_decoded':True,'card_text':text}
        async with page.expect_navigation():
            await card.click()
        assert page.url == f'http://localhost:3101{NEW}'
        assert await page.get_by_role('heading',level=1).inner_text() == 'Mountain Landscape — 120-Point Dot to Dot'
        for label in ['Puzzle','Solution']:
            link = page.get_by_role('link',name=f'Download {label} PDF',exact=True)
            href = await link.get_attribute('href')
            async with page.expect_download() as info:
                await link.click()
            download = await info.value
            assert await download.failure() is None
            data = Path(await download.path()).read_bytes()
            response = await apis[1].get(href)
            assert response.status == 200 and 'application/pdf' in response.headers['content-type']
            assert data == await response.body() == (ROOT/'public'/href.lstrip('/')).read_bytes()
            assert data.startswith(b'%PDF-')
            report['downloads'].append({'label':label,'href':href,'status':200,'type':'application/pdf','browser_download_matches_original':True,'sha256':digest(data)})
        for api in apis:
            await api.dispose()
        await browser.close()
    (OUT/'regression.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'result':'PASS','collection_counts':report['collections'],'downloads':report['downloads'],'sitemap':report['sitemap']},ensure_ascii=False,indent=2))


asyncio.run(run())
