exec(open('/workspace/work/pr2-revision/capture.py').read().split('async def main():')[0].replace('PHASE = sys.argv[1]', 'PHASE = "actions"').replace("sys.argv[2]", "'3101'"))

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
        result={}
        await page.goto(base+'/dot-to-dot-printable/',wait_until='networkidle')
        cards=await page.locator('#puzzle-gallery a').all_text_contents()
        assert len(cards)==49
        assert sum('Dots: Catalog ' in c for c in cards)==47
        assert sum('Not applicable (reference art)' in c for c in cards)==2
        assert await page.get_by_text('Export checked: PDF + solution PNG',exact=True).count()==4
        result['F01']={'catalog_ranges':47,'reference_artwork':2,'export_checked_labels':4,'precise_count_verified_claims':0}
        counts={}
        for label,count in [('Easy',27),('Medium',20),('Hard',1),('Extreme',1),('All Levels',49)]:
            await page.get_by_role('button',name=label,exact=True).click()
            await page.wait_for_timeout(100)
            actual=await page.locator('#puzzle-gallery a').count()
            assert actual==count,(label,actual)
            counts[label]=actual
        result['filters']=counts
        await page.get_by_role('button',name='Browse Free PDFs ↓',exact=True).click()
        await page.wait_for_function("Math.abs(document.getElementById('puzzle-gallery').getBoundingClientRect().top) < 200", timeout=10000)
        result['browse_scroll']=True
        for path in targets:
            await page.goto(base+'/'+path,wait_until='networkidle')
            await page.screenshot(path=str(OUT/(path.strip('/')+'-desktop.png')),full_page=True)
            link=page.get_by_role('link',name='Make a puzzle from your own image',exact=True)
            assert await link.get_attribute('href')=='/#hero-upload-btn'
            await link.click()
            await page.wait_for_url('**/#hero-upload-btn')
            assert await page.locator('#hero-file-input').count()==1
            assert await page.locator('#hero-upload-btn').is_visible()
            result[path]={'cta_target':page.url,'upload_input':True}
        await page.locator('#hero-file-input').set_input_files(str(ROOT/'public/generated/dot-to-dot/standalone-openclipart/simple-rabbit-outline-reference.webp'))
        await page.wait_for_timeout(1500)
        result['upload_editor_visible']=await page.locator('#editor-view').is_visible()
        result['opencv_loaded']=await page.evaluate('typeof window.cv !== "undefined"')
        result['upload_export']='not verified: external OpenCV is blocked' if not result['opencv_loaded'] else 'not exercised'
        await page.set_viewport_size({'width':390,'height':844})
        for path in targets:
            await page.goto(base+'/'+path,wait_until='networkidle')
            assert await page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            await page.screenshot(path=str(OUT/(path.strip('/')+'-mobile.png')),full_page=True)
        result['mobile_no_horizontal_overflow']=True
        await page.goto(base+'/printables/simple-rabbit-outline/',wait_until='networkidle')
        async def fail_solution(route):
            await route.abort()
        await page.route('**/simple-rabbit-outline-solution.webp?t=*',fail_solution)
        messages=[]
        async def accept_dialog(dialog):
            messages.append(dialog.message)
            await dialog.accept()
        page.once('dialog',accept_dialog)
        await page.get_by_role('button',name='Download PNG',exact=True).click()
        assert messages==['Failed to download image.'],messages
        await page.wait_for_timeout(100)
        assert await page.get_by_role('button',name='Download PNG',exact=True).is_enabled()
        result['failed_png_reports_error_and_recovers']=True
        result['full_upload_numbered_preview_pdf']='Not Verified: R2 OpenCV blocked; 02 Work browser QA required'
        (OUT/'results.json').write_text(json.dumps(result,indent=2))
        (OUT/'blocked-requests.json').write_text(json.dumps(sorted(set(blocked)),indent=2))
        print(json.dumps(result,indent=2),flush=True)
        await browser.close()

asyncio.run(main())
