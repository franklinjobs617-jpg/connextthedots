#!/usr/bin/env python3
"""Only the three Founder-approved resources. Never writes shared catalogs/manifests."""
from pathlib import Path
import importlib.util,json,math,hashlib,argparse
import fitz
ROOT=Path(__file__).resolve().parents[2]
def module(name,path):
 s=importlib.util.spec_from_file_location(name,ROOT/path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
original=module('original','scripts/original-sheets/build.py')
localizer=module('localizer','scripts/localized-printables/build.py')
def sha(b):return hashlib.sha256(b).hexdigest()
def export_original(id,papers):
 d=next(x for x in json.loads(Path(__file__).with_name('designs.json').read_text())if x['id']==id)
 folder=ROOT/'public/printables'/id/'v1';folder.mkdir(parents=True,exist_ok=True)
 d['points']=original.sample(d['anchors'],d['count']);d['labels']=original.layout(d['points'],d['details'])
 d.update(schemaVersion=1,units='mm',frame=[210,279.4],labelFont='Helvetica',labelFontPt=9,dotRadiusMm=.48,connection='1..N then N to 1',license=original.SOURCE_USAGE)
 (folder/'geometry.json').write_text(json.dumps(d,indent=2)+'\n')
 (folder/'SOURCE.md').write_text(f'# {d["title"]}: original November 2026 source\n\nOriginal coordinates authored in the C11 Founder-approved three-resource task; no competitor tracing or image-generation input. Source anchors: scripts/three-assets-20261105/designs.json. {d["count"]} unique sequential points, close {d["count"]} to 1; fixed details are explicitly recorded in geometry.json.\n\n'+original.SOURCE_USAGE+'\n\n9pt standard Helvetica; minimum center spacing 3.3mm. Each PNG is rasterized from its own final PDF. Physical print, independent human full solve, difficulty/age/solve time: NOT TESTED / NOT MEASURED. Approval to produce is not release approval.\n')
 for paper in papers:
  for kind in ['Puzzle','Solution']:
   target=folder/f'{id}-{paper}-{kind}.pdf';original.render(d,paper,kind=='Solution',target)
   if not d['details'] and not d['eyes']:
    pdf=fitz.open(target);page=pdf[0];phrase='Solid details are already drawn.';rect=page.search_for(phrase)[0];span=next(s for block in page.get_text('dict')['blocks'] for line in block.get('lines',[]) for s in line['spans'] if phrase in s['text']);page.add_redact_annot(rect,fill=False);page.apply_redactions(images=0,graphics=0,text=0);page.insert_text((rect.x0,span['origin'][1]),'No pre-drawn details.',fontname='helv',fontsize=9);data=pdf.tobytes(garbage=4,deflate=True,no_new_id=True);pdf.close();target.write_bytes(data)
    with fitz.open(target)as final:final[0].get_pixmap(matrix=fitz.Matrix(1.5,1.5),alpha=False).save(target.with_suffix('.png'))
 return d
IT={ 'points':'punti','Puzzle':'SCHEDA','Solution':'SOLUZIONE','paper':'Letter USA',
'range':'Collega i numeri in ogni intervallo. Solleva la matita tra gli intervalli.',
'close':'C: chiudi dal punto finale al primo dello stesso intervallo. O: fermati. Non unire intervalli.',
'ranges':'Intervalli:', 'print':'50 mm | Stampa al 100 %, sul formato indicato. Usa la soluzione della stessa versione.',
'test':'Stampa fisica e risoluzione umana indipendente: NON TESTATE. Tempo: NON MISURATO.',
'credit':'© 2026 ConnectTheDotsPrintable.online. Uso personale e didattico.',
'license':'Uso commerciale solo con autorizzazione scritta. Consulta i termini del sito.'}
PARTS=['Corpo e ciuffi auricolari','Disco facciale sinistro','Disco facciale destro','Occhio sinistro','Occhio destro','Becco','Penne remiganti sinistre','Penne remiganti destre','Motivi a V sul petto','Piumaggio inferiore']
def export_it(papers):
 localizer.COPY['it']=IT;id='tufted-owl-study-207';stem='tufted-owl-study';source=ROOT/'public/printables'/id/'v2';folder=ROOT/'public/localized-printables/it'/id/'v1';folder.mkdir(parents=True,exist_ok=True)
 geometry=(source/'geometry.json').read_bytes();g=json.loads(geometry);segments=[{k:s[k]for k in ['name','start','end','closed']}for s in g['segments']];resource={'locale':'it','id':id,'title':'Gufo con ciuffi auricolari','count':207,'segments':segments,'sourceGeometry':f'/printables/{id}/v2/geometry.json','sourceGeometrySha256':sha(geometry),'exports':[]};audits=[];font=fitz.Font(fontfile=str(localizer.FONT))
 for paper in papers:
  for kind in ['Puzzle','Solution']:
   src=source/f'{stem}-{paper}-{kind}.pdf';pdf=fitz.open(src);p=pdf[0];numbers=localizer.plot_spans(p);numeric=[fitz.Rect(s['bbox'])for s in localizer.spans(p)if localizer.re.fullmatch(r'[\d\s]+',s['text'].strip())];clip=numeric[0]
   for rect in numeric[1:]:clip|=rect
   clip=clip+(-8,-8,8,8);before=p.get_pixmap(matrix=fitz.Matrix(1.5,1.5),clip=clip,alpha=False).samples;replacements=[]
   for s in localizer.spans(p):
    text=s['text'].strip();t=localizer.replace_text(text,'it',resource['title'],207,kind,paper)
    if t is None:continue
    rect=fitz.Rect(s['bbox']);assert not rect.intersects(clip);p.add_redact_annot(rect,fill=False,cross_out=False);replacements.append((s,t))
   p.apply_redactions(images=0,graphics=0,text=0);p.insert_font(fontname='L10N',fontfile=str(localizer.FONT));sizes=[]
   for s,t in replacements:
    x,y=s['origin'];size=min(s['size'],17,(p.rect.width-x-28)/font.text_length(t,fontsize=1));assert size>=6.5,(t,size);p.insert_text((x,y),t,fontname='L10N',fontsize=size);sizes.append(size)
   pdf.set_metadata({'title':f'{resource["title"]} — {IT[kind]} — {paper}','author':'ConnectTheDotsPrintable.online','subject':f'it | 207 punti | 10 segmenti | {IT[kind]} | {paper}','creator':'ConnectTheDotsPrintable selective Italian exporter'});pdf.xref_set_key(pdf.pdf_catalog(),'Lang','(it)');pdf.subset_fonts();target=folder/f'{id}-it-{paper}-{kind}.pdf';pdf.save(target,garbage=4,deflate=True,no_new_id=True);pdf.close()
   with fitz.open(target)as final:
    p=final[0];assert numbers==localizer.plot_spans(p);assert before==p.get_pixmap(matrix=fitz.Matrix(1.5,1.5),clip=clip,alpha=False).samples;p.get_pixmap(matrix=fitz.Matrix(1.5,1.5),alpha=False).save(target.with_suffix('.png'));text=p.get_text();assert '100 a 1'not in text and IT['close']in text and IT[kind]in text and '\ufffd'not in text
   resource['exports'].append({'paper':paper,'kind':kind,'pdf':'/'+str(target.relative_to(ROOT/'public')),'preview':'/'+str(target.with_suffix('.png').relative_to(ROOT/'public')),'sha256':sha(target.read_bytes()),'previewSha256':sha(target.with_suffix('.png').read_bytes()),'sourcePdf':'/'+str(src.relative_to(ROOT/'public')),'sourcePdfSha256':sha(src.read_bytes())});audits.append({'paper':paper,'kind':kind,'plotPixelsUnchanged':True,'numericSpansUnchanged':True,'minimumTextPt':min(sizes)})
 (folder/'manifest-fragment.json').write_text(json.dumps(resource,ensure_ascii=False,indent=2)+'\n');contract={'task':'segmented','copy':IT,'segments':[{**s,'itName':name}for s,name in zip(segments,PARTS)],'independentItalianReview':'NOT TESTED','pdfExtraPartNames':False};(folder/'task-contract.json').write_text(json.dumps(contract,ensure_ascii=False,indent=2)+'\n');(folder/'SOURCE.md').write_text('# Italian Owl207 selective export\n\nUnchanged project-owned English v2 geometry/plot/number labels. Italian instructions only; six closed and four open ranges, never bridge ranges or close 207 to 1. Full numeric range/C-O list retained. Web part names in task-contract.json; independent Italian review NOT TESTED.\n\n'+original.SOURCE_USAGE+'\n\nFont: system DejaVu Sans, existing localization pipeline; no font binary copied. Physical print and independent human full solve NOT TESTED. Shared manifest and all old exports are untouched.\n');return audits
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('task',choices=['turkey','it','snowflake']);p.add_argument('--paper',nargs='+',choices=['A4','Letter'],default=['A4','Letter']);args=p.parse_args();result=export_it(args.paper)if args.task=='it'else export_original('turkey-50'if args.task=='turkey'else'snowflake-60',args.paper);print(json.dumps(result if args.task=='it'else{'id':result['id'],'count':result['count']},ensure_ascii=False))
