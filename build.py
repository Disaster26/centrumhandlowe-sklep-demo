import json
F=json.load(open('_src/katalog.json',encoding='utf-8'))
for f in F:
    f.pop('pelna',None)
    for w in f['war']:
        for k in [k for k,v in w.items() if v in (None,False,[])]: w.pop(k)
open('dane.js','w',encoding='utf-8').write('window.KAT='+json.dumps(F,ensure_ascii=False,separators=(',',':'))+';')
s=open('src.html',encoding='utf-8').read()
s=s.replace('{{BADGE_STYLE}}',open('badge_style.part',encoding='utf-8').read().replace('<style>','').replace('</style>',''))
s=s.replace('{{BADGE_LINK}}',open('badge_link.part',encoding='utf-8').read())
assert '{{' not in s
open('index.html','w',encoding='utf-8').write(s)
print('ok',len(s))
