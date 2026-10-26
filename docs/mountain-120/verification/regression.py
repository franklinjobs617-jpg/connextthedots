import asyncio,json,hashlib,io
from pathlib import Path
import fitz
from PIL import Image
from playwright.async_api import async_playwright
R=Path(__file__).resolve().parents[3]; W=R/'work/mountain-120-browser'; W.mkdir(parents=True,exist_ok=True); data=json.loads((R/'lib/generated-standalone-printables.json').read_text());items=data[:4]
async def run():
 result={}
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  for label,port in [('before',3100),('after',3101)]:
   context=await browser.new_context(base_url=f'http://localhost:{port}',accept_downloads=True)
   await context.route('**/*',lambda route: route.continue_() if (route.request.url.startswith(f'http://localhost:{port}') and '/_next/image?url=http' not in route.request.url) else route.abort())
   page=await context.new_page();result[label]={}
   for item in items:
    print(label,item['id'],flush=True)
    await page.goto(item['detailPage'],wait_until='domcontentloaded')
    await page.wait_for_function("Object.keys([...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Download PDF') || {}).some(k=>k.startsWith('__reactProps$'))")
    one={}
    for button in ['Download PDF','Download PNG']:
     async with page.expect_download() as info:await page.get_by_role('button',name=button,exact=True).click()
     download=await info.value;out=W/(label+'-'+download.suggested_filename);await download.save_as(out)
     if button=='Download PDF':
      doc=fitz.open(out); assert len(doc)==1
      page0=doc[0];assert 'ConnectTheDotsPrintable.online' in page0.get_text()
      image=doc.extract_image(page0.get_images()[0][0]); one['pdf']={'pages':len(doc),'page_size':[round(x,2) for x in page0.rect[2:]],'text':page0.get_text(),'embedded_image_sha256':hashlib.sha256(image['image']).hexdigest()}
     else:
      image=Image.open(out).convert('RGBA');res=await context.request.get(item['solutionUrl']);source=Image.open(io.BytesIO(await res.body())).convert('RGBA')
      assert image.size==source.size and image.tobytes()==source.tobytes()
      one['png']={'size':image.size,'pixel_sha256':hashlib.sha256(image.tobytes()).hexdigest(),'source_pixels_equal':True}
    result[label][item['id']]=one
   await context.close()
  assert result['before']==result['after']
  (W/'regression.json').write_text(json.dumps({'downloads_per_build':len(items)*2,'before_after_outputs_equal':True,'baseline_sha':'ef4996ee1cdcffe154b5e9823bd00472d796e43d','results':result},indent=2))
  print('PASS: 4 existing entries × 2 download buttons × before/after = 16 browser downloads; equivalent PDF image/text and exact solution pixels.')
  await browser.close()
asyncio.run(run())
