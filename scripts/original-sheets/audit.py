#!/usr/bin/env python3
"""Independent export audit: reads generated source and actual PDF primitives.
Writes private evidence under work/, never under public/. No physical QA claim.
"""
from pathlib import Path
import math,json,hashlib,sys
import fitz
ROOT=Path(__file__).resolve().parents[2];MM=72/25.4
IDS=['elephant-100','hot-air-balloon-100','seahorse-100','hummingbird-120','shark-140']
checks=[];results=[]
def check(name,ok,detail=None):
    checks.append({'check':name,'pass':bool(ok),'detail':detail})
def cross(a,b,c):return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
def gap(a,b):return math.hypot(max(a[0]-b[2],b[0]-a[2],0),max(a[1]-b[3],b[1]-a[3],0))
def dotbox(p,b):return math.hypot(max(b[0]-p[0],0,p[0]-b[2]),max(b[1]-p[1],0,p[1]-b[3]))
def segment_box(a,b,r):
    lo,hi=0.,1.
    for v,d,mn,mx in [(a[0],b[0]-a[0],r[0],r[2]),(a[1],b[1]-a[1],r[1],r[3])]:
        if abs(d)<1e-9:
            if v<mn or v>mx:return False
        else:
            t,u=(mn-v)/d,(mx-v)/d;lo=max(lo,min(t,u));hi=min(hi,max(t,u))
            if lo>hi:return False
    return True
for id in IDS:
    folder=ROOT/'public/printables'/id/'v1';d=json.loads((folder/'geometry.json').read_text());p=d['points'];labels=d['labels'];n=d['count']
    check(id+': source numbering',len(p)==n and [l['number'] for l in labels]==list(range(1,n+1)) and len({tuple(v) for v in p})==n)
    minimum=min(math.dist(a,b) for i,a in enumerate(p) for b in p[i+1:]);check(id+': dot spacing >=3.3mm',minimum>=3.3,minimum)
    intersections=[]
    for i in range(n):
        for j in range(i+2,n):
            if i==0 and j==n-1:continue
            a,b,c,e=p[i],p[(i+1)%n],p[j],p[(j+1)%n]
            if cross(a,b,c)*cross(a,b,e)<-1e-8 and cross(c,e,a)*cross(c,e,b)<-1e-8:intersections.append([i+1,j+1])
    check(id+': no outline crossings',not intersections,intersections)
    boxes=[l['box'] for l in labels]
    mingap=min(gap(a,b) for i,a in enumerate(boxes) for b in boxes[i+1:]);check(id+': label clearance >=0.65mm',mingap>=.6499,mingap)
    dotgap=min(dotbox(q,b)-d['dotRadiusMm'] for b in boxes for q in p);check(id+': label-dot clearance >=0.65mm',dotgap>=.6499,dotgap)
    nearest=[]
    for l in labels:
        b=l['box'];c=[(b[0]+b[2])/2,(b[1]+b[3])/2]
        if min(range(n),key=lambda i:math.dist(c,p[i]))!=l['number']-1:nearest.append(l['number'])
    check(id+': each label nearest own dot',not nearest,nearest)
    edges=list(zip(p,p[1:]+p[:1]));details=[s for path in d['details'] for s in zip(path,path[1:])]
    collisions=[i+1 for i,b in enumerate(boxes) if any(segment_box(a,z,[b[0]-.29,b[1]-.29,b[2]+.29,b[3]+.29]) for a,z in edges+details)]
    check(id+': labels clear solution strokes',not collisions,collisions)
    exports=[]
    for paper,(w,h) in [('A4',(210,297)),('Letter',(215.9,279.4))]:
        ox,oy=(w-210)/2,(h-279.4)/2
        def mapped(q):return [(q[0]+ox)*MM,(q[1]+oy)*MM]
        for kind in ['Puzzle','Solution']:
            file=folder/f'{id}-{paper}-{kind}.pdf';pdf=fitz.open(file);page=pdf[0];prefix=f'{id} {paper} {kind}'
            check(prefix+': single native size page',len(pdf)==1 and abs(page.rect.width-w*MM)<.01 and abs(page.rect.height-h*MM)<.01)
            words=[v for v in page.get_text('words') if (49+oy)*MM<v[1]<(240+oy)*MM]
            check(prefix+': actual PDF labels exactly 1..N',sorted(int(v[4]) for v in words if v[4].isdigit())==list(range(1,n+1)) and len(words)==n)
            draws=page.get_drawings();dots=[v for v in draws if v['type']=='f' and len(v['items'])==4 and v['rect'].width<3]
            centers=[[(v['rect'].x0+v['rect'].x1)/2,(v['rect'].y0+v['rect'].y1)/2] for v in dots]
            check(prefix+': actual PDF point geometry',len(centers)==n and all(math.dist(a,mapped(b))<.005 for a,b in zip(centers,p)))
            numeric_spans=[s for block in page.get_text('dict')['blocks'] if 'lines' in block for line in block['lines'] for s in line['spans'] if (49+oy)*MM<s['bbox'][1]<(240+oy)*MM]
            check(prefix+': actual PDF 9pt font',all(abs(s['size']-9)<.001 for s in numeric_spans))
            lines=[(list(it[1]),list(it[2])) for v in draws for it in v['items'] if it[0]=='l']
            for a,b in edges:
                found=any(math.dist(a1,mapped(a))<.005 and math.dist(b1,mapped(b))<.005 for a1,b1 in lines)
                if found!=(kind=='Solution'):break
            else:found=None
            check(prefix+': exact answer edges / no puzzle answer',found is None)
            check(prefix+': all ink inside 8mm margins',all(v['rect'].x0>8*MM and v['rect'].y0>8*MM and v['rect'].x1<(w-8)*MM and v['rect'].y1<(h-8)*MM for v in draws) and all(v[0]>8*MM and v[1]>8*MM and v[2]<(w-8)*MM and v[3]<(h-8)*MM for v in page.get_text('words')))
            png=folder/f'{id}-{paper}-{kind}.png';actual=page.get_pixmap(matrix=fitz.Matrix(1.5,1.5),alpha=False);saved=fitz.Pixmap(str(png));check(prefix+': truthful PNG raster',actual.samples==saved.samples)
            exports.append({'file':str(file.relative_to(ROOT)),'pdf_sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'png_sha256':hashlib.sha256(png.read_bytes()).hexdigest(),'bytes':file.stat().st_size,'paper_mm':[w,h]})
    results.append({'id':id,'dots':n,'minimum_dot_centers_mm':minimum,'minimum_label_gap_mm':mingap,'minimum_label_dot_ink_gap_mm':dotgap,'exports':exports,'physical_print':'NOT TESTED','independent_human_full_solve':'NOT TESTED'})
report={'scope':'digital source + actual PDF + raster QA; not human playtest','checks':checks,'assets':results,'passed':sum(c['pass'] for c in checks),'failed':sum(not c['pass'] for c in checks)}
out=ROOT/'work/c08';out.mkdir(parents=True,exist_ok=True);(out/'digital-qa.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'passed':report['passed'],'failed':report['failed'],'failures':[c for c in checks if not c['pass']]},indent=2));sys.exit(bool(report['failed']))
