#!/usr/bin/env python3
"""C13 task-local deterministic sequence PDF pipeline. Python + reportlab + PyMuPDF."""
from pathlib import Path
import math,json,hashlib
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import stringWidth
import fitz
ROOT=Path(__file__).resolve().parents[2]
MM=72/25.4
FONT=12
R=.65
GAP=.9
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

def layout(points,details,values):
    lines=list(zip(points,points[1:]+points[:1]))+[s for line in details for s in zip(line,line[1:])]
    candidates=[]
    for i,p in enumerate(points):
        w=stringWidth(str(values[i]),'Helvetica',FONT)/MM;h=1.374*FONT/MM
        prev,nxt=points[i-1],points[(i+1)%len(points)]
        normal=math.atan2(nxt[1]-prev[1],nxt[0]-prev[0])+math.pi/2
        options=[]
        for radius in [2.8,3.0,3.2,3.8,4.5,5.2,6.,6.8,7.6,8.5,9.5,11.]:
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
    return [{'number':values[i],'point':p,'box':[round(v,5) for v in placed[i]]} for i,p in enumerate(points)]


def render(d,paper,answer,path):
    w,h=(210,297) if paper=='A4' else (215.9,279.4)
    ox,oy=(w-210)/2,(h-279.4)/2
    c=canvas.Canvas(str(path),pagesize=(w*MM,h*MM),invariant=1)
    c.setTitle(f'{d["title"]} | Count by {d["step"]} | {paper} {"Answer" if answer else "Puzzle"}')
    c.setAuthor('ConnectTheDotsPrintable.online')
    def text(x,y,t,size=12):
        c.setFont('Helvetica',size);c.drawString((x+ox)*MM,(h-y-oy)*MM,t)
    def line(a,b): c.line((a[0]+ox)*MM,(h-a[1]-oy)*MM,(b[0]+ox)*MM,(h-b[1]-oy)*MM)
    text(16,18,f'{d["title"]} | Count by {d["step"]}',18)
    text(16,27,f'{paper} {"ANSWER" if answer else "PUZZLE"} | {d["dotCount"]} dots | {d["startValue"]} to {d["endValue"]}',11)
    text(16,36,f'Add {d["step"]} each time. Start at {d["startValue"]}; connect in counting order to {d["endValue"]}.',10)
    text(16,43,f'Then connect {d["endValue"]} back to {d["startValue"]} to close the picture.',10)
    c.setLineWidth(.35*MM)
    if answer:
        for a,b in zip(d['points'],d['points'][1:]+d['points'][:1]):line(a,b)
    for lab in d['labels']:
        x,y=lab['point'];c.circle((x+ox)*MM,(h-y-oy)*MM,R*MM,fill=1,stroke=0)
        b=lab['box'];text(b[0],b[1]+1.075*FONT/MM,str(lab['number']))
    line([16,250],[66,250]);line([16,248],[16,252]);line([66,248],[66,252])
    text(16,257,'50 mm check line | Print at Actual size / 100% on matching paper.',9)
    text(16,264,'© 2026 ConnectTheDotsPrintable.online. Personal and educational use.',8)
    text(16,269,'Commercial use requires written permission. See website Terms of Service.',8)
    c.showPage();c.save()
    with fitz.open(path) as pdf:pdf[0].get_pixmap(matrix=fitz.Matrix(1.5,1.5),alpha=False).save(path.with_suffix('.png'))

def main():
    designs=json.loads(Path(__file__).with_name('designs.json').read_text())
    manifest=[]
    for d in designs:
        d['startValue']=d['step'];d['endValue']=d['step']*d['dotCount']
        d['orderedLabels']=[d['step']*(i+1) for i in range(d['dotCount'])]
        d['points']=sample(d['anchors'],d['dotCount']);d['labels']=layout(d['points'],[],d['orderedLabels'])
        d.update(closed=True,connection='orderedLabels in order, then last to first',units='mm',frame=[210,279.4],labelFont='Helvetica',labelFontPt=FONT,dotRadiusMm=R,provenance='Original C13 coordinate design; no external art, tracing, stock or competitor assets.',license='Personal and educational downloading and printing; commercial use requires prior written permission. See website Terms of Service.')
        out=ROOT/'public/skip-counting'/d['id']/'v1';out.mkdir(parents=True,exist_ok=True)
        (out/'geometry.json').write_text(json.dumps(d,indent=2)+'\n')
        for paper in ['A4','Letter']:
            for answer in [False,True]:
                p=out/f'{d["id"]}-{paper}-{"Answer" if answer else "Puzzle"}.pdf';render(d,paper,answer,p)
                manifest.append(dict(path=str(p.relative_to(ROOT/'public')),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),paper=paper,kind='Answer' if answer else 'Puzzle',id=d['id']))
        print(d['id'],d['dotCount'],d['startValue'],d['endValue'])
    (ROOT/'public/skip-counting/manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
if __name__=='__main__':main()
