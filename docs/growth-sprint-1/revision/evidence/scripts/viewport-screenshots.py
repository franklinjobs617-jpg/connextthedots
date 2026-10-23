exec(open('/workspace/work/pr2-revision/capture.py').read().split('async def main():')[0].replace('PHASE = sys.argv[1]', 'PHASE = "viewport-screenshots"').replace("sys.argv[2]", "'3101'"))

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        context = await browser.new_context(viewport={'width':1440,'height':1000})
        blocked=[]
        async def isolate(route):
            u=urlparse(route.request.url)
            if u.hostname not in ['localhost','127.0.0.1'] or (u.path.rstrip('/')=='/_next/image' and parse_qs(u.query).get('url',[''])[0].startswith('https:')):
                blocked.append(route.request.url)
                await route.abort()
            elif u.path.startswith('/api/'):
                blocked.append(route.request.url)
                await route.fulfill(status=200,content_type='application/json',body='[]')
            else:
                await route.continue_()
        await context.route('**/*',isolate)
        page=await context.new_page()
        for width in [1440,390]:
            await page.set_viewport_size({'width':width,'height':900})
            for target,selector,label in [('dot-to-dot-printable/','#puzzle-gallery','dot-gallery'),('connect-the-dots-for-adults/','#featured-puzzles','adults-featured')]:
                await page.goto(base+'/'+target,wait_until='networkidle')
                await page.locator(selector).evaluate("e => e.scrollIntoView({block: 'start', behavior: 'instant'})")
                await page.wait_for_timeout(500)
                await page.screenshot(path=str(OUT/(label+'-'+str(width)+'.png')))
        await browser.close()

asyncio.run(main())
