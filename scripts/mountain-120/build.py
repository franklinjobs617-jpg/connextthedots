#!/usr/bin/env python3
"""One-off original Mountain Landscape worksheet, not a site generator.

Physical coordinates are millimetres on A4. The solution connects exactly the
same ordered points as the puzzle. No third-party artwork or tracing is used.
"""
from pathlib import Path
import math, json, time, hashlib
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parent
OUT = ROOT.parent.parent / 'public/printables/mountain-landscape-120/v0.2'
EVIDENCE = ROOT.parent.parent / 'work/mountain-120'
FONT_PATH = ROOT / 'fonts/DejaVuSans.ttf'
if not FONT_PATH.exists(): FONT_PATH = Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')
BOLD_PATH = ROOT / 'fonts/DejaVuSans-Bold.ttf'
if not BOLD_PATH.exists(): BOLD_PATH = Path('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')
MM = 72 / 25.4
PAGE = (210, 297)
N = 120
FONT_PT = 9.2
RADIUS = 0.60
LABEL_GAP = 0.70
INK_GAP = 0.36
SAFE = (15, 50, 195, 258)

# Directly authored original geometry: a foreground fir, three asymmetrical
# peaks, and an uneven foreground shoreline. No imported image, CDN or model
# image-generation request is involved. Coordinates remain editable in JSON.
ANCHORS = [
    [34,234], [34,220], [23,220], [31,209], [26,209],
    [34,198], [29,198], [38,185], [46,198], [41,198],
    [49,209], [44,209], [53,220], [42,220], [42,231],
    [59,219], [65,210], [69,195], [76,183], [81,164],
    [86,153], [91,132], [97,115], [103,130], [108,135],
    [114,154], [119,140], [124,119], [129,110], [137,86],
    [145,65], [152,82], [158,91], [164,110], [170,124],
    [174,139], [178,127], [183,109], [188,98],
    [191,121], [188,141], [192,156], [188,174],
    [190,191], [184,208], [186,220], [177,230],
    [165,232], [154,229], [141,236], [128,234],
    [115,240], [102,237], [90,243], [77,239],
    [64,244], [51,240], [41,242],
]

def dist(a,b): return math.hypot(a[0]-b[0],a[1]-b[1])

def sample(anchors):
    lengths=[dist(p,anchors[(i+1)%len(anchors)]) for i,p in enumerate(anchors)]
    # Preserve every authored corner. Allocate remaining intervals by length.
    counts=[1]*len(anchors)
    for _ in range(N-len(anchors)):
        i=max(range(len(lengths)),key=lambda j:lengths[j]/counts[j])
        counts[i]+=1
    pts=[]
    for i,a in enumerate(anchors):
        b=anchors[(i+1)%len(anchors)]
        for j in range(counts[i]):
            t=j/counts[i]
            pts.append([round(a[0]+(b[0]-a[0])*t,5),round(a[1]+(b[1]-a[1])*t,5)])
    assert len(pts)==N
    return pts

def overlap(a,b,gap=0):
    return not (a[2]+gap<=b[0] or b[2]+gap<=a[0] or a[3]+gap<=b[1] or b[3]+gap<=a[1])

def box_distance(p,b):
    return math.hypot(max(b[0]-p[0],0,p[0]-b[2]),max(b[1]-p[1],0,p[1]-b[3]))

def line_hits_rect(p,q,b):
    # Liang-Barsky clipping: includes endpoints and rect boundary.
    dx=q[0]-p[0];dy=q[1]-p[1];lo=0.;hi=1.
    for v,w in [(-dx,p[0]-b[0]),(dx,b[2]-p[0]),(-dy,p[1]-b[1]),(dy,b[3]-p[1])]:
        if abs(v)<1e-12:
            if w<0:return False
        else:
            t=w/v
            if v<0:lo=max(lo,t)
            else:hi=min(hi,t)
            if lo>hi:return False
    return True

def place_labels(points):
    # Use the exported PDF font descriptor metrics rather than the TTF hhea
    # line box: independent PDF extraction found a #10 association ambiguity.
    asc_pt, desc_pt = pdfmetrics.getAscentDescent('ML', FONT_PT)
    asc, desc = asc_pt/MM, desc_pt/MM
    metrics={'font_pt':FONT_PT,'ascent_mm':asc,'descent_mm':desc}
    lines=[(p,points[(i+1)%N]) for i,p in enumerate(points)]
    candidates={}
    for i,p in enumerate(points):
        text=str(i+1);width=pdfmetrics.stringWidth(text,'ML',FONT_PT)/MM
        options=[]
        for radius in [3.4,4.1,4.8,5.6,6.4]:
            for k in range(24):
                angle=2*math.pi*k/24
                cx=p[0]+radius*math.cos(angle);cy=p[1]+radius*math.sin(angle)
                box=(cx-width/2,cy-(asc-desc)/2,cx+width/2,cy+(asc-desc)/2)
                if box[0]<SAFE[0] or box[1]<SAFE[1] or box[2]>SAFE[2] or box[3]>SAFE[3]:continue
                own=box_distance(p,box)
                if own<RADIUS+INK_GAP:continue
                # Clear association: its own dot is the closest dot to the label box.
                foreign=min(box_distance(q,box) for j,q in enumerate(points) if j!=i)
                if foreign<max(RADIUS+INK_GAP,own+0.50):continue
                expanded=(box[0]-INK_GAP,box[1]-INK_GAP,box[2]+INK_GAP,box[3]+INK_GAP)
                if any(line_hits_rect(a,b,expanded) for a,b in lines):continue
                # Nearest feasible placement first, soft preference for upper-right.
                score=radius+0.08*abs(math.sin(angle+math.pi/4))
                options.append({'x_mm':round(box[0],5),'baseline_mm':round(cy+(asc+desc)/2,5),'bbox_mm':[round(v,5) for v in box],'score':score})
        if not options:
            raise RuntimeError(f'No collision-free 9.2pt label candidate for point {i+1} at {p}')
        candidates[i]=sorted(options,key=lambda c:c['score'])
    neighbors={i:[j for j in range(N) if j!=i and dist(points[i],points[j])<23] for i in range(N)}
    visits=0
    def search(remaining,assigned):
        nonlocal visits
        visits+=1
        if visits>100000:return None
        if not remaining:return assigned
        i=min(remaining,key=lambda j:(len(remaining[j]),-len(neighbors[j])))
        for c in remaining[i]:
            next_remaining=dict(remaining);del next_remaining[i]
            ok=True
            for j in neighbors[i]:
                if j not in next_remaining:continue
                opts=[v for v in next_remaining[j] if not overlap(c['bbox_mm'],v['bbox_mm'],LABEL_GAP)]
                if not opts:ok=False;break
                next_remaining[j]=opts
            if ok:
                result=search(next_remaining,{**assigned,i:c})
                if result is not None:return result
        return None
    result=search(candidates,{})
    if result is None:raise RuntimeError('Collision-free label assignment not found; do not reduce the font to force a pass.')
    return [result[i] for i in range(N)],{**metrics,'search_visits':visits,'candidate_min':min(map(len,candidates.values()))}

def text_pdf(c,x,y,text,font='ML',size=9):
    c.setFont(font,size);c.drawString(x*MM,(297-y)*MM,text)

def page_pdf(data,solution):
    target=OUT/('Mountain-Landscape-120-Solution.pdf' if solution else 'Mountain-Landscape-120-Puzzle.pdf')
    c=canvas.Canvas(str(target),pagesize=(210*MM,297*MM),invariant=1,pageCompression=1)
    c.setTitle('Mountain Landscape — 120-point '+('Solution' if solution else 'Puzzle'))
    c.setAuthor('ConnectTheDotsPrintable.online')
    c.setFillColorRGB(0.08,0.10,0.12)
    text_pdf(c,17,24,'Mountain Landscape','MLB',22)
    c.setFont('MLB',10);c.drawRightString(193*MM,(297-23.5)*MM,'120 DOTS')
    text_pdf(c,17,33,('SOLUTION' if solution else 'PUZZLE')+' · 120-point worksheet · v0.2',size=10.2)
    text_pdf(c,17,41,'Connect 1 to 120 in order, then join 120 back to 1.',size=9.3)
    c.setStrokeColorRGB(.65,.68,.70);c.setLineWidth(.25)
    c.line(17*MM,(297-46)*MM,193*MM,(297-46)*MM)
    if solution:
        c.setStrokeColorRGB(.10,.12,.14);c.setLineWidth(.36*MM)
        path=c.beginPath();p=data['points'][0];path.moveTo(p['x_mm']*MM,(297-p['y_mm'])*MM)
        for p in data['points'][1:]+data['points'][:1]:path.lineTo(p['x_mm']*MM,(297-p['y_mm'])*MM)
        c.drawPath(path,stroke=1,fill=0)
    c.setFillColorRGB(0,0,0)
    for p in data['points']:
        c.circle(p['x_mm']*MM,(297-p['y_mm'])*MM,RADIUS*MM,stroke=0,fill=1)
        label=p['label'];text_pdf(c,label['x_mm'],label['baseline_mm'],str(p['number']),size=FONT_PT)
    c.setStrokeColorRGB(.65,.68,.70);c.setLineWidth(.25)
    c.line(17*MM,(297-268)*MM,193*MM,(297-268)*MM)
    text_pdf(c,17,276,'Print at Actual size / 100% on A4.',size=9)
    text_pdf(c,17,284,'ConnectTheDotsPrintable.online',size=7.7)
    c.setFont('ML',7.7);c.drawCentredString(165*MM,(297-276)*MM,'50 mm print check')
    c.setStrokeColorRGB(0,0,0);c.setLineWidth(.5)
    c.line(140*MM,(297-282)*MM,190*MM,(297-282)*MM)
    for x in [140,190]:c.line(x*MM,(297-280.5)*MM,x*MM,(297-283.5)*MM)
    c.showPage();c.save()

def page_svg(data,solution):
    role='Solution' if solution else 'Puzzle'
    parts=['<?xml version="1.0" encoding="UTF-8"?>',
        '<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297">',
        '<title>Mountain Landscape — 120-point '+role+'</title>',
        '<desc>Original geometry. Join points 1 through 120, then 120 to 1. Labels remain editable text. Use DejaVu Sans; PDF is the canonical print export.</desc>',
        '<rect width="210" height="297" fill="white"/>',
        '<g font-family="DejaVu Sans, sans-serif" fill="#14191f">',
        '<text x="17" y="24" font-size="7.7611" font-weight="bold">Mountain Landscape</text>',
        '<text x="193" y="23.5" text-anchor="end" font-size="3.5278" font-weight="bold">120 DOTS</text>',
        '<text x="17" y="33" font-size="3.5983">'+role.upper()+' · 120-point worksheet · v0.2</text>',
        '<text x="17" y="41" font-size="3.2808">Connect 1 to 120 in order, then join 120 back to 1.</text>',
        '<path d="M17 46H193 M17 268H193" fill="none" stroke="#a6adb3" stroke-width="0.0882"/>']
    if solution:
        coords=' '.join(f'{p["x_mm"]},{p["y_mm"]}' for p in data['points']+data['points'][:1])
        parts.append(f'<polyline id="solution-path" points="{coords}" fill="none" stroke="#191f24" stroke-width="0.36" stroke-linejoin="round" stroke-linecap="round"/>')
    parts.append('<g id="numbered-points" fill="black">')
    for p in data['points']:
        parts.append(f'<circle id="dot-{p["number"]:03d}" data-number="{p["number"]}" cx="{p["x_mm"]}" cy="{p["y_mm"]}" r="{RADIUS}"/>')
    parts.append('</g><g id="number-labels" fill="black" font-size="'+str(FONT_PT/MM)+'">')
    for p in data['points']:
        q=p['label'];parts.append(f'<text id="label-{p["number"]:03d}" data-number="{p["number"]}" x="{q["x_mm"]}" y="{q["baseline_mm"]}">{p["number"]}</text>')
    parts.extend(['</g>', '<text x="17" y="276" font-size="3.175">Print at Actual size / 100% on A4.</text>',
        '<text x="17" y="284" font-size="2.7164">ConnectTheDotsPrintable.online</text>',
        '<text x="165" y="276" text-anchor="middle" font-size="2.7164">50 mm print check</text>',
        '<path d="M140 282H190 M140 280.5V283.5 M190 280.5V283.5" fill="none" stroke="black" stroke-width="0.1764"/>',
        '</g></svg>'])
    (OUT/f'Mountain-Landscape-120-{role}.svg').write_text('\n'.join(parts)+'\n')

def main():
    t0=time.perf_counter();OUT.mkdir(parents=True,exist_ok=True);EVIDENCE.mkdir(parents=True,exist_ok=True)
    expected_fonts = {FONT_PATH: '57f73e11f51999432bf7ab22ce55b6f945d5eca1bf824404cfa9ec2e3718c84e', BOLD_PATH: 'a4c5bc453ca281d90ea079e596da7ae0dfeb5777497c29ec254e76d97ff6f890'}
    for font, digest in expected_fonts.items():
        if hashlib.sha256(font.read_bytes()).hexdigest() != digest:
            raise RuntimeError(f'Font hash mismatch: {font.name}; use the documented DejaVu files.')
    pdfmetrics.registerFont(TTFont('ML',str(FONT_PATH)));pdfmetrics.registerFont(TTFont('MLB',str(BOLD_PATH)))
    master=ROOT/'design.json'
    if master.exists():design=json.loads(master.read_text());anchors=design['anchors_mm']
    else:
        design={'theme':'Mountain Landscape','version':'v0.2','target_points':120,'page_mm':[210,297],'closed_sequence':True,'authoring':'Coordinates authored directly for this task, not traced from outside artwork.','anchors_mm':ANCHORS}
        master.write_text(json.dumps(design,indent=2)+'\n');anchors=ANCHORS
    points=sample(anchors);labels,stats=place_labels(points)
    data={'version':'v0.2','page_mm':[210,297],'font_pt':FONT_PT,'dot_radius_mm':RADIUS,'point_count':len(points),'closed':True,'points':[{'number':i+1,'x_mm':p[0],'y_mm':p[1],'label':labels[i]} for i,p in enumerate(points)]}
    (ROOT/'points-and-labels.json').write_text(json.dumps(data,indent=2)+'\n')
    for solution in [False,True]:page_pdf(data,solution);page_svg(data,solution)
    stats['build_elapsed_seconds']=round(time.perf_counter()-t0,4)
    (EVIDENCE/'build-metrics.json').write_text(json.dumps(stats,indent=2)+'\n')
    print(json.dumps({'result':'built','points':len(points),'font_pt':FONT_PT,**stats},indent=2))

if __name__=='__main__':
    try:main()
    except Exception as exc:
        EVIDENCE.mkdir(parents=True,exist_ok=True)
        payload={'result':'failed','reason':str(exc),'no_quality_downgrade':True}
        existing=list(EVIDENCE.glob('failed-build-*.json'))
        (EVIDENCE/f'failed-build-{len(existing)+1:02d}.json').write_text(json.dumps(payload,indent=2)+'\n')
        raise
