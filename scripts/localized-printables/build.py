#!/usr/bin/env python3
"""Localize existing PDF instructions; retain all original plot marks and labels.

Requires PyMuPDF and the freely licensed DejaVu Sans system font. No geometry,
point ordering, label placement, or accepted English file is regenerated.
"""
from pathlib import Path
import argparse, collections, hashlib, json, re, time
import fitz
ROOT = Path(__file__).resolve().parents[2]
FONT = Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')
OUT = ROOT / 'public/localized-printables'
SHEETS = {
 'fr': [('tufted-owl-study-207','tufted-owl-study','v2','Hibou à aigrettes',207),('hilltop-observatory-202','hilltop-observatory','v2','Observatoire sur la colline',202)],
 'it': [('elephant-100','elephant-100','v1','Elefante',100),('hot-air-balloon-100','hot-air-balloon-100','v1','Mongolfiera',100),('seahorse-100','seahorse-100','v1','Cavalluccio marino',100)],
 'es': [('elephant-100','elephant-100','v1','Elefante',100),('hot-air-balloon-100','hot-air-balloon-100','v1','Globo aerostático',100),('seahorse-100','seahorse-100','v1','Caballito de mar',100)],
}
COPY = {
 'fr': {
  'points':'points','Puzzle':'FICHE','Solution':'CORRIGÉ','paper':'Lettre US',
  'range':'Reliez les nombres consécutifs de chaque plage. Levez le crayon entre les plages.',
  'close':'C = relier le dernier point au premier. O = arrêter au dernier point. Ne reliez jamais deux plages.',
  'ranges':'Plages :',
  'print':'50 mm | Imprimez à taille réelle / 100 %. Vérifiez le format et la version du corrigé.',
  'test':'Impression papier et résolution humaine complète indépendante : NON TESTÉES. Durée : INCONNUE.',
  'credit':'© 2026 ConnectTheDotsPrintable.online. Téléchargement et impression à usage personnel et éducatif.',
  'license':'Usage commercial soumis à autorisation écrite préalable. Voir les conditions d’utilisation du site.',
 },
 'it': {
  'points':'punti','Puzzle':'SCHEDA','Solution':'SOLUZIONE','paper':'Letter USA',
  'sequence':'Collega da 1 a 100 in ordine, poi da 100 a 1. Alcuni dettagli sono già disegnati.',
  'instructions':'Stampa a dimensioni effettive / 100 %. Confronta la soluzione corrispondente separata.',
  'print':'Linea di controllo 50 mm | Stampa fisica e risoluzione umana indipendente: NON TESTATE.',
  'credit':'© 2026 ConnectTheDotsPrintable.online. Download e stampa gratuiti per uso personale e didattico.',
  'license':'L’uso commerciale richiede un’autorizzazione scritta preventiva. Vedi i termini del servizio.',
 },
 'es': {
  'points':'puntos','Puzzle':'FICHA','Solution':'SOLUCIÓN','paper':'Carta (EE. UU.)',
  'sequence':'Une del 1 al 100 en orden y luego del 100 al 1. Algunos detalles ya están dibujados.',
  'instructions':'Imprime a tamaño real / 100 %. Compara con la solución correspondiente por separado.',
  'print':'Línea de control de 50 mm | Impresión física y resolución humana independiente: NO PROBADAS.',
  'credit':'© 2026 ConnectTheDotsPrintable.online. Descarga e impresión gratuitas para uso personal y educativo.',
  'license':'El uso comercial requiere permiso previo por escrito. Consulta los términos del servicio.',
 },
}
def sha(data): return hashlib.sha256(data).hexdigest()
def spans(page):
 return [s for b in page.get_text('dict')['blocks'] for l in b.get('lines',[]) for s in l['spans']]
def plot_spans(page):
 # MuPDF sometimes merges neighboring numeric labels into one text span.
 return [(s['text'], tuple(round(v,4) for v in s['origin']),round(s['size'],4),s['font']) for s in spans(page) if re.fullmatch(r'[\d\s]+',s['text'].strip())]
def replace_text(text,lang,title,count,kind,paper):
 c=COPY[lang]
 if re.fullmatch(r'[\d\s,CO-]+',text): return None
 if text.startswith(('Elephant |','Hot-air Balloon |','Seahorse |','Tufted owl study |','Hilltop observatory |')): return f'{title} | {count} {c["points"]}'
 if text.startswith(('A4 PUZZLE','A4 SOLUTION','Letter PUZZLE','Letter SOLUTION')):
  return f'{paper if paper=="A4" else c["paper"]} | {c[kind]} | {title} | 1–{count}'
 if text.startswith('Within each range'): return c['range']
 if text.startswith('C = close'): return c['close']
 if text.startswith('Ranges:'): return text.replace('Ranges:',c['ranges'])
 if text.startswith('Connect 1 to 100'): return c['sequence']
 if text.startswith('Print at Actual size'): return c['instructions']
 if text.startswith('50 mm'): return c['print']
 if text.startswith('Physical printing'): return c['test']
 if text.startswith('© 2026'): return c['credit']
 if text.startswith('Commercial use'): return c['license']
 raise ValueError(f'Unmapped nonnumeric text {lang}: {text!r}')
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--audit',type=Path);args=parser.parse_args()
 start=time.monotonic();font=fitz.Font(fontfile=str(FONT));manifest=[];audits=[]
 for lang,rows in SHEETS.items():
  for id,stem,version,title,count in rows:
   source_dir=ROOT/f'public/printables/{id}/{version}';geometry=(source_dir/'geometry.json').read_bytes();g=json.loads(geometry)
   segments=[{k:s[k] for k in ['name','start','end','closed']} for s in g.get('segments',[])]
   resource={'locale':lang,'id':id,'title':title,'count':count,'segments':segments,'sourceGeometry':f'/printables/{id}/{version}/geometry.json','sourceGeometrySha256':sha(geometry),'exports':[]}
   for paper in ['A4','Letter']:
    for kind in ['Puzzle','Solution']:
     source=source_dir/f'{stem}-{paper}-{kind}.pdf';pdf=fitz.open(source);page=pdf[0];original=plot_spans(page);original_text=page.get_text();replacements=[]
     # Compare the whole numbered plot area before/after, independently of text headers.
     numeric=[fitz.Rect(s['bbox']) for s in spans(page) if re.fullmatch(r'[\d\s]+',s['text'].strip())]
     clip=numeric[0]
     for rect in numeric[1:]:clip |= rect
     clip=clip+(-8,-8,8,8);before=page.get_pixmap(matrix=fitz.Matrix(1.5,1.5),clip=clip,alpha=False).samples
     for span in spans(page):
      text=span['text'].strip();translated=replace_text(text,lang,title,count,kind,paper)
      if translated is None:continue
      rect=fitz.Rect(span['bbox']);assert not rect.intersects(clip),('text overlaps plot',text)
      page.add_redact_annot(rect,fill=False,cross_out=False);replacements.append((span,translated))
     page.apply_redactions(images=0,graphics=0,text=0)
     page.insert_font(fontname='L10N',fontfile=str(FONT));sizes=[]
     for span,text in replacements:
      x,y=span['origin'];limit=page.rect.width-x-28;size=min(span['size'],17)
      size=min(size,limit/font.text_length(text,fontsize=1));assert size>=6.5,(lang,text,size)
      page.insert_text((x,y),text,fontname='L10N',fontsize=size,color=(0,0,0));sizes.append(size)
     pdf.set_metadata({'title':f'{title} — {COPY[lang][kind]} — {paper}', 'author':'ConnectTheDotsPrintable.online','subject':f'{lang} | {count} | {COPY[lang][kind]} | {paper}', 'keywords':f'{lang}, {id}, {paper}, {kind}', 'creator':'ConnectTheDotsPrintable localized PDF exporter'})
     pdf.xref_set_key(pdf.pdf_catalog(),'Lang',f'({lang})');pdf.subset_fonts()
     folder=OUT/lang/id/'v1';folder.mkdir(parents=True,exist_ok=True);target=folder/f'{id}-{lang}-{paper}-{kind}.pdf';pdf.save(target,garbage=4,deflate=True,no_new_id=True);pdf.close()
     with fitz.open(target) as final:
      q=final[0];after=plot_spans(q);assert original==after,('numeric label identity changed',target)
      assert before==q.get_pixmap(matrix=fitz.Matrix(1.5,1.5),clip=clip,alpha=False).samples,('plot changed',target)
      pix=q.get_pixmap(matrix=fitz.Matrix(1.5,1.5),alpha=False);pix.save(target.with_suffix('.png'))
      text=q.get_text();assert COPY[lang][kind] in text and title in text and '© 2026' in text and '\ufffd' not in text
      assert final.xref_get_key(final.pdf_catalog(),'Lang')[1]==lang
      audits.append({'path':str(target.relative_to(ROOT/'public')),'labelSpansUnchanged':True,'plotPixelsUnchanged':True,'pages':len(final),'paperBox':list(q.rect),'fontMinimumPt':min(sizes),'fonts':q.get_fonts(full=True),'language':lang,'text':text,'sourceSha256':sha(source.read_bytes()),'sha256':sha(target.read_bytes()),'geometrySha256':sha(geometry)})
     resource['exports'].append({'paper':paper,'kind':kind,'pdf':'/'+str(target.relative_to(ROOT/'public')),'preview':'/'+str(target.with_suffix('.png').relative_to(ROOT/'public')),'sha256':sha(target.read_bytes()),'previewSha256':sha(target.with_suffix('.png').read_bytes()),'sourcePdf':'/'+str(source.relative_to(ROOT/'public')),'sourcePdfSha256':sha(source.read_bytes())})
   manifest.append(resource)
 OUT.mkdir(parents=True,exist_ok=True);(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
 if args.audit:
  args.audit.parent.mkdir(parents=True,exist_ok=True);args.audit.write_text(json.dumps({'exports':audits,'runtimeSeconds':time.monotonic()-start},ensure_ascii=False,indent=2))
 print(f'{len(manifest)} localized variants, {len(audits)} PDFs and matching final-PDF previews')
if __name__=='__main__': main()
