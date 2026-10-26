#!/usr/bin/env python3
"""Audit exported SVG/PDF independently of the builder's sampling/layout code."""
from pathlib import Path
from collections import Counter
from itertools import combinations
import json, math, re, hashlib, xml.etree.ElementTree as ET
import fitz

ROOT=Path(__file__).resolve().parent
OUT=ROOT.parent.parent/'public/printables/mountain-landscape-120/v0.2'
MM=72/25.4
data=json.loads((ROOT/'points-and-labels.json').read_text())
P=[(p['x_mm'],p['y_mm']) for p in data['points']]
checks={};metrics={}

def require(name,condition,detail=None):
    checks[name]={'pass':bool(condition),'detail':detail}

def distance(a,b):return math.hypot(a[0]-b[0],a[1]-b[1])
def ptbox(p,b):return math.hypot(max(b[0]-p[0],0,p[0]-b[2]),max(b[1]-p[1],0,p[1]-b[3]))
def rectgap(a,b):return math.hypot(max(a[0]-b[2],b[0]-a[2],0),max(a[1]-b[3],b[1]-a[3],0))
def orient(a,b,c):return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
def on(a,b,p):return abs(orient(a,b,p))<1e-7 and min(a[0],b[0])-1e-7<=p[0]<=max(a[0],b[0])+1e-7 and min(a[1],b[1])-1e-7<=p[1]<=max(a[1],b[1])+1e-7
def intersection(a,b,c,d):
    o=[orient(a,b,c),orient(a,b,d),orient(c,d,a),orient(c,d,b)]
    return (o[0]*o[1]<0 and o[2]*o[3]<0) or any([on(a,b,c),on(a,b,d),on(c,d,a),on(c,d,b)])
def line_rect(a,b,r,pad=0):
    r=(r[0]-pad,r[1]-pad,r[2]+pad,r[3]+pad)
    if r[0]<=a[0]<=r[2] and r[1]<=a[1]<=r[3]:return True
    corners=[(r[0],r[1]),(r[2],r[1]),(r[2],r[3]),(r[0],r[3])]
    return any(intersection(a,b,corners[i],corners[(i+1)%4]) for i in range(4))

require('JSON exactly 120 sequential unique IDs',[p['number'] for p in data['points']]==list(range(1,121)))
baseline=json.loads((ROOT/'v0.1-points-and-labels.json').read_text())
require('v0.2 preserves every v0.1 point and label', data['points']==baseline['points'])

require('120 unique physical point coordinates',len(P)==120 and len(set(P))==120)
crossings=[]
for i in range(120):
 for j in range(i+1,120):
  if j==i+1 or (i==0 and j==119):continue
  if intersection(P[i],P[(i+1)%120],P[j],P[(j+1)%120]):crossings.append([i+1,j+1])
require('Closed solution has no nonadjacent self-intersections',not crossings,crossings)
metrics['minimum_point_separation_mm']=min(distance(a,b) for a,b in combinations(P,2))
metrics['minimum_step_mm']=min(distance(P[i],P[(i+1)%120]) for i in range(120))
metrics['maximum_step_mm']=max(distance(P[i],P[(i+1)%120]) for i in range(120))
require('Printed dots have separated ink',metrics['minimum_point_separation_mm']>1.2+0.5)

pdf_labels={};ns={'s':'http://www.w3.org/2000/svg'}
for role in ['Puzzle','Solution']:
    svg=ET.parse(OUT/f'Mountain-Landscape-120-{role}.svg').getroot()
    dots=svg.findall('.//s:circle',ns)
    labels=svg.findall('.//s:g[@id="number-labels"]/s:text',ns)
    require(role+' SVG has exactly 120 dots',len(dots)==120)
    require(role+' SVG has labels 1..120 once',Counter(int(t.text) for t in labels)==Counter(range(1,121)))
    require(role+' SVG point positions match JSON',[(float(x.attrib['cx']),float(x.attrib['cy'])) for x in dots]==P)
    path=svg.find('.//s:polyline[@id="solution-path"]',ns)
    if role=='Solution':
        coords=[tuple(map(float,p.split(','))) for p in path.attrib['points'].split()]
        require('SVG solution follows the complete numbered sequence and closing edge',coords==P+P[:1])
    else:require('Puzzle SVG does not contain the answer path',path is None)
    doc=fitz.open(OUT/f'Mountain-Landscape-120-{role}.pdf')
    require(role+' PDF is one readable A4 page',len(doc)==1 and abs(doc[0].rect.width/MM-210)<.01 and abs(doc[0].rect.height/MM-297)<.01)
    page=doc[0]
    text=page.get_text()
    require(role+' PDF has exactly one correct brand footer',text.count('ConnectTheDotsPrintable.online')==1)
    require(role+' PDF removes internal labels',not any(x in text+' '+str(doc.metadata) for x in ['Growth Lab','Offline original sample','Original adult sample']))
    require(role+' SVG has exactly one correct brand footer',sum(1 for el in svg.iter() if el.text=='ConnectTheDotsPrintable.online')==1)
    require(role+' SVG removes internal labels',not any(x in (OUT/f'Mountain-Landscape-120-{role}.svg').read_text() for x in ['Growth Lab','Offline original sample','Original adult sample']))
    spans=[s for b in page.get_text('dict')['blocks'] if 'lines'in b for l in b['lines'] for s in l['spans']]
    numbered=[s for s in spans if s['text'].strip().isdigit() and 50<=s['bbox'][1]/MM<=258 and abs(s['size']-9.2)<.02]
    counts=Counter(int(s['text']) for s in numbered)
    require(role+' PDF actually contains labels 1..120 once',counts==Counter(range(1,121)),{'extracted_labels':sum(counts.values())})
    boxes={int(s['text']):tuple(v/MM for v in s['bbox']) for s in numbered}
    pdf_labels[role]=boxes
    require(role+' number font is at least 9.2pt',all(s['size']>=9.199 for s in numbered))
    page_margins=[min(s['bbox'][0] for s in spans)/MM,min(s['bbox'][1] for s in spans)/MM,210-max(s['bbox'][2] for s in spans)/MM,297-max(s['bbox'][3] for s in spans)/MM]
    metrics[role+'_all_text_margins_mm_left_top_right_bottom']=page_margins
    require(role+' all printed text stays >=12mm from page edge',min(page_margins)>=12)
    used={s['font'] for s in spans}
    embedded={f[3].split('+')[-1] for f in page.get_fonts(full=True) if doc.extract_font(f[0])[3]}
    require(role+' actually used fonts are embedded',used<=embedded,{'used':sorted(used),'embedded':sorted(embedded)})
    draws=page.get_drawings()
    circles=[d for d in draws if d['type']=='f' and abs(d['rect'].width/MM-1.2)<.01 and abs(d['rect'].height/MM-1.2)<.01]
    centers=[((d['rect'].x0+d['rect'].x1)/2/MM,(d['rect'].y0+d['rect'].y1)/2/MM) for d in circles]
    require(role+' PDF contains 120 actual dot markers at JSON coordinates',len(centers)==120 and all(distance(a,b)<.01 for a,b in zip(centers,P)))
    polylines=[d for d in draws if len(d['items'])==120 and all(i[0]=='l' for i in d['items'])]
    if role=='Solution':
        ok=len(polylines)==1
        if ok:
            for i,line in enumerate(polylines[0]['items']):
                a,b=[(q.x/MM,q.y/MM) for q in line[1:]]
                ok &= distance(a,P[i])<.01 and distance(b,P[(i+1)%120])<.01
        require('PDF answer consists of the same 120 ordered edges, including 120 to 1',ok)
    else:require('Puzzle PDF contains no answer polyline',not polylines)
    min_gap=min(rectgap(a,b) for a,b in combinations(boxes.values(),2))
    metrics[role+'_minimum_actual_label_bbox_gap_mm']=min_gap
    require(role+' actual exported label boxes do not overlap',min_gap>=.60)
    safe=all(b[0]>=15 and b[2]<=195 and b[1]>=50 and b[3]<=258 for b in boxes.values())
    require(role+' all number labels retain >=15mm horizontal page margin and clear header/footer',safe)
    bad_dot=[];ambiguous=[];bad_line=[]
    for n,box in boxes.items():
        owner=ptbox(P[n-1],box)
        foreign=min(ptbox(p,box) for i,p in enumerate(P) if i!=n-1)
        if min(ptbox(p,box) for p in P)<.90:bad_dot.append(n)
        if foreign<=owner:ambiguous.append({'label':n,'own_mm':owner,'nearest_other_mm':foreign})
        if any(line_rect(P[i],P[(i+1)%120],box,.30) for i in range(120)):bad_line.append(n)
    require(role+' labels avoid all dot markers',not bad_dot,bad_dot)
    require(role+' each label is closest to its own dot',not ambiguous,ambiguous)
    require(role+' labels avoid the solution strokes',not bad_line,bad_line)
    require(role+' PDF is vector, not a raster-only page',not page.get_images())
    calibration=[]
    for d in draws:
        for item in d['items']:
            if item[0]=='l' and abs(distance(item[1],item[2])/MM-50)<.01:calibration.append(item)
    require(role+' has an actual 50mm calibration segment',len(calibration)==1)

require('Puzzle and Solution labels have identical printed positions',all(max(abs(a-b) for a,b in zip(pdf_labels['Puzzle'][n],pdf_labels['Solution'][n]))<.001 for n in range(1,121)))
result={'overall':'PASS' if all(c['pass'] for c in checks.values()) else 'FAIL','scope':'Digital file / numbering / geometry / layout audit only. No independent human playtest or physical print has occurred.','point_count':120,'sequence':'1 → 120 → 1','metrics':metrics,'checks':checks,'physical_print':'Not Tested','independent_playtest':'Pending Founder / non-author tester','difficulty_rating':'Not measured; adult-targeted sample, not a verified Hard/Extreme classification','artifacts_sha256':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(OUT.glob('*')) if p.is_file()}}
evidence=ROOT.parent.parent/'work/mountain-120'
evidence.mkdir(parents=True,exist_ok=True)
target=evidence/'audit.json'
if target.exists() and json.loads(target.read_text()).get('overall')=='FAIL':
    previous=sorted(evidence.glob('failed-audit-*.json'))
    target.rename(evidence/f'failed-audit-{len(previous)+1:02d}.json')
target.write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'overall':result['overall'],'metrics':metrics,'failed_checks':{k:v for k,v in checks.items() if not v['pass']}},indent=2))
raise SystemExit(0 if result['overall']=='PASS' else 1)
