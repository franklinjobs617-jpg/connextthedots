#!/usr/bin/env python3
"""Audit final PDF primitives and pixels, independently of generation."""
from pathlib import Path
import json,math,hashlib,fitz
ROOT=Path(__file__).resolve().parents[2];MM=72/25.4
checks=[]
def check(ok,what):
 checks.append({'check':what,'pass':bool(ok)})
 if not ok:print('FAIL',what)
def intersects(a,b,g=0):return a[0]<b[2]+g and b[0]<a[2]+g and a[1]<b[3]+g and b[1]<a[3]+g
def hit(a,b,r):
 lo,hi=0.,1.
 for p,d,mn,mx in [(a[0],b[0]-a[0],r[0],r[2]),(a[1],b[1]-a[1],r[1],r[3])]:
  if abs(d)<1e-9:
   if not mn<=p<=mx:return False
  else:
   t,u=(mn-p)/d,(mx-p)/d;lo=max(lo,min(t,u));hi=min(hi,max(t,u))
   if lo>hi:return False
 return True
for gp in sorted((ROOT/'public/skip-counting').glob('*/v1/geometry.json')):
 d=json.loads(gp.read_text());n=d['dotCount'];labels=d['orderedLabels'];name=d['id']
 check(len(d['points'])==len(labels)==len(d['labels'])==n,name+' counts')
 check(labels==list(range(d['step'],d['step']*(n+1),d['step'])) and d['startValue']==d['step'] and d['endValue']==d['startValue']+d['step']*(n-1),name+' sequence')
 check(d['closed'] is True and len(set(map(tuple,d['points'])))==n,name+' unique points and closure')
 for path in sorted(gp.parent.glob('*.pdf')):
  paper='Letter' if '-Letter-' in path.name else 'A4';answer='-Answer.' in path.name;w,h=(210,297) if paper=='A4' else (215.9,279.4);ox,oy=(w-210)/2,(h-279.4)/2
  pdf=fitz.open(path);p=pdf[0];prefix=path.stem
  check(len(pdf)==1 and abs(p.rect.width-w*MM)<.01 and abs(p.rect.height-h*MM)<.01,prefix+' size')
  spans=[s for b in p.get_text('dict')['blocks'] if 'lines' in b for l in b['lines'] for s in l['spans']]
  labs=[s for s in spans if 49*MM<s['bbox'][1]<245*MM and s['text'].isdigit()]
  check([int(s['text']) for s in labs]==labels,prefix+' actual labels in order')
  check(all(abs(s['size']-12)<.01 for s in labs),prefix+' 12pt label font')
  boxes=[s['bbox'] for s in labs];points=[((x+ox)*MM,(y+oy)*MM) for x,y in d['points']]
  check(not any(intersects(a,b,.3) for i,a in enumerate(boxes) for b in boxes[i+1:]),prefix+' actual label overlap')
  check(not any(math.hypot(max(b[0]-x,0,x-b[2]),max(b[1]-y,0,y-b[3]))<.65*MM+.3 for b in boxes for x,y in points),prefix+' label-dot clearance')
  segments=list(zip(points,points[1:]+points[:1]))
  check(not any(hit(a,z,[b[0]-.2,b[1]-.2,b[2]+.2,b[3]+.2]) for b in boxes for a,z in segments),prefix+' label-answer clearance')
  drawings=p.get_drawings();dots=[v for v in drawings if len(v['items'])==4 and all(i[0]=='c' for i in v['items'])]
  check(len(dots)==n and all(math.dist(((v['rect'].x0+v['rect'].x1)/2,(v['rect'].y0+v['rect'].y1)/2),q)<.02 for v,q in zip(dots,points)),prefix+' actual dot centers')
  lines=[(tuple(i[1]),tuple(i[2])) for v in drawings for i in v['items'] if i[0]=='l' and 49*MM<i[1].y<245*MM]
  check(len(lines)==(n if answer else 0) and (not answer or all(math.dist(a,c)<.02 and math.dist(b,e)<.02 for (a,b),(c,e) in zip(lines,segments))),prefix+' exact solution path')
  check(all(8*MM<s['bbox'][0]<s['bbox'][2]<(w-8)*MM and 8*MM<s['bbox'][1]<s['bbox'][3]<(h-8)*MM for s in spans),prefix+' text margins')
  pix=p.get_pixmap(matrix=fitz.Matrix(1.5,1.5),alpha=False);saved=fitz.Pixmap(path.with_suffix('.png'))
  check(pix.samples==saved.samples and pix.width==saved.width and pix.height==saved.height,prefix+' final PDF preview equality')
print(json.dumps({'checks':len(checks),'passed':sum(c['pass'] for c in checks),'failed':sum(not c['pass'] for c in checks)}))
Path('/workspace/work/c13/pdf-audit.json').write_text(json.dumps(checks,indent=2))
raise SystemExit(any(not c['pass'] for c in checks))
