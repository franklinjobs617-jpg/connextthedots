#!/usr/bin/env python3
"""Independent source + exported PDF primitive audit. Does not import renderer."""
from pathlib import Path
import math,json,hashlib,sys
import fitz
ROOT=Path(__file__).resolve().parents[2];MM=72/25.4
import argparse
parser=argparse.ArgumentParser();parser.add_argument("--ids",nargs="+",required=True);parser.add_argument("--report",type=Path,required=True);args=parser.parse_args()
assert set(args.ids)<={"dragonfly-water-lily","christmas-candle-window"}
checks=[];assets=[]
def check(name,ok,detail=None):checks.append({'check':name,'pass':bool(ok),'detail':detail})
def gap(a,b):return math.hypot(max(a[0]-b[2],b[0]-a[2],0),max(a[1]-b[3],b[1]-a[3],0))
def dotbox(p,b):return math.hypot(max(b[0]-p[0],0,p[0]-b[2]),max(b[1]-p[1],0,p[1]-b[3]))
def cross(a,b,c):return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
def segment_box(a,b,r):
    lo,hi=0.,1.
    for v,d,mn,mx in [(a[0],b[0]-a[0],r[0],r[2]),(a[1],b[1]-a[1],r[1],r[3])]:
        if abs(d)<1e-9:
            if v<mn or v>mx:return False
        else:
            t,u=(mn-v)/d,(mx-v)/d;lo=max(lo,min(t,u));hi=min(hi,max(t,u))
            if lo>hi:return False
    return True
for id in args.ids:
    folder=ROOT/'public/printables'/id/'v1'
    if not (folder/'geometry.json').exists():continue
    d=json.loads((folder/'geometry.json').read_text());id=d['id'];p=d['points'];n=d['count'];labels=d['labels'];edges=[];ranges=[]
    for s in d['segments']:
        pts=p[s['start']-1:s['end']];ranges+=list(range(s['start'],s['end']+1))
        check(id+' segment points '+s['name'],pts==s['points'])
        edges+=list(zip(pts,pts[1:]+pts[:1])) if s['closed'] else list(zip(pts,pts[1:]))
    check(id+' complete unique numbering',ranges==list(range(1,n+1)) and [l['number'] for l in labels]==ranges and len(set(map(tuple,p)))==n)
    check(id+' answer reconstructed from printed ranges',json.loads(json.dumps(edges))==d['edges'])
    minimum=min(math.dist(a,b) for i,a in enumerate(p) for b in p[i+1:]);check(id+' centers >=3.3mm',minimum>=3.3,minimum)
    boxes=[l['box'] for l in labels];lg=min(gap(a,b) for i,a in enumerate(boxes) for b in boxes[i+1:]);dg=min(dotbox(q,b)-.48 for b in boxes for q in p)
    check(id+' label gap >=0.65mm',lg>=.6499,lg);check(id+' label dot gap >=0.65mm',dg>=.6499,dg)
    margins=[]
    for l in labels:
        b=l['box'];c=[(b[0]+b[2])/2,(b[1]+b[3])/2];own=math.dist(c,l['point']);other=min(math.dist(c,q) for j,q in enumerate(p) if j!=l['number']-1);margins.append(other-own)
    check(id+' label nearest own point',min(margins)>.19,min(margins))
    conflicts=[i+1 for i,b in enumerate(boxes) if any(segment_box(a,z,[b[0]-.29,b[1]-.29,b[2]+.29,b[3]+.29]) for a,z in edges)]
    check(id+' labels clear answer strokes',not conflicts,conflicts)
    crossings=[]
    for i,(a,b) in enumerate(edges):
        for j,(c,e) in enumerate(edges[i+1:],i+1):
            if cross(a,b,c)*cross(a,b,e)<-1e-8 and cross(c,e,a)*cross(c,e,b)<-1e-8:crossings.append([i,j])
    check(id+' no unintended strict crossings',not crossings,crossings)
    exports=[]
    for paper,(w,h) in [('A4',(210,297)),('Letter',(215.9,279.4))]:
        ox,oy=(w-210)/2,(h-279.4)/2
        def mapped(q):return [(q[0]+ox)*MM,(q[1]+oy)*MM]
        extracted=[]
        for kind in ['Puzzle','Solution']:
            file=folder/f'{id}-{paper}-{kind}.pdf';pdf=fitz.open(file);page=pdf[0];prefix=f'{id} {paper} {kind}'
            check(prefix+' native size',len(pdf)==1 and abs(page.rect.width-w*MM)<.01 and abs(page.rect.height-h*MM)<.01)
            traces=[s for s in page.get_texttrace() if s['bbox'][1]>(55+oy)*MM and s['bbox'][3]<(243+oy)*MM]
            nums=[(''.join(chr(c[0]) for c in s['chars']),s) for s in traces]
            check(prefix+' actual numbering',len(nums)==n and [v for v,s in nums]==list(map(str,range(1,n+1))))
            check(prefix+' 9pt labels',all(abs(s['size']-9)<.001 for _,s in nums))
            actualboxes=[s['bbox'] for _,s in nums];actualgap=min(gap(a,b) for i,a in enumerate(actualboxes) for b in actualboxes[i+1:])/MM
            check(prefix+' actual PDF label boxes no collision',actualgap>0,actualgap)
            check(prefix+' exact label origins',all(math.dist(s['chars'][0][2],[(l['box'][0]+ox)*MM,(l['box'][1]+.718*9/MM+oy)*MM])<.005 for (_,s),l in zip(nums,labels)))
            draws=page.get_drawings();dots=[v for v in draws if v['type']=='f' and len(v['items'])==4 and v['rect'].width<3]
            centers=[[(v['rect'].x0+v['rect'].x1)/2,(v['rect'].y0+v['rect'].y1)/2] for v in dots]
            check(prefix+' exact dots',len(centers)==n and all(math.dist(a,mapped(b))<.005 for a,b in zip(centers,p)))
            lines=[(list(it[1]),list(it[2])) for v in draws for it in v['items'] if it[0]=='l' and it[1].y<(243+oy)*MM and it[2].y<(243+oy)*MM]
            check(prefix+' exact ordered answer edges',len(lines)==(len(edges) if kind=='Solution' else 0) and (kind=='Puzzle' or all(math.dist(a,mapped(c))<.005 and math.dist(b,mapped(e))<.005 for (a,b),(c,e) in zip(lines,edges))))
            check(prefix+' all ink inside 8mm margins',all(v['rect'].x0>8*MM and v['rect'].y0>8*MM and v['rect'].x1<(w-8)*MM and v['rect'].y1<(h-8)*MM for v in draws) and all(v[0]>8*MM and v[1]>8*MM and v[2]<(w-8)*MM and v[3]<(h-8)*MM for v in page.get_text('words')))
            png=file.with_suffix('.png');actual=page.get_pixmap(matrix=fitz.Matrix(1.5,1.5),alpha=False);saved=fitz.Pixmap(str(png));check(prefix+' exact exported preview',actual.samples==saved.samples)
            extracted.append({'centers':centers,'labels':[(v,s['bbox']) for v,s in nums]})
            exports.append({'file':str(file.relative_to(ROOT)),'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'bytes':file.stat().st_size,'paper_mm':[w,h]})
        check(id+' '+paper+' puzzle answer identical dots labels',extracted[0]==extracted[1])
    assets.append({'id':id,'count':n,'segments':len(d['segments']),'answer_edges':len(edges),'outer_contour_dots':len(d['segments'][0]['points']),'interior_dots':n-len(d['segments'][0]['points']),'min_center_mm':minimum,'min_label_gap_mm':lg,'min_label_dot_gap_mm':dg,'min_label_association_margin_mm':min(margins),'exports':exports})
result={'scope':'Independent code audit of source and actual PDF primitives; same agent, not independent human solve','checks':checks,'assets':assets,'passed':sum(c['pass'] for c in checks),'failed':sum(not c['pass'] for c in checks),'physical_print':'NOT TESTED','independent_human_solve':'NOT TESTED','human_person_minutes':'UNKNOWN'}
args.report.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({k:result[k] for k in ['passed','failed','assets']},indent=2));print(json.dumps([c for c in checks if not c['pass']],indent=2));sys.exit(bool(result['failed']))
