from pathlib import Path
from html.parser import HTMLParser
import json,hashlib,subprocess

root=Path('/workspace/connextthedots')
work=Path('/workspace/work/pr2-revision')
dest=root/'docs/growth-sprint-1/revision/evidence'
a=json.loads((work/'evidence/reviewed/snapshots.json').read_text())
b=json.loads((work/'evidence/revised/snapshots.json').read_text())

def sha(value):
    return hashlib.sha256(json.dumps(value,ensure_ascii=False,sort_keys=True).encode()).hexdigest()

def diff(x,y,path=''):
    if type(x)!=type(y): return [{'field':path,'before':x,'after':y}]
    if isinstance(x,dict): return sum([diff(x.get(k),y.get(k),path+'/'+str(k)) for k in sorted(set(x)|set(y))],[])
    if isinstance(x,list) and len(x)==len(y): return sum([diff(v,y[i],path+'/'+str(i)) for i,v in enumerate(x)],[])
    return [] if x==y else [{'field':path,'before':x,'after':y}]

records=[]
for url,old in a.items():
    new=b[url]
    keys=['title','meta','relations','headings']
    assert all(old[k]==new[k] for k in keys),url
    assert old['status']==new['status']==200,url
    assert [v[0] for v in old['links']]==[v[0] for v in new['links']],url
    if url not in ['/dot-to-dot-printable/','/connect-the-dots-for-adults/']:
        assert all(old[k]==new[k] for k in ['text','links','jsonld']),url
    records.append({'url':url,'status_before':200,'status_after':200,'protected_fields_equal':True,'protected_before_sha256':sha({k:old[k] for k in keys}),'protected_after_sha256':sha({k:new[k] for k in keys}),'href_sequence_equal':True,'main_text_equal':old['text']==new['text'],'jsonld_diff':diff(old['jsonld'],new['jsonld'])})
frozen=['app/[locale]/dot-to-dot-printable/page.tsx','app/[locale]/connect-the-dots-for-adults/page.tsx','app/[locale]/page.tsx','app/[locale]/layout.tsx','app/[locale]/printables/[slug]/page.tsx','app/[locale]/printables/[slug]/PrintableDetailClient.tsx','components/PrintableCard.tsx','components/DotGeneratorClient.tsx','components/HomeContent.tsx','lib/metadata.ts','lib/generated-standalone-printables.json','middleware.ts','next.config.ts','app/sitemap.ts','public/robots.txt','i18n/routing.ts']
source=[]
for name in frozen:
    old=subprocess.check_output(['git','show','da8e3b54df99a3e63246c496ade226890bf236ba:'+name],cwd=root)
    cur=(root/name).read_bytes()
    assert old==cur,name
    source.append({'path':name,'main_and_revision_sha256':hashlib.sha256(cur).hexdigest()})
for f in (root/'lib').glob('printables-data*.ts'):
    assert subprocess.check_output(['git','show','da8e3b54df99a3e63246c496ade226890bf236ba:'+str(f.relative_to(root))],cwd=root)==f.read_bytes()
report={'compared_review_head':'93b0ce783b2feb71f3e9f9e35bb04ceebabe4314','revision_application_commit':'60fe15a12d861d799b06d23bbdf0f941dc4ebe30','main_sha':'da8e3b54df99a3e63246c496ade226890bf236ba','scope':'English presentation only; evidence-only follow-up commits do not change runtime files','capture':'Local webpack dev; no TypeScript bypass. External browser requests blocked; APIs locally intercepted. Four local-image detail controls recaptured at same localhost origin to remove test-port-only OG/Twitter image differences; original port capture retained in ZIP.','protected_fields':['document title','all head meta tags','canonical and hreflang/alternate links','all main H1/H2/H3'],'cumulative_main_frozen_source_files':source,'all_catalog_data_modules_unchanged':True,'urls':records}
(root/'docs/growth-sprint-1/seo-impact-diff.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')

class Sections(HTMLParser):
    def __init__(self):
        super().__init__();self.in_main=False;self.depth=0;self.current=None;self.result=[];self.heading=None
    def handle_starttag(self,tag,attrs):
        if tag=='main': self.in_main=True
        if not self.in_main:return
        if tag=='section':
            if self.depth==0:self.current={'heading':'','text':[]}
            self.depth+=1
        if self.depth and tag in ['h1','h2'] and not self.current['heading']: self.heading=tag
    def handle_data(self,data):
        if self.depth:
            if data.strip():self.current['text'].append(data.strip())
            if self.heading:self.current['heading']+=data.strip()
    def handle_endtag(self,tag):
        if tag==self.heading:self.heading=None
        if tag=='section' and self.depth:
            self.depth-=1
            if not self.depth:
                self.current['text']=' '.join(self.current['text']);self.result.append(self.current)
        if tag=='main': self.in_main=False
modules={}
for target in ['dot-to-dot-printable','connect-the-dots-for-adults']:
    old=Sections();new=Sections()
    old.feed((work/f'evidence/reviewed/{target}.html').read_text());new.feed((work/f'evidence/revised/{target}.html').read_text())
    assert [v['heading'] for v in old.result]==[v['heading'] for v in new.result]
    modules['/'+target+'/']=[{'module':x['heading'],'changed':x['text']!=y['text'],'before':x['text'],'after':y['text']} for x,y in zip(old.result,new.result)]
(dest/'module-before-after.json').write_text(json.dumps(modules,ensure_ascii=False,indent=2)+'\n')
print('26 URL comparisons and cumulative frozen-source checks pass; exact module text saved.')
