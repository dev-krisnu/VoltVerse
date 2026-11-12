#!/usr/bin/env python3
"""Add Font Awesome solid icons to the self-hosted subset.  usage: add_icons.py name [name...]
Needs the full font: npm pack @fortawesome/fontawesome-free@6.5.2 and unpack into /tmp/fa/package"""
import re, sys
from fontTools import subset
from fontTools.ttLib import TTFont
FA='/tmp/fa/package'
allcss=open(FA+'/css/all.css').read()
full={}
for m in re.finditer(r'\.fa-([a-z0-9-]+)::?before\{content:"\\([0-9a-f]+)"\}',allcss): full[m.group(1)]=m.group(2)
# aliases like .fa-a,.fa-b:before
for m in re.finditer(r'((?:\.fa-[a-z0-9-]+,?)+)::?before\s*\{\s*content:\s*"\\([0-9a-f]+)"',allcss):
    for n in re.findall(r'\.fa-([a-z0-9-]+)',m.group(1)): full.setdefault(n,m.group(2))
css=open('css/fa/fa.css').read()
cur=dict((n,c) for n,c in re.findall(r'\.fa-([a-z0-9-]+)::before\{content:"\\([0-9a-f]+)"\}',css))
add={}
for n in sys.argv[1:]:
    n=n.replace('fa-','',1) if n.startswith('fa-') else n
    if n in cur: continue
    if n not in full: print('MISSING',n); continue
    add[n]=full[n]
cur.update(add)
opts=subset.Options(); opts.flavor='woff2'; opts.layout_features=[]; opts.name_IDs=[]; opts.notdef_outline=True
f=TTFont(FA+'/webfonts/fa-solid-900.ttf'); s=subset.Subsetter(opts); s.populate(unicodes=[int(c,16) for c in cur.values()]); s.subset(f)
f.flavor='woff2'; f.save('css/fa/fa-solid-900.woff2')
head=css.split('\n')[0]+'\n'+css.split('\n')[1]+'\n'
out=head+''.join('.fa-%s::before{content:"\\%s"}\n'%(n,c) for n,c in sorted(cur.items()))
open('css/fa/fa.css','w').write(out); print('added',list(add),'total',len(cur))
