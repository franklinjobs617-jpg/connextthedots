#!/usr/bin/env python3
"""Task-local alphabet adapter. Reuses original-sheets geometry/collision helpers.
No shared sequence layer changes; no external artwork or font binaries.
"""
from pathlib import Path
import importlib.util, json, math, string
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import stringWidth
import fitz
ROOT=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('original_renderer',ROOT/'scripts/original-sheets/build.py')
base=importlib.util.module_from_spec(spec);spec.loader.exec_module(base)
MM=base.MM
FONT='Times-Roman';SIZE=14
OUT=ROOT/'public/alphabet-dot-to-dot/v1'

def labels(points,details,alphabet):
    lines=list(zip(points,points[1:]+points[:1]))+[s for path in details for s in zip(path,path[1:])]
    placed=[]
    for i,(p,ch) in enumerate(zip(points,alphabet)):
        w=stringWidth(ch,FONT,SIZE)/MM;h=1.334*SIZE/MM
        normal=math.atan2(points[(i+1)%26][1]-points[i-1][1],points[(i+1)%26][0]-points[i-1][0])+math.pi/2
        found=None
        for radius in [4,4.8,5.6,6.4,7.2,8,9,10]:
            for k in range(24):
                ang=normal+k*math.pi/12
                cx,cy=p[0]+radius*math.cos(ang),p[1]+radius*math.sin(ang)
                b=[cx-w/2,cy-h/2,cx+w/2,cy+h/2]
                if b[0]<15 or b[2]>195 or b[1]<51 or b[3]>235:continue
                if any(base.overlap(b,v['box'],1) for v in placed):continue
                if any(base.point_box(q,b)<1.2 for q in points):continue
                if any(base.line_box(a,z,[b[0]-.5,b[1]-.5,b[2]+.5,b[3]+.5]) for a,z in lines):continue
                if any(j!=i and math.dist([cx,cy],q)<radius+.1 for j,q in enumerate(points)):continue
                found={'label':ch,'point':p,'box':b};break
            if found:break
        if not found:raise ValueError(f'Layout failed {i} {ch}')
        placed.append(found)
    return placed

def render(d,case,paper,kind):
    W,H=(210,297) if paper=='A4' else (215.9,279.4)
    ox=(W-210)/2;oy=(H-279.4)/2
    path=OUT/f'{d["id"]}-{case}-{paper}-{kind}.pdf'
    c=canvas.Canvas(str(path),pagesize=(W*MM,H*MM),invariant=1)
    c.setTitle(f'{d["title"]} alphabet dot-to-dot | {case} | {paper} | {kind}')
    c.setAuthor('ConnectTheDotsPrintable.online')
    def text(x,y,t,size=10,font='Helvetica'):
        c.setFont(font,size);c.drawString((x+ox)*MM,(H-y-oy)*MM,t)
    def line(a,b):c.line((a[0]+ox)*MM,(H-a[1]-oy)*MM,(b[0]+ox)*MM,(H-b[1]-oy)*MM)
    start,end=('A','Z') if case=='uppercase' else ('a','z')
    text(16,19,f'Alphabet Dot-to-Dot: {d["title"]}',18)
    text(16,29,f'{case.title()} {start}-{end} | 26 dots | {paper} | {kind}',11)
    text(16,39,f'Start at {start}. Connect in English alphabet order to {end}, then join {end} back to {start}.',10)
    text(16,46,'Solid details are already drawn. Use the matching answer to check your picture.',9)
    c.setLineWidth(.3*MM)
    if kind=='Answer':
        for a,b in zip(d['points'],d['points'][1:]+d['points'][:1]):line(a,b)
    for detail in d['details']:
        for a,b in zip(detail,detail[1:]):line(a,b)
    for p in d['eyes']:c.circle((p[0]+ox)*MM,(H-p[1]-oy)*MM,1.5*MM,fill=0)
    for v in d['layouts'][case]:
        p=v['point'];c.circle((p[0]+ox)*MM,(H-p[1]-oy)*MM,.65*MM,fill=1,stroke=0)
        b=v['box'];text(b[0],b[1]+1.053*SIZE/MM,v['label'],SIZE,FONT)
    line([16,247],[66,247]);line([16,245],[16,249]);line([66,245],[66,249])
    text(16,255,'50 mm check line | Print on the stated paper at Actual size / 100%.',9)
    text(16,262,'© 2026 ConnectTheDotsPrintable.online. Personal and educational use.',8)
    text(16,268,'Commercial use requires prior written permission. See Terms of Service.',8)
    c.showPage();c.save()
    with fitz.open(path) as pdf:pdf[0].get_pixmap(matrix=fitz.Matrix(1.5,1.5),alpha=False).save(path.with_suffix('.png'))

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    designs=json.loads(Path(__file__).with_name('designs.json').read_text())
    for d in designs:
        d['points']=base.sample(d['anchors'],26)
        d['layouts']={case:labels(d['points'],d['details'],alphabet) for case,alphabet in [('uppercase',string.ascii_uppercase),('lowercase',string.ascii_lowercase)]}
        d.update(count=26,closed=True,font=FONT,fontPt=SIZE,units='mm',frame=[210,279.4],provenance='Original C12 coordinate design; no external artwork, tracing, competitor source or reduced existing sheet.',usage='Personal and educational use; commercial use requires prior written permission.')
        for case in d['layouts']:
            for paper in ['A4','Letter']:
                for kind in ['Puzzle','Answer']:render(d,case,paper,kind)
    (OUT/'geometry.json').write_text(json.dumps(designs,indent=2)+'\n')
    (OUT/'SOURCE.md').write_text('# Alphabet originals v1\n\n© 2026 ConnectTheDotsPrintable.online. Free personal and educational downloading and printing. Commercial use requires prior written permission; see /terms/.\n\nOriginal C12 fish, rocket and house coordinate designs; no external artwork or competitor inputs. Each was designed for 26 points, not reduced from a longer worksheet. Source: scripts/alphabet/designs.json; task-local adapter: scripts/alphabet/build.py reuses original-sheets geometry/collision helpers. geometry.json contains points, per-case label boxes, solid details, font and parameters. Standard PDF Times-Roman 14 pt provides a serif lowercase l; no font binaries. Same closed geometry on both papers; A4 vertically centered, Letter horizontally centered. PNGs rendered from each corresponding final PDF. English alphabet only. No age, learning-effect, solve-time or Large Print validation. Physical print and independent full human solve NOT TESTED.\n')
if __name__=='__main__':main()
