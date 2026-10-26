"""Compare ef4996e and the indexability fix in local production builds on 3100/3101.

Only localhost is requested. Production Host/proto headers exercise application
SEO without deploying or claiming that the live hosting/CDN response was tested.
"""
import asyncio
import hashlib
import json
import urllib.robotparser
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlsplit

import fitz
from playwright.async_api import async_playwright

R = Path(__file__).resolve().parents[3]
W = R / 'work/mountain-120-indexability'
W.mkdir(parents=True, exist_ok=True)
DOMAIN = 'https://connectthedotsprintable.online'
NEW = '/printables/mountain-landscape-120/'
LOCALES = ['en', 'de', 'es', 'pt', 'fr', 'it', 'nl']
PRODUCTION_HEADERS = {'host': 'connectthedotsprintable.online', 'x-forwarded-host': 'connectthedotsprintable.online', 'x-forwarded-proto': 'https', 'cookie': 'NEXT_LOCALE=en'}
SEO_HEADERS = ['link', 'x-robots-tag', 'location', 'refresh', 'content-type', 'x-middleware-rewrite', 'content-security-policy']
OLD = ['/', '/dot-to-dot-printable/', '/connect-the-dots-for-adults/', '/printable-connect-the-dots/', '/printables/adults/', '/printables/hard/',
       '/printables/6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots/',
       '/printables/7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots/']
for language in LOCALES[1:]:
    OLD += [f'/{language}/', f'/{language}/printable-connect-the-dots/', f'/{language}/dot-to-dot-printable/', f'/{language}/connect-the-dots-for-adults/']
BOUNDARIES = ['/printables/mountain-landscape-120-extra/', '/printables/mountain-landscape-120/extra/', '/de/printables/mountain-landscape-120-extra/']


def digest(data):
    return hashlib.sha256(data if isinstance(data, bytes) else json.dumps(data, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


async def inspect(api, page, path, agent=None):
    chain = []
    for _ in range(10):
        response = await api.get(path, max_redirects=0, headers={'user-agent': agent} if agent else {})
        headers = {key: response.headers.get(key) for key in SEO_HEADERS}
        chain.append({'path': path, 'status': response.status, 'headers': headers})
        if response.status not in [301, 302, 303, 307, 308]:
            break
        location = urlsplit(response.headers['location'])
        assert not location.netloc or location.netloc == 'connectthedotsprintable.online'
        path = location.path + ('?' + location.query if location.query else '')
    else:
        raise AssertionError('Redirect loop')
    raw = await response.body()
    html = await page.evaluate('''input=>{
      const d=new DOMParser().parseFromString(input,'text/html');
      const attrs=(selector)=>[...d.querySelectorAll(selector)].map(x=>x.outerHTML).sort();
      const result={title:d.title,meta:attrs('meta'),seoLinks:attrs('link[rel="canonical"],link[rel="alternate"]'),
        h1:[...d.querySelectorAll('h1')].map(x=>x.textContent),
        headings:[...d.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(x=>[x.tagName,x.textContent]),
        links:[...d.querySelectorAll('a')].map(x=>[x.getAttribute('href'),x.textContent]),
        images:attrs('img'),schema:[...d.querySelectorAll('script[type="application/ld+json"]')].map(x=>x.textContent)};
      d.querySelectorAll('script,style').forEach(x=>x.remove());
      result.bodyText=(d.body.textContent||'').replace(/\\s+/g,' ').trim();return result;
    }''', raw.decode().replace('http://localhost:3100', 'http://local-production-test.invalid').replace('http://localhost:3101', 'http://local-production-test.invalid'))
    return {'chain': chain, 'html': html, 'raw_html_sha256': digest(raw)}


def sitemap_entries(raw):
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    root = ET.fromstring(raw)
    return {entry.find('s:loc', ns).text: entry for entry in root}


def stable_entry(entry):
    return [(child.tag, child.attrib, child.text) for child in entry if not child.tag.endswith('lastmod')]


async def run():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
        parse_context = await browser.new_context()
        parser = await parse_context.new_page()
        captures = {}
        apis = {}
        for label, port in [('before', 3100), ('after', 3101)]:
            api = await playwright.request.new_context(base_url=f'http://localhost:{port}', extra_http_headers=PRODUCTION_HEADERS)
            apis[label] = api
            captures[label] = {}
            for path in OLD + BOUNDARIES + [NEW]:
                captures[label][path] = await inspect(api, parser, path)
        comparisons = []
        for path in OLD + BOUNDARIES:
            before, after = captures['before'][path], captures['after'][path]
            assert before['html'] == after['html'], path + ' HTML semantics changed'
            assert before['chain'] == after['chain'], path + ' HTTP SEO changed'
            comparisons.append({'path': path, 'scope': 'existing protected URL' if path in OLD else 'exact-match boundary',
                'html_semantics_equal': True, 'http_seo_chain_equal': True,
                'before_html_sha256': before['raw_html_sha256'], 'after_html_sha256': after['raw_html_sha256'],
                'html_semantics_sha256': digest(after['html']), 'response_chain': after['chain'],
                'title': after['html']['title'], 'meta': after['html']['meta'], 'h1': after['html']['h1'], 'canonical_and_html_hreflang': after['html']['seoLinks']})
        before, after = captures['before'][NEW], captures['after'][NEW]
        assert before['chain'][0]['status'] == after['chain'][0]['status'] == 200
        assert 'hreflang=' in before['chain'][0]['headers']['link']
        assert 'hreflang=' not in (after['chain'][0]['headers']['link'] or '')
        assert 'noindex' in ' '.join(before['html']['meta'])
        assert any('name="robots" content="index, follow"' in m for m in after['html']['meta'])
        assert 'noindex' not in ' '.join(after['html']['meta']).lower()
        assert not after['chain'][0]['headers']['x-robots-tag']
        for field in before['html']:
            if field != 'meta':
                assert before['html'][field] == after['html'][field], 'New page unexpectedly changed ' + field
        before_meta = [m for m in before['html']['meta'] if 'name="robots"' not in m]
        after_meta = [m for m in after['html']['meta'] if 'name="robots"' not in m]
        assert before_meta == after_meta
        assert after['html']['seoLinks'] == [f'<link rel="canonical" href="{DOMAIN}{NEW}">']
        for agent in ['Googlebot', 'bingbot']:
            sample = await inspect(apis['after'], parser, NEW, agent)
            assert sample['chain'][0]['status'] == 200 and not sample['chain'][0]['headers']['x-robots-tag']
            assert 'noindex' not in ' '.join(sample['html']['meta']).lower()
        language_checks = []
        for language in LOCALES:
            path = f'/{language}' + NEW
            for label in ['before', 'after']:
                sample = await inspect(apis[label], parser, path)
                if language != 'en':
                    assert sample['chain'][-1]['status'] == 404
                    assert 'noindex' in ' '.join(sample['html']['meta'])
                if label == 'after':
                    assert all('hreflang=' not in (c['headers']['link'] or '') for c in sample['chain'])
                    language_checks.append({'path': path, 'chain': sample['chain'], 'html_alternates': sample['html']['seoLinks']})
        maps = {}
        robots = {}
        for label, api in apis.items():
            response = await api.get('/sitemap.xml')
            assert response.status == 200 and not response.headers.get('x-robots-tag')
            maps[label] = sitemap_entries(await response.body())
            response = await api.get('/robots.txt')
            assert response.status == 200
            robots[label] = await response.text()
        assert robots['before'] == robots['after']
        rules = urllib.robotparser.RobotFileParser()
        rules.parse(robots['after'].splitlines())
        assert all(rules.can_fetch(agent, DOMAIN + NEW) for agent in ['Googlebot', 'bingbot', '*'])
        assert set(maps['after']) - set(maps['before']) == {DOMAIN + NEW}
        assert not set(maps['before']) - set(maps['after'])
        assert all(stable_entry(entry) == stable_entry(maps['after'][url]) for url, entry in maps['before'].items())
        assert not any('link' in child.tag for child in maps['after'][DOMAIN + NEW])
        assert not any(DOMAIN + '/' + language + NEW in maps['after'] for language in LOCALES)
        assert any(href == NEW for href, _ in captures['after']['/printable-connect-the-dots/']['html']['links'])
        # All six public v0.2 artifacts must remain identical, independent of downloads.
        assets = []
        for source in sorted((R / 'public/printables/mountain-landscape-120/v0.2').iterdir()):
            path = NEW + 'v0.2/' + source.name
            responses = [await api.get(path) for api in apis.values()]
            assert all(response.status == 200 for response in responses)
            bodies = [await response.body() for response in responses]
            assert bodies[0] == bodies[1] == source.read_bytes()
            assets.append({'path': path, 'before_after_source_bytes_equal': True, 'sha256': digest(bodies[1])})
        context = await browser.new_context(base_url='http://localhost:3101', accept_downloads=True)
        await context.route('**/*', lambda route: route.continue_() if route.request.url.startswith('http://localhost:3101') and '/_next/image?url=http' not in route.request.url else route.abort())
        page = await context.new_page()
        await page.goto(NEW, wait_until='domcontentloaded')
        downloads = []
        for role in ['Puzzle', 'Solution']:
            async with page.expect_download() as pending:
                await page.get_by_role('link', name=f'Download {role} PDF', exact=True).click()
            downloaded = await pending.value
            output = W / downloaded.suggested_filename
            await downloaded.save_as(output)
            original = R / 'public/printables/mountain-landscape-120/v0.2' / downloaded.suggested_filename
            assert original.read_bytes() == output.read_bytes()
            doc = fitz.open(output)
            assert len(doc) == 1 and doc[0].get_text().count('ConnectTheDotsPrintable.online') == 1
            response = await apis['after'].get(NEW + 'v0.2/' + downloaded.suggested_filename)
            assert response.headers['content-type'] == 'application/pdf'
            downloads.append({'role': role, 'status': response.status, 'content_type': response.headers['content-type'], 'readable_pages': len(doc), 'brand_footer_once': True, 'sha256': digest(output.read_bytes()), 'source_bytes_equal': True})
        viewports = []
        for width in [1440, 390]:
            await page.set_viewport_size({'width': width, 'height': 1000})
            await page.goto(NEW, wait_until='domcontentloaded')
            await page.locator('summary').click()
            await page.locator('main img').evaluate_all('(images)=>Promise.all(images.map(img=>img.decode()))')
            measures = await page.evaluate('({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,images:[...document.querySelectorAll("main img")].map(i=>[i.naturalWidth,i.naturalHeight])})')
            assert measures['scrollWidth'] == width and measures['images'] == [[1191, 1684], [1191, 1684]]
            await page.screenshot(path=str(W / f'preview-{width}.png'), full_page=True)
            viewports.append(measures)
        await page.goto('/printable-connect-the-dots/', wait_until='domcontentloaded')
        await page.get_by_role('link', name='Preview Mountain Landscape 120 & download PDFs').click()
        await page.wait_for_url('**' + NEW, wait_until='domcontentloaded')
        result = {'baseline_sha': 'ef4996ee1cdcffe154b5e9823bd00472d796e43d', 'mode': 'next build + next start; production Host and HTTPS forwarded headers; local, not deployed', 'comparison_normalization': 'Only localhost:3100 and localhost:3101 in inherited fallback OG/Twitter metadata normalized to one test origin. Raw HTML hashes retained. Build chunk scripts are excluded from semantic comparison. No production URLs or SEO directives normalized.',
            'existing_url_count': len(OLD), 'boundary_count': len(BOUNDARIES), 'existing_url_regression': comparisons,
            'new_page': {'before': before, 'after': after, 'googlebot_bingbot_200_indexable': True, 'language_variants': language_checks},
            'sitemap': {'added': [DOMAIN + NEW], 'existing_entries_unchanged_except_build_time_lastmod': True, 'existing_count': len(maps['before']), 'new_entry': ET.tostring(maps['after'][DOMAIN + NEW], encoding='unicode'), 'new_entry_language_alternates': []},
            'robots_txt_unchanged_and_allows_crawling': True, 'directory_html_link_unchanged': True, 'directory_click_pass': True,
            'assets': assets, 'downloads': downloads, 'viewports': viewports, 'physical_print': 'Pending', 'independent_playtest': 'Pending'}
        (W / 'results.json').write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n')
        print(json.dumps({'result': 'PASS', 'protected_urls': len(OLD), 'boundaries': len(BOUNDARIES), 'downloads': downloads, 'viewports': viewports}))
        await context.close()
        await parse_context.close()
        for api in apis.values():
            await api.dispose()
        await browser.close()


if __name__ == '__main__':
    asyncio.run(run())
