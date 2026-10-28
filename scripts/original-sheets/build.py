#!/usr/bin/env python3
"""Deterministic original worksheet pipeline; never reads legacy art/generators.
All authored geometry uses mm, y downward, in a common 210 x 279.4 mm frame.
A4 adds 8.8 mm vertical centering; Letter adds 2.95 mm horizontal centering.
Requires reportlab and PyMuPDF. Uses PDF's standard Helvetica, no font binaries.
"""
from pathlib import Path
import math,json,hashlib,html
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import stringWidth
import fitz
ROOT=Path(__file__).resolve().parents[2]
MM=72/25.4
FONT=9
R=.48
GAP=.65

def dist(a,b): return math.dist(a,b)
def sample(a,n):
    lengths=[dist(p,a[(i+1)%len(a)]) for i,p in enumerate(a)]
    counts=[1]*len(a)
    def expand():
        return [[round(p[0]+(a[(i+1)%len(a)][0]-p[0])*k/counts[i],5),round(p[1]+(a[(i+1)%len(a)][1]-p[1])*k/counts[i],5)] for i,p in enumerate(a) for k in range(counts[i])]
    for _ in range(n-len(a)):
        for j in sorted(range(len(a)),key=lambda j:lengths[j]/counts[j],reverse=True):
            counts[j]+=1
            trial=expand()
            if min(dist(p,q) for i,p in enumerate(trial) for q in trial[i+1:])>=3.3:break
            counts[j]-=1
        else:raise ValueError('Requested count cannot maintain 3.3 mm center spacing')
    return expand()

def overlap(a,b,g=GAP):
    return a[0]<b[2]+g and b[0]<a[2]+g and a[1]<b[3]+g and b[1]<a[3]+g

def point_box(p,b):return math.hypot(max(b[0]-p[0],0,p[0]-b[2]),max(b[1]-p[1],0,p[1]-b[3]))
def line_box(a,b,r):
    # Liang-Barsky inclusive segment / rectangle intersection.
    lo,hi=0.,1.
    for origin,delta,mn,mx in [(a[0],b[0]-a[0],r[0],r[2]),(a[1],b[1]-a[1],r[1],r[3])]:
        if abs(delta)<1e-10:
            if origin<mn or origin>mx:return False
        else:
            t,u=(mn-origin)/delta,(mx-origin)/delta
            lo=max(lo,min(t,u));hi=min(hi,max(t,u))
            if lo>hi:return False
    return True

def layout(points,details):
    lines=list(zip(points,points[1:]+points[:1]))+[s for line in details for s in zip(line,line[1:])]
    candidates=[]
    for i,p in enumerate(points):
        w=stringWidth(str(i+1),'Helvetica',FONT)/MM;h=FONT/MM
        prev,nxt=points[i-1],points[(i+1)%len(points)]
        normal=math.atan2(nxt[1]-prev[1],nxt[0]-prev[0])+math.pi/2
        options=[]
        for radius in [2.8,3.0,3.2,3.8,4.5,5.2,6.,6.8,7.6]:
            for k in range(24):
                angle=normal+k*math.pi/12
                cx,cy=p[0]+radius*math.cos(angle),p[1]+radius*math.sin(angle)
                b=[cx-w/2,cy-h/2,cx+w/2,cy+h/2]
                if any(j!=i and dist([cx,cy],q)<radius+.2 for j,q in enumerate(points)):continue
                if b[0]<9 or b[2]>201 or b[1]<49 or b[3]>240:continue
                if any(point_box(q,b)<R+GAP for q in points):continue
                expanded=[b[0]-.3,b[1]-.3,b[2]+.3,b[3]+.3]
                if any(line_box(a,z,expanded) for a,z in lines):continue
                options.append((radius+min(k,24-k)*.035,b))
        candidates.append(sorted(options))
    # Greedy constraint layout with backtracking; constrained numbers first.
    order=sorted(range(len(points)),key=lambda i:len(candidates[i]));placed={};visits=0
    def solve(k):
        nonlocal visits
        visits+=1
        if visits>150000:return False
        if k==len(order):return True
        i=order[k]
        for _,b in candidates[i]:
            if any(overlap(b,r) for r in placed.values()):continue
            placed[i]=b
            if solve(k+1):return True
            del placed[i]
        return False
    if not solve(0):raise ValueError(f'No safe label layout: {len(points)} dots, options {min(map(len,candidates))}, zero {[i+1 for i,c in enumerate(candidates) if not c]}; visits {visits}')
    return [{'number':i+1,'point':p,'box':[round(v,5) for v in placed[i]]} for i,p in enumerate(points)]

def render(d,paper,solution,out):
    width,height=(210,297) if paper=='A4' else (215.9,279.4)
    ox,oy=(width-210)/2,(height-279.4)/2
    c=canvas.Canvas(str(out),pagesize=(width*MM,height*MM),invariant=1,pageCompression=1)
    c.setTitle(f'{d["title"]} {d["count"]} — {paper} {"Solution" if solution else "Puzzle"}')
    c.setAuthor('ConnectTheDotsPrintable');c.setSubject('Original numbered worksheet; CC BY 4.0')
    def text(x,y,t,size=FONT):
        c.setFont('Helvetica',size);c.drawString((x+ox)*MM,(height-y-oy)*MM,t)
    def line(a,b):c.line((a[0]+ox)*MM,(height-a[1]-oy)*MM,(b[0]+ox)*MM,(height-b[1]-oy)*MM)
    text(16,20,f'{d["title"]} | {d["count"]} dots',18)
    text(16,29,f'{paper} {"SOLUTION" if solution else "PUZZLE"} | Free printable | Numbers 1-{d["count"]}',10)
    text(16,37,f'Connect 1 to {d["count"]} in order, then {d["count"]} back to 1. Solid details are already drawn.',9)
    text(16,43,'Print at Actual size / 100%. Compare with the separate matching solution.',9)
    c.setLineWidth(.30*MM)
    if solution:
        pts=d['points']
        for a,b in zip(pts,pts[1:]+pts[:1]):line(a,b)
    for path in d['details']:
        for a,b in zip(path,path[1:]):line(a,b)
    for p in d['eyes']:c.circle((p[0]+ox)*MM,(height-p[1]-oy)*MM,.75*MM,fill=1,stroke=0)
    for label in d['labels']:
        p=label['point'];c.circle((p[0]+ox)*MM,(height-p[1]-oy)*MM,R*MM,fill=1,stroke=0)
        b=label['box'];text(b[0],b[1]+.718*FONT/MM,str(label['number']))
    line([16,250],[66,250]);line([16,248],[16,252]);line([66,248],[66,252])
    text(16,257,'50 mm check line | Physical printing & independent human solve: NOT TESTED',8)
    text(16,264,'Original: ConnectTheDotsPrintable | CC BY 4.0 | connectthedotsprintable.online',8)
    c.showPage();c.save()
    with fitz.open(out) as pdf:
        pix=pdf[0].get_pixmap(matrix=fitz.Matrix(1.5,1.5),alpha=False);pix.save(out.with_suffix('.png'))

def main():
    designs=json.loads((Path(__file__).with_name('designs.json')).read_text())
    for d in designs:
        d['points']=sample(d['anchors'],d['count']);d['labels']=layout(d['points'],d['details'])
        d.update(schemaVersion=1,units='mm',frame=[210,279.4],labelFont='Helvetica',labelFontPt=FONT,dotRadiusMm=R,connection='1..N then N to 1',license='CC BY 4.0',copyright='2026 ConnectTheDotsPrintable')
        out=ROOT/'public/printables'/d['id']/'v1';out.mkdir(parents=True,exist_ok=True)
        (out/'geometry.json').write_text(json.dumps(d,indent=2)+'\n')
        (out/'SOURCE.md').write_text(f'# {d["title"]} — original source\n\nCopyright 2026 ConnectTheDotsPrintable. Artwork and geometry: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Original coordinates authored for C08; no tracing, competitor artwork, CDN asset, or image-generation model used.\n\n`geometry.json` contains the exact {d["count"]} points, label boxes, fixed details and closed sequence. All four PDFs and PNGs derive from it via `scripts/original-sheets/build.py`; source anchors are in `designs.json`. Uses PDF standard Helvetica without distributing font binaries. PNGs are rasterizations of the actual PDFs.\n\n9 pt labels; common physical geometry on A4 and US Letter. Print at 100% and measure the 50 mm line. Physical print and independent human full-solve: **NOT TESTED**. Difficulty, age suitability, completion time and large-print suitability are not established. Actual effort is recorded in the private C08 ledger, not inferred from PDF timestamps.\n')
        for paper in ['A4','Letter']:
            for solution in [False,True]:render(d,paper,solution,out/f'{d["id"]}-{paper}-{"Solution" if solution else "Puzzle"}.pdf')
        print(d['id'],'dots',len(d['points']),'minimum centers',round(min(dist(p,q) for i,p in enumerate(d['points']) for q in d['points'][i+1:]),3))
if __name__=='__main__':main()
