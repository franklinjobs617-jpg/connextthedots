#!/usr/bin/env python3
"""Task-local segmented adapter of frozen C08/C09 build.py. No product writes."""
from pathlib import Path
import importlib.util, math, json, hashlib
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('upstream',Path(__file__).with_name('upstream-build.py'))
u=importlib.util.module_from_spec(spec);spec.loader.exec_module(u)
# Reuse the exact existing label constraint solver; replace only edge enumeration
# so pen lifts do not become phantom connecting edges in layout constraints.
code=Path(__file__).with_name('upstream-build.py').read_text()
start=code.index('def layout(');end=code.index('\ndef render(',start)
adapter=code[start:end].replace("lines=list(zip(points,points[1:]+points[:1]))+[s for line in details for s in zip(line,line[1:])]", "lines=details")
exec(adapter,u.__dict__)

def ellipse(cx,cy,rx,ry,n):
    return [[round(cx+rx*math.cos(2*math.pi*i/n),4),round(cy+ry*math.sin(2*math.pi*i/n),4)] for i in range(n)]
def path(name,points,closed=True,step=9):
    # Preserve authored corners; add only points needed to search along meaningful edges.
    out=[];pairs=list(zip(points,points[1:]+points[:1])) if closed else list(zip(points,points[1:]))
    for a,b in pairs:
        n=max(1,math.ceil(math.dist(a,b)/step))
        out.extend([[round(a[0]+(b[0]-a[0])*k/n,5),round(a[1]+(b[1]-a[1])*k/n,5)] for k in range(n)])
    if not closed:out.append(points[-1])
    return {'name':name,'points':out,'closed':closed,'anchors':points,'maxStepMm':step}

def designs():
    owl=[
      path('body and ear tufts',[[39,95],[34,65],[58,75],[75,66],[105,70],[135,66],[152,75],[176,65],[171,95],[183,122],[179,157],[162,185],[139,203],[123,211],[128,228],[114,222],[105,232],[96,222],[82,228],[87,211],[71,203],[48,185],[31,157],[27,122]]),
      path('left facial disc',ellipse(75,106,24,25,16),step=9),
      path('right facial disc',ellipse(135,106,24,25,16),step=9),
      path('left eye',ellipse(75,106,9,10,8),step=9),
      path('right eye',ellipse(135,106,9,10,8),step=9),
      path('beak',[[101,133],[109,133],[105,146]],step=9),
      path('left flight feathers',[[40,136],[49,145],[42,154],[55,165],[48,175],[65,190]],False,9),
      path('right flight feathers',[[170,136],[161,145],[168,154],[155,165],[162,175],[145,190]],False,9),
      path('breast chevrons',[[79,151],[88,160],[97,151],[105,162],[113,151],[122,160],[131,151]],False,9),
      path('lower plumage',[[80,179],[92,190],[105,179],[118,190],[130,179]],False,9)
    ]
    observatory=[
      path('dome and building',[[28,217],[28,153],[42,153],[42,127],[48,112],[61,96],[78,83],[96,77],[96,65],[114,65],[114,77],[132,83],[149,96],[162,112],[168,127],[168,153],[182,153],[182,217]],False,step=9),
      path('dome shutter',[[91,86],[79,103],[75,124],[75,143],[135,143],[135,124],[131,103],[119,86]],step=9),
      path('left dome ribs',[[78,92],[67,109],[61,129],[61,143]],False,9),
      path('right dome ribs',[[132,92],[143,109],[149,129],[149,143]],False,9),
      path('left window',[[43,169],[63,169],[63,195],[43,195]],step=9),
      path('right window',[[147,169],[167,169],[167,195],[147,195]],step=9),
      path('arched door',[[85,217],[85,179],[90,169],[99,164],[111,164],[120,169],[125,179],[125,217]],False,9),
      path('telescope tube',[[94,124],[116,99],[124,106],[102,132]],step=9),
      path('foundation steps',[[21,226],[189,226],[194,234],[16,234]],step=9)
    ]
    return [('tufted-owl-study','Tufted owl study',owl),('hilltop-observatory','Hilltop observatory',observatory)]

def render(d,paper,solution,out):
    # Preserve upstream physical frame, PDF font/dots, 50mm ruler and usage policy.
    w,h=(210,297) if paper=='A4' else (215.9,279.4);ox,oy=(w-210)/2,(h-279.4)/2
    c=u.canvas.Canvas(str(out),pagesize=(w*u.MM,h*u.MM),invariant=1,pageCompression=1)
    c.setTitle(f'{d["title"]} | {paper} {"Solution" if solution else "Puzzle"}');c.setAuthor('ConnectTheDotsPrintable.online');c.setSubject(u.RELEASE_USAGE)
    def text(x,y,t,size=9):c.setFont('Helvetica',size);c.drawString((x+ox)*u.MM,(h-y-oy)*u.MM,t)
    def line(a,b):c.line((a[0]+ox)*u.MM,(h-a[1]-oy)*u.MM,(b[0]+ox)*u.MM,(h-b[1]-oy)*u.MM)
    text(12,16,d['title']+' | '+str(d['count'])+' dots',17)
    text(12,24,f'{paper} {"SOLUTION" if solution else "PUZZLE"} | PRIVATE PROTOTYPE | 9 pt numbers',9)
    text(12,31,'Within each range connect consecutive numbers. Lift your pen between ranges.',9)
    text(12,37,'C = close last to first in that range. O = stop at last dot. Never bridge ranges.',9)
    ranges=[f'{s["start"]}-{s["end"]} {"C" if s["closed"] else "O"}' for s in d['segments']]
    text(12,44,'Ranges: '+', '.join(ranges[:5]),8)
    text(12,50,', '.join(ranges[5:]),8)
    c.setLineWidth(.3*u.MM)
    if solution:
        for a,b in d['edges']:line(a,b)
    for label in d['labels']:
        x,y=label['point'];c.circle((x+ox)*u.MM,(h-y-oy)*u.MM,u.R*u.MM,fill=1,stroke=0)
        b=label['box'];text(b[0],b[1]+.718*u.FONT/u.MM,str(label['number']))
    line([12,247],[62,247]);line([12,245],[12,249]);line([62,245],[62,249])
    text(12,255,'50 mm | Print at Actual size / 100% | Match paper and answer version.',8)
    text(12,261,'Physical printing & independent human full solve: NOT TESTED. Human time: UNKNOWN.',8)
    text(12,266,'© 2026 ConnectTheDotsPrintable.online. Personal and educational downloading and printing.',8)
    text(12,270,'Commercial use requires prior written permission. See website Terms of Service.',8)
    c.showPage();c.save()
    with u.fitz.open(out) as pdf:pdf[0].get_pixmap(matrix=u.fitz.Matrix(1.5,1.5),alpha=False).save(out.with_suffix('.png'))

def main():
    for id,title,segments in designs():
        folder=ROOT/'assets'/id;folder.mkdir(parents=True,exist_ok=True)
        points=[];edges=[]
        for s in segments:
            s['start']=len(points)+1;points+=s['points'];s['end']=len(points)
            edges+=list(zip(s['points'],s['points'][1:]+s['points'][:1])) if s['closed'] else list(zip(s['points'],s['points'][1:]))
        d={'id':id,'title':title,'count':len(points),'segments':segments,'points':points,'edges':edges,'details':[],'eyes':[],'units':'mm','frame':[210,279.4],'labelFontPt':9,'dotRadiusMm':u.R,'license':u.SOURCE_USAGE,'provenance':'Original coordinates authored for Adults/Extreme task 2026-10-29; no external artwork, tracing, model image or stock inputs.'}
        (folder/'candidate.json').write_text(json.dumps(d,indent=2)+'\n')
        print(id,len(points),'min spacing',min(math.dist(a,b) for i,a in enumerate(points) for b in points[i+1:]),flush=True)
        d['labels']=u.layout(points,edges)
        (folder/'geometry.json').write_text(json.dumps(d,indent=2)+'\n')
        for paper in ['A4','Letter']:
            for sol in [False,True]:render(d,paper,sol,folder/f'{id}-{paper}-{"Solution" if sol else "Puzzle"}.pdf')
        print('EXPORTED',id,flush=True)
if __name__=='__main__':main()
