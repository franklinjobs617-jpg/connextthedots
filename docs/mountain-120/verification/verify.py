import asyncio,json,hashlib,re
from pathlib import Path
from playwright.async_api import async_playwright
R=Path(__file__).resolve().parents[3]; W=R/'work/mountain-120-browser'; W.mkdir(parents=True,exist_ok=True)
slugs=['6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots','7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots']
paths=['/','/dot-to-dot-printable/','/connect-the-dots-for-adults/','/printable-connect-the-dots/','/printables/adults/','/printables/hard/']+['/printables/'+s+'/' for s in slugs]
for locale in ['es','de','pt','fr','it','nl']:
 paths += [f'/{locale}/',f'/{locale}/printable-connect-the-dots/',f'/{locale}/dot-to-dot-printable/',f'/{locale}/connect-the-dots-for-adults/']
async def snapshot(page,path):
 response=await page.request.get(path)
 return await page.evaluate('''input=>{const document=new DOMParser().parseFromString(input.html,'text/html');return {status:input.status,title:document.title,meta:[...document.querySelectorAll('meta')].map(x=>x.outerHTML).sort(),seoLinks:[...document.querySelectorAll('link[rel="canonical"],link[rel="alternate"]')].map(x=>x.outerHTML).sort(),h1:[...document.querySelectorAll('h1')].map(x=>x.textContent),headings:[...document.querySelectorAll('h2,h3')].map(x=>x.textContent),hrefs:[...document.querySelectorAll('a')].map(x=>x.getAttribute('href')),schema:[...document.querySelectorAll('script[type="application/ld+json"]')].map(x=>x.textContent)}}''',{'html':await response.text(),'status':response.status})
async def run():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  results={}; captures={}
  for label,port in [('main',3100),('head',3101)]:
   context=await browser.new_context(base_url=f'http://localhost:{port}',viewport={'width':1440,'height':1000})
   await context.route('**/*',lambda route: route.continue_() if (route.request.url.startswith(f'http://localhost:{port}') and '/_next/image?url=http' not in route.request.url) else route.abort())
   page=await context.new_page();captures[label]={}
   for path in paths:
    print(label,path,flush=True); captures[label][path]=await snapshot(page,path)
   await context.close()
  diffs={}
  for path in paths:
   a,b=captures['main'][path],captures['head'][path]
   d={k:{'before':a[k],'after':b[k]} for k in a if a[k]!=b[k]}
   if d:diffs[path]=d
  assert set(diffs)=={'/printable-connect-the-dots/'},diffs.keys()
  assert set(diffs['/printable-connect-the-dots/'])=={'headings','hrefs'}
  results['existing_pages']={'count':len(paths),'protected_metadata_h1_schema_equal':True,'only_changed_path':'/printable-connect-the-dots/','changes':diffs}
  context=await browser.new_context(base_url='http://localhost:3101',accept_downloads=True)
  await context.route('**/*',lambda route: route.continue_() if (route.request.url.startswith('http://localhost:3101') and '/_next/image?url=http' not in route.request.url) else route.abort())
  page=await context.new_page();new='/printables/mountain-landscape-120/'
  results['new_page']=await snapshot(page,new)
  assert results['new_page']['seoLinks']==['<link rel="canonical" href="https://connectthedotsprintable.online/printables/mountain-landscape-120/">']
  await page.goto(new,wait_until='domcontentloaded')
  assert any('noindex' in m and 'robots' in m for m in results['new_page']['meta'])
  results['downloads']=[]
  for role in ['Puzzle','Solution']:
   async with page.expect_download() as info: await page.get_by_role('link',name=f'Download {role} PDF',exact=True).click()
   dl=await info.value;out=W/dl.suggested_filename;await dl.save_as(out)
   source=R/'public/printables/mountain-landscape-120/v0.2'/dl.suggested_filename
   assert out.read_bytes()==source.read_bytes()
   response=await context.request.get('/printables/mountain-landscape-120/v0.2/'+dl.suggested_filename)
   assert response.status==200 and response.headers['content-type']=='application/pdf'
   import fitz
   doc=fitz.open(out);assert len(doc)==1
   results['downloads'].append({'role':role,'filename':dl.suggested_filename,'status':response.status,'content_type':response.headers['content-type'],'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'source_bytes_equal':True,'readable_pages':len(doc)})
  results['viewports']=[]
  for width in [1440,390]:
   await page.set_viewport_size({'width':width,'height':1000});await page.goto(new,wait_until='domcontentloaded');await page.get_by_role('heading',level=1).wait_for()
   await page.locator('summary').click()
   await page.locator('main img').evaluate_all('(images)=>Promise.all(images.map(img=>img.decode()))')
   size=await page.evaluate('({scroll:document.documentElement.scrollWidth,viewport:innerWidth,images:[...document.querySelectorAll("main img")].map(x=>({width:x.naturalWidth,height:x.naturalHeight,displayWidth:x.clientWidth}))})')
   assert size['scroll']<=width and all(x['width']==1191 and x['height']==1684 for x in size['images'])
   await page.screenshot(path=str(W/f'mountain-{width}.png'),full_page=True)
   results['viewports'].append({'width':width,**size})
  results['locale_guards']={}
  for locale in ['es','de','pt','fr','it','nl']:
   response=await context.request.get('/'+locale+new); html=await response.text()
   assert 'NEXT_HTTP_ERROR_FALLBACK;404' in html or response.status==404
   assert 'name="robots" content="noindex"' in html
   results['locale_guards'][locale]={'http_status':response.status,'not_found':True,'noindex':True}
  await context.clear_cookies()
  await page.goto('/printable-connect-the-dots/',wait_until='domcontentloaded')
  await page.get_by_role('link',name='Preview Mountain Landscape 120 & download PDFs').click()
  await page.wait_for_url('**'+new,wait_until='domcontentloaded')
  assert page.url.endswith(new)
  results['directory_entry_navigation']=True
  (W/'results.json').write_text(json.dumps(results,indent=2))
  (W/'captures.json').write_text(json.dumps(captures,indent=2))
  print(json.dumps({'existing_pages':len(paths),'downloads':results['downloads'],'viewports':results['viewports'],'locale_guards':results['locale_guards']}))
  await context.close();await browser.close()
asyncio.run(run())
