(function(){
'use strict';
var KAT=window.KAT||[];
var V=document.getElementById('v');
var KATS=[
 {id:'koldry',n:'Kołdry',o:'Letnie, całoroczne i zimowe - antyalergiczne, bambusowe i spinane 4 pory roku. Rozmiar wybierzesz w karcie produktu.',img:'img/kat-koldry-360.webp',cut:1,s:'letnie, całoroczne, zimowe'},
 {id:'poduszki',n:'Poduszki',o:'Pikowane, regulowane, półpuchowe i ortopedyczne - od jaśka 40x40 do 70x80.',img:'img/kat-poduszki-360.webp',cut:1,s:'od 40x40 do 70x80'},
 {id:'komplety',n:'Komplety',o:'Kołdra z jedną lub dwiema poduszkami w niższej cenie niż osobno, także komplety dziecięce.',img:'img/kat-komplety-360.webp',s:'kołdra z poduszkami'},
 {id:'posciel',n:'Pościel',o:'Pościel z kory 160x200 ze 100% bawełny, w komplecie z dwiema poszewkami 70x80.',img:'img/kat-posciel-360.webp',s:'bawełna, kora'},
 {id:'przescieradla',n:'Prześcieradła',o:'Jersey i frotte z gumką na materace do 20 cm oraz wełniane prześcieradła Merynos.',img:'img/kat-przescieradla-360.webp',s:'jersey, frotte, wełna'},
 {id:'koce',n:'Koce i narzuty',o:'Koce wełniane KAMPOL i Merynos BUKLE oraz grube koce Elway 160x210.',img:'img/kat-koce-360.webp',s:'wełniane, Elway'},
 {id:'podklady',n:'Podkłady i ochraniacze',o:'Wodoodporne ochraniacze BAMBOO i TENCEL oraz podkłady Medical+ z gumką.',img:'img/p/7392-400.webp',cut:1,s:'wodoodporne, z gumką'}
];
var KN={};KATS.forEach(function(k){KN[k.id]=k});
KN.w24={id:'w24',n:'Wysyłka 24h',o:'Produkty z oznaczeniem „wysyłka 24h” - zamówione do 13:00 wysyłamy tego samego dnia.'};
var FAM={},PID={};
KAT.forEach(function(f){FAM[f.id]=f;f.war.forEach(function(w,i){PID[w.pid]={f:f,w:w,i:i}})});

/* ---------- narzedzia ---------- */
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function zl(v){return (Math.round(v*100)/100).toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' zł'}
function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ł/g,'l')}
function im(id,w){return 'img/p/'+id+'-'+(w||400)+'.webp'}
function ico(n){return '<svg aria-hidden="true"><use href="#i-'+n+'"/></svg>'}
var ALIAS={'135x200':'135/140x200','140x200':'135/140x200','155x200':'155/160x200','160x200':'155/160x200','200x220':'220x200'};
function rozK(a){var m=String(a).match(/(\d{2,3})x(\d{2,3})/);if(!m)return null;var k=m[1]+'x'+m[2];return ALIAS[k]||k}
function rozNum(k){var m=String(k).match(/(\d+)(?:\/\d+)?x(\d+)/);return m?(+m[1])*1000+(+m[2]):0}
var store={};
function lsGet(k){try{var v=localStorage.getItem(k);return v?JSON.parse(v):null}catch(e){return store[k]||null}}
function lsSet(k,v){store[k]=v;try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function q(s,r){return (r||document).querySelector(s)}
function qa(s,r){return [].slice.call((r||document).querySelectorAll(s))}
function wariantTxt(f,w,c){
  if(f.typ==='rozmiar')return 'Rozmiar: '+w.a;
  if(f.typ==='komplet')return 'Kołdra '+w.a+', poduszki '+w.b;
  if(f.typ==='kolor')return 'Kolor: '+w.a+(c!=null&&w.combos?', rozmiar '+w.combos[c].a:'');
  return 'Wzór: '+w.a;
}
function nazwaW(f,w,c){
  if(f.typ==='rozmiar')return f.nazwa.indexOf(w.a.replace(/ \(.*/,''))>-1?f.nazwa:f.nazwa+' '+w.a;
  if(f.typ==='komplet')return f.nazwa.split(':')[0]+': kołdra '+w.a+' + '+w.b.replace('x ','x poduszka ');
  if(f.typ==='kolor')return f.nazwa+' '+w.a+(c!=null&&w.combos?' '+w.combos[c].a:'');
  return f.nazwa+' - '+w.a;
}
function slug(s){return norm(s).replace(/\+/g,' ').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function purl(pid,c){var x=PID[pid];return '#/p/'+pid+'-'+slug(nazwaW(x.f,x.w,c))}
function cenaW(w,c){return w.cena+(c!=null&&w.combos?w.combos[c].dp:0)}

/* ---------- koszyk ---------- */
var KEY='ch_demo_koszyk';
var kosz=lsGet(KEY)||[];
kosz=kosz.filter(function(l){return PID[l.pid]&&l.q>0});
function kZapisz(){lsSet(KEY,kosz);kOdswiez()}
function kSuma(){return kosz.reduce(function(s,l){var p=PID[l.pid];return s+cenaW(p.w,l.c)*l.q},0)}
function kIle(){return kosz.reduce(function(s,l){return s+l.q},0)}
function kOdswiez(){q('#suma').textContent=zl(kSuma());q('#ile').textContent=kIle()}
function kDodaj(pid,c,n){
  var k=pid+'|'+(c==null?'':c),l=kosz.filter(function(x){return x.k===k})[0];
  if(l)l.q=Math.min(99,l.q+n);else kosz.push({k:k,pid:pid,c:c==null?null:c,q:n});
  kZapisz();var b=q('#kosz');b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump');
  mkPokaz(k);
}
function kZmien(k,n){kosz.forEach(function(l){if(l.k===k)l.q=Math.max(1,Math.min(99,n))});kZapisz()}
function kUsun(k){kosz=kosz.filter(function(l){return l.k!==k});kZapisz()}
var DARMO=100;
function progHtml(s){
  if(s>=DARMO)return '<div class="prog ok">Masz darmową dostawę</div>';
  return '<div class="prog">Do darmowej dostawy brakuje <b>'+zl(DARMO-s)+'</b><div class="bar"><i style="width:'+Math.round(s/DARMO*100)+'%"></i></div></div>';
}
function linia(l,edyt){
  var p=PID[l.pid],f=p.f,w=p.w,c=cenaW(w,l.c);
  return '<div class="lin" data-k="'+esc(l.k)+'"><a class="fo" href="'+purl(w.pid,l.c)+'"><img src="'+im(w.img)+'" width="400" height="400" alt="'+esc(f.nazwa)+'" loading="lazy"></a><div><a class="nz" href="'+purl(w.pid,l.c)+'">'+esc(nazwaW(f,w,l.c))+'</a><div class="wa">'+esc(wariantTxt(f,w,l.c))+'</div>'+
   '<div class="dol">'+(edyt?'<div class="il"><button type="button" data-m="-1" aria-label="Mniej">−</button><input type="number" min="1" max="99" value="'+l.q+'" aria-label="Ilość" inputmode="numeric"><button type="button" data-m="1" aria-label="Więcej">+</button></div><button class="us" type="button">Usuń</button>':'<span class="wa">'+l.q+' szt. × '+zl(c)+'</span>')+
   '<span class="cl">'+zl(c*l.q)+(edyt&&l.q>1?'<small>'+zl(c)+' / szt.</small>':'')+'</span></div></div></div>';
}

/* ---------- panel "dodano do koszyka" ---------- */
var mk=q('#mk'),zas=q('#zas'),mkPrev=null;
function mkPokaz(k){
  var l=kosz.filter(function(x){return x.k===k})[0];if(!l)return;
  q('#mk-t').innerHTML=linia(l,false);
  var s=kSuma();
  q('#mk-d').innerHTML='<div class="mk-s"><span>W koszyku ('+kIle()+' szt.)</span><span>'+zl(s)+'</span></div>'+progHtml(s)+'<a class="btn nb" href="#/koszyk">Przejdź do koszyka <i class="ar" aria-hidden="true"></i></a><button class="btn jas" type="button" data-zamknij>Kontynuuj zakupy</button>';
  mkPrev=document.activeElement;mk.classList.add('on');zas.classList.add('on');document.body.style.overflow='hidden';
  setTimeout(function(){mk.focus()},50);
}
function mkUkryj(){if(!mk.classList.contains('on'))return;mk.classList.remove('on');zas.classList.remove('on');document.body.style.overflow='';if(mkPrev&&mkPrev.focus)mkPrev.focus()}
zas.addEventListener('click',mkUkryj);q('#mk-x').addEventListener('click',mkUkryj);
mk.addEventListener('click',function(e){if(e.target.closest('[data-zamknij]')||e.target.closest('a'))mkUkryj()});

/* ---------- elementy listy ---------- */
function elementy(fams,fl){
  fl=fl||{};var out=[];
  fams.forEach(function(f){
    if(f.typ==='rozmiar'||f.typ==='komplet'){
      var ws=f.war.filter(function(w){return (!fl.roz||fl.roz.indexOf(rozK(w.a))>-1)&&(!fl.w24||w.w24)});
      if(!ws.length)return;
      var min=ws.reduce(function(a,w){return w.cena<a.cena?w:a},ws[0]);
      var rozne=ws.some(function(w){return w.cena!==min.cena});
      var g=(f.gal&&f.gal.length?f.gal:[min.img]).slice(0,4);
      if(ws.length===1&&g.indexOf(min.img)<0)g=[min.img].concat(g).slice(0,4);
      out.push({f:f,w:min,c:null,t:f.nazwa,g:g,cena:min.cena,stara:min.stara,od:rozne,
        wr:f.war.length>1?(f.typ==='komplet'?f.war.length+' wariantów rozmiaru':f.war.length+(f.war.length<5?' rozmiary':' rozmiarów')):(min.a||''),w24:ws.some(function(w){return w.w24}),sz:ws.map(function(w){return rozK(w.a)})});
    }else{
      f.war.forEach(function(w){
        if(fl.w24&&!w.w24)return;
        var c=null,cena=w.cena,od=false,sz=[];
        if(w.combos){sz=w.combos.map(function(x){return rozK(x.a)});
          if(fl.roz){var idx=-1;w.combos.forEach(function(x,i){if(idx<0&&fl.roz.indexOf(rozK(x.a))>-1)idx=i});if(idx<0)return;c=idx;cena=cenaW(w,idx)}
          else od=w.combos.some(function(x){return x.dp>0});
        }else{var r=rozK(f.nazwa);if(r)sz=[r];if(fl.roz&&sz.length&&fl.roz.indexOf(sz[0])<0)return;if(fl.roz&&!sz.length)return}
        out.push({f:f,w:w,c:c,t:f.nazwa+' - '+w.a,g:(w.g&&w.g.length?w.g:[w.img]).slice(0,4),cena:cena,stara:w.stara,od:od,wr:w.combos&&c==null?w.combos.length+' rozmiarów':'',w24:w.w24,sz:sz});
      });
    }
  });
  return out;
}
function karta(e){
  var href=purl(e.w.pid,e.c);
  var imgs=e.g.map(function(id,i){return '<a href="'+href+'" tabindex="-1" draggable="false"><img src="'+im(id)+'" srcset="'+im(id)+' 400w, '+im(id,800)+' 800w" sizes="(min-width:1300px) 18vw, (min-width:700px) 30vw, 47vw" width="400" height="400" alt="'+(i?'':esc(e.t))+'" loading="lazy" draggable="false"></a>'}).join('');
  var dots=e.g.length>1?'<span class="kr" aria-hidden="true">'+e.g.map(function(_,i){return '<i'+(i?'':' class="on"')+'></i>'}).join('')+'</span><button class="st l" type="button" tabindex="-1" aria-label="Poprzednie zdjęcie">'+ico('l')+'</button><button class="st p" type="button" tabindex="-1" aria-label="Następne zdjęcie">'+ico('p')+'</button>':'';
  var pro=e.stara&&e.stara>e.cena;
  var multi=(e.f.typ==='rozmiar'||e.f.typ==='komplet')&&e.f.war.length>1||e.f.typ==='kolor'&&e.w.combos&&e.c==null;
  return '<article class="pk"><div class="fo">'+(e.w24?'<span class="w24"><i class="ar" aria-hidden="true"></i>wysyłka 24h</span>':'')+'<div class="sw" data-sw>'+imgs+'</div>'+dots+'</div>'+
   '<div class="tr">'+(e.f.prod?'<span class="pd">'+esc(e.f.prod)+'</span>':'')+'<h3><a href="'+href+'">'+esc(e.t)+'</a></h3>'+(e.f.typ==='rozmiar'&&e.f.war.length>1?'<span class="rch">'+e.f.war.map(function(v){return '<a href="'+purl(v.pid)+'"'+(v===e.w?' class="on"':'')+'>'+esc(v.a.replace(/ \(.*/,''))+'</a>'}).join('')+'</span>':(e.wr?'<span class="wr">'+esc(e.wr)+'</span>':''))+
   '<p class="cn'+(pro?' pro':'')+'">'+(e.od?'<small>od</small>':'')+'<b>'+zl(e.cena)+'</b>'+(pro?'<s>'+zl(e.stara)+'</s>':'')+'</p>'+
   (multi?'<a class="btn dk" href="'+href+'">Wybierz rozmiar</a>':'<button class="btn dk" type="button" data-dodaj="'+e.w.pid+'"'+(e.c!=null?' data-c="'+e.c+'"':'')+'>Do koszyka</button>')+'</div></article>';
}

/* ---------- przeciaganie mysza + karuzele w kartach ---------- */
function drag(el){
  if(el._d)return;el._d=1;
  var down=false,sx=0,sl=0,moved=false;
  el.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0||el.scrollWidth<=el.clientWidth+2)return;down=true;moved=false;sx=e.clientX;sl=el.scrollLeft});
  window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>5){moved=true;el.classList.add('drag')}if(moved)el.scrollLeft=sl-dx});
  window.addEventListener('pointerup',function(){if(!down)return;down=false;el.classList.remove('drag');if(moved){var c=el.firstElementChild,w=c?c.getBoundingClientRect().width+(parseFloat(getComputedStyle(el).columnGap)||0):el.clientWidth;el.scrollTo({left:Math.round(el.scrollLeft/w)*w,behavior:'smooth'})}setTimeout(function(){moved=false},0)});
  el.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
  el.addEventListener('dragstart',function(e){e.preventDefault()});
}
function initKarty(root){
  qa('[data-sw]',root).forEach(function(sw){
    drag(sw);var fo=sw.parentNode,dots=qa('.kr i',fo);
    if(dots.length){
      sw.addEventListener('scroll',function(){var i=Math.round(sw.scrollLeft/sw.clientWidth);dots.forEach(function(d,j){d.classList.toggle('on',i===j)})},{passive:true});
      qa('.st',fo).forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var i=Math.round(sw.scrollLeft/sw.clientWidth)+(b.classList.contains('p')?1:-1);if(i<0)i=dots.length-1;if(i>=dots.length)i=0;sw.scrollTo({left:i*sw.clientWidth,behavior:'smooth'})})});
    }
  });
  qa('[data-tor]',root).forEach(function(t){drag(t);var nav=q('[data-nav="'+t.id+'"]',root);if(!nav)return;var bs=qa('button',nav);
    function step(){var k=t.firstElementChild;return k?k.getBoundingClientRect().width+16:300}
    bs.forEach(function(b){b.addEventListener('click',function(){t.scrollBy({left:step()*(+b.dataset.k),behavior:'smooth'})})});
    function upd(){bs[0].disabled=t.scrollLeft<4;bs[1].disabled=t.scrollLeft+t.clientWidth>=t.scrollWidth-4;nav.hidden=t.scrollWidth<=t.clientWidth+2}
    t.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);upd();
  });
}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-dodaj]');if(!b)return;
  e.preventDefault();kDodaj(b.dataset.dodaj,b.dataset.c!=null?+b.dataset.c:null,1);
  b.textContent='W koszyku';b.classList.add('ok');
});

/* ---------- menu ---------- */
var top=q('#top'),bg=q('#burger');
q('#menu-l').innerHTML=KATS.map(function(k){return '<li><a href="#/k/'+k.id+'" data-kat="'+k.id+'">'+esc(k.n)+'</a></li>'}).join('')+'<li class="ok"><a href="#/k/w24" data-kat="w24">Wysyłka 24h</a></li>';
function menuZamknij(){top.classList.remove('open');bg.setAttribute('aria-expanded','false');bg.setAttribute('aria-label','Otwórz menu');document.body.style.overflow=''}
bg.addEventListener('click',function(){var o=top.classList.toggle('open');top.style.setProperty('--mtop',top.getBoundingClientRect().bottom+'px');bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');document.body.style.overflow=o?'hidden':''});
q('#menu').addEventListener('click',function(e){if(e.target.closest('a'))menuZamknij()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){menuZamknij();mkUkryj();lbZamknij()}});

/* ---------- wyszukiwarka ---------- */
function hay(e){var s=e.t+' '+(e.f.prod||'')+' '+(KN[e.f.kat]?KN[e.f.kat].n:'')+' '+(e.f.rodz||'')+' '+e.f.war.map(function(w){return w.a+' '+(w.b||'')}).join(' ')+' '+e.sz.join(' ');
  s=s.replace(/(\d+)\/(\d+)x(\d+)/g,'$1x$3 $2x$3');return norm(s)}
function szukaj(qs){
  var t=norm(qs.trim()),sl=t.split(/\s+/).filter(Boolean);if(!sl.length)return[];
  var roz=null,m=t.match(/(\d{2,3})\s*x\s*(\d{2,3})/);if(m)roz=[rozK(m[1]+'x'+m[2])];
  var lista=elementy(KAT,roz?{roz:roz}:{});
  if(!lista.length&&roz)lista=elementy(KAT,{});
  var slb=sl.filter(function(w){return !/^\d{2,3}x\d{2,3}$/.test(w)});
  return lista.filter(function(e){var h=hay(e);return slb.every(function(w){return h.indexOf(w)>-1||(w.length>4&&h.indexOf(w.slice(0,-1))>-1)})});
}
qa('[data-szuk]').forEach(function(f){
  var inp=q('input',f),pod=null,sel=-1;
  function zamk(){if(pod){pod.remove();pod=null;sel=-1}}
  inp.addEventListener('input',function(){
    var v=inp.value.trim();if(v.length<2){zamk();return}
    var r=szukaj(v);if(!pod){pod=document.createElement('div');pod.className='pod';pod.setAttribute('role','listbox');f.appendChild(pod)}
    sel=-1;pod.innerHTML=r.length?r.slice(0,6).map(function(e){return '<a role="option" href="'+purl(e.w.pid,e.c)+'"><img src="'+im(e.g[0])+'" alt="" width="56" height="56"><span>'+esc(e.t)+'</span><b>'+(e.od?'od ':'')+zl(e.cena)+'</b></a>'}).join('')+'<a class="wsz" href="#/szukaj?q='+encodeURIComponent(v)+'">Pokaż wszystkie wyniki ('+r.length+')</a>':'<div class="nic">Brak produktów dla „'+esc(v)+'”. Spróbuj: kołdra, poduszka, koc, 160x200.</div>';
  });
  inp.addEventListener('keydown',function(e){if(!pod)return;var as=qa('a',pod);if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();sel=(sel+(e.key==='ArrowDown'?1:-1)+as.length)%as.length;as.forEach(function(a,i){a.classList.toggle('on',i===sel)})}else if(e.key==='Enter'&&sel>-1){e.preventDefault();location.hash=as[sel].getAttribute('href');zamk();inp.blur()}else if(e.key==='Escape')zamk()});
  f.addEventListener('submit',function(e){e.preventDefault();var v=inp.value.trim();zamk();if(v){location.hash='#/szukaj?q='+encodeURIComponent(v);inp.blur()}});
  document.addEventListener('click',function(e){if(pod&&!f.contains(e.target))zamk();if(pod&&e.target.closest&&e.target.closest('.pod a')){zamk();inp.blur()}});
});

/* ---------- lightbox ---------- */
var lb=null,lbPrev=null;
function lbOtworz(ids,i,alt){
  lbPrev=document.activeElement;lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Zdjęcia produktu');
  lb.innerHTML='<div class="gt">'+ids.map(function(id,j){return '<div><img src="'+im(id,800)+'" width="800" height="800" alt="'+esc(alt)+' - zdjęcie '+(j+1)+'"></div>'}).join('')+'</div><span class="lic"></span>'+(ids.length>1?'<button class="st l" type="button" aria-label="Poprzednie">'+ico('l')+'</button><button class="st p" type="button" aria-label="Następne">'+ico('p')+'</button>':'')+'<button class="x" type="button" aria-label="Zamknij"></button>';
  document.body.appendChild(lb);document.body.style.overflow='hidden';
  var gt=q('.gt',lb),lic=q('.lic',lb);
  function upd(){var j=Math.round(gt.scrollLeft/gt.clientWidth);lic.textContent=(j+1)+' / '+ids.length}
  gt.scrollLeft=i*gt.clientWidth;upd();gt.addEventListener('scroll',upd,{passive:true});drag(gt);
  qa('.st',lb).forEach(function(b){b.addEventListener('click',function(){var j=Math.round(gt.scrollLeft/gt.clientWidth)+(b.classList.contains('p')?1:-1);j=(j+ids.length)%ids.length;gt.scrollTo({left:j*gt.clientWidth,behavior:'smooth'})})});
  q('.x',lb).addEventListener('click',lbZamknij);q('.x',lb).focus();
  lb.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowLeft'){var b=q(e.key==='ArrowRight'?'.st.p':'.st.l',lb);if(b)b.click()}});
}
function lbZamknij(){if(!lb)return;lb.remove();lb=null;document.body.style.overflow='';if(lbPrev&&lbPrev.focus)lbPrev.focus()}

/* ---------- widoki ---------- */
function okr(arr){return '<nav class="okr" aria-label="Jesteś tutaj"><a href="#/">Strona główna</a>'+arr.map(function(a,i){return ' / '+(i===arr.length-1?'<span aria-current="page">'+esc(a[0])+'</span>':'<a href="'+a[1]+'">'+esc(a[0])+'</a>')}).join('')+'</nav>'}
function torHtml(id,lista){return '<div class="tor pr" id="'+id+'" data-tor>'+lista.map(karta).join('')+'</div>'}
function navHtml(id){return '<div class="nav" data-nav="'+id+'"><button type="button" data-k="-1" aria-label="Poprzednie">'+ico('l')+'</button><button type="button" data-k="1" aria-label="Następne">'+ico('p')+'</button></div>'}
function dostawaHtml(){return '<section class="sek ciem" aria-labelledby="h-dst"><div class="w"><div class="gl"><div><h2 id="h-dst">Dostawa i płatność</h2><p>Wszystkie paczki są ubezpieczone do wartości zawartości.</p></div></div><div class="dst">'+
  '<div><h3>Wysyłka</h3><p>Zamówienia złożone do 13:00 wysyłamy jeszcze tego samego dnia (towar z opisem „wysyłka 24h”). Kurier GLS i Paczkomaty InPost dostarczają zwykle w 24 godziny.</p></div>'+
  '<div><h3>Koszt dostawy</h3><ul><li>Paczkomaty InPost <b>15 zł</b></li><li>Kurier GLS, przedpłata <b>15 zł</b></li><li>Kurier GLS, za pobraniem <b>19 zł</b></li><li>Zamówienia od 100 zł <b>0 zł</b></li></ul></div>'+
  '<div><h3>Płatność</h3><p>Szybki przelew i BLIK przez Przelewy24 lub paynow, PayU z opcją „Płacę później” albo za pobraniem u kuriera. Wysyłka do krajów UE - po indywidualnej wycenie.</p></div>'+
  '<div><h3>Zamów przez telefon</h3><p>Złóż zamówienie telefonicznie i odbierz przesyłkę za pobraniem.</p><a class="duzy" href="tel:+48880781801">880 781 801</a></div></div></div></section>'}
function sklepyHtml(){return '<section class="sek" aria-labelledby="h-skl"><div class="w skl"><div class="fo"><img src="img/sklep-700.webp" srcset="img/sklep-700.webp 700w, img/sklep-800.webp 800w" sizes="(min-width:1000px) 46vw, 100vw" width="800" height="531" alt="Łóżko z szarym kocem wełnianym" loading="lazy"></div><div class="tx"><h2 id="h-skl">Sklep w Krośnie i sprzedaż hurtowa</h2><p>Zapraszamy klientów indywidualnych i hurtowych - mamy też tekstylia do wyposażenia hoteli i pensjonatów. Ten sam asortyment znajdziesz w sklepie Hurtowni ADAMAR - oba sklepy działają na wspólnym katalogu.</p><div class="adr"><div><b>Sklep stacjonarny</b><span>ul. Legionów b/n, 38-400 Krosno</span></div><div><b>CENTRUMHANDLOWE.NET</b><span>F.H.U. DANPOL mgr Daniel Podkul, ul. Łąkowa 17, 38-400 Krosno</span><span><a href="tel:+48880781801">880 781 801</a> · kontakt@centrumhandlowe.net</span></div><div><b>Hurtownia ADAMAR - adamar.eu</b><span>ul. Chopina 110a, 38-400 Krosno</span><span><a href="tel:+48880297756">880 297 756</a> · sklep@adamar.eu</span></div></div></div></div></section>'}

function wybrane(lista){var out=[];lista.forEach(function(x){var f=FAM[x[0]];if(!f)return;var w=f.war.filter(function(w){return !x[1]||w.a===x[1]})[0]||f.war[0];
  var e=elementy([f],x[1]?{roz:[rozK(x[1])]}:{});if(f.typ==='wzor'||f.typ==='kolor'){e=elementy([f],{}).filter(function(z){return z.w.pid===w.pid})}if(e[0])out.push(e[0])});return out}

function vStart(){
  document.title='Kołdry, poduszki, koce i pościel od polskich producentów | CENTRUMHANDLOWE.NET (demo)';
  var rodz=[['letnia','Letnie','cienkie, na ciepłe noce'],['całoroczna','Całoroczne','najczęściej wybierane'],['zimowa','Zimowe','MAXXX i dwuwarstwowe TERMO'],['4 pory roku','Cztery pory roku','dwie kołdry spinane']];
  var rozm=['135/140x200','155/160x200','180x200','220x200'];
  var pol=wybrane([['happy-caloroczna','155x200'],['classic-caloroczna','155x200'],['p-happy','70x80'],['k-happy','135x200'],['p-blommenslyst','70x80'],['bamboo','155x200'],['medical-amw','160x200'],['p-orto-aloe'],['anti-stress','220x200'],['jersey']]);
  var koce=elementy([FAM.bukle,FAM.camel,FAM.alpaka,FAM['merynos-krata']].filter(Boolean)).slice(0,10);
  V.innerHTML='<section class="hero" aria-labelledby="h1"><picture><source media="(max-width:760px)" srcset="img/hero-m-480.webp 480w, img/hero-m-720.webp 720w" sizes="100vw"><img src="img/hero-1600.webp" srcset="img/hero-1024.webp 1024w, img/hero-1600.webp 1345w" sizes="100vw" width="1345" height="895" alt="Pikowanie kołdry TENCEL z bliska" fetchpriority="high"></picture><div class="w"><div class="rama"><h1 id="h1">Kołdry, poduszki i koce <span>prosto od polskich producentów</span></h1><p class="lead">Sklep z pościelą z Krosna. Zamówienia złożone do 13:00 (towar z opisem „wysyłka 24h”) wysyłamy tego samego dnia, a od 100 zł dostawa jest darmowa.</p></div>'+
   '<form class="szuk" role="search" id="hs"><label class="sr" for="q3">Szukaj w sklepie</label><input id="q3" type="search" placeholder="np. kołdra 155x200" autocomplete="off"><button type="submit" aria-label="Szukaj">'+ico('sz')+'<span aria-hidden="true">Szukaj</span></button></form>'+
   '<div class="dalej"><a class="btn nb" href="#/k/koldry">Zobacz kołdry <i class="ar" aria-hidden="true"></i></a><a class="tz" href="tel:+48880781801"><small>Wolisz zamówić telefonicznie?</small>880 781 801</a></div></div></section>'+
   '<section class="sek" aria-labelledby="h-kat"><div class="w"><div class="gl"><div><h2 id="h-kat">Kategorie</h2><p>Kołdry i poduszki w każdym rozmiarze, komplety, pościel, prześcieradła i koce.</p></div>'+navHtml('t-kat')+'</div><div class="tor kat" id="t-kat" data-tor>'+
   KATS.map(function(k){return '<a class="kt" href="#/k/'+k.id+'" draggable="false"><span class="fo'+(k.cut?' cut':'')+'"><img src="'+k.img+'" width="360" height="270" alt="" loading="lazy" draggable="false"></span><span class="nz">'+esc(k.n)+'<i class="ar" aria-hidden="true"></i></span><small>'+esc(k.s)+'</small></a>'}).join('')+'</div></div></section>'+
   '<section class="sek g" aria-labelledby="h-dob"><div class="w"><div class="gl"><div><h2 id="h-dob">Kołdra na każdą porę roku</h2><p>Wybierz grubość i rozmiar - pokażemy tylko pasujące kołdry.</p></div></div><div class="dob">'+
   rodz.map(function(r){return '<div class="rz"><h3>'+r[1]+' <small>'+r[2]+'</small></h3><div class="rm">'+rozm.map(function(z){return '<a href="#/k/koldry?rodz='+encodeURIComponent(r[0])+'&roz='+encodeURIComponent(z)+'">'+z+'</a>'}).join('')+'</div></div>'}).join('')+
   '<div class="rz"><h3>Dla dzieci <small>komplety kołdra + poduszka</small></h3><div class="rm"><a href="#/k/komplety?roz=90x120">90x120</a><a href="#/k/komplety?roz=100x135">100x135</a></div></div></div></div></section>'+
   '<section class="sek" aria-labelledby="h-pr"><div class="w"><div class="gl"><div><h2 id="h-pr">Polecane kołdry i poduszki</h2><p>Ceny ze sklepu centrumhandlowe.net z 18.11.2026.</p></div>'+navHtml('t-pr')+'</div>'+torHtml('t-pr',pol)+'</div></section>'+
   '<section class="sek g" aria-labelledby="h-kc"><div class="w"><div class="gl"><div><h2 id="h-kc">Koce wełniane</h2><p>Merynos BUKLE w jedenastu kolorach, CAMEL i ALPAKA z kolekcji Prestige.</p></div>'+navHtml('t-kc')+'</div>'+torHtml('t-kc',koce)+'</div></section>'+
   dostawaHtml()+sklepyHtml();
  var hs=q('#hs');hs.addEventListener('submit',function(e){e.preventDefault();var v=q('input',hs).value.trim();if(v)location.hash='#/szukaj?q='+encodeURIComponent(v)});
  initKarty(V);
}

function filtryZ(p){var g=function(k){var v=p.get(k);return v?v.split(','):null};return{rodz:g('rodz'),roz:g('roz'),prod:g('prod'),w24:p.get('w24')==='1',cmin:p.get('cmin')?+p.get('cmin'):null,cmax:p.get('cmax')?+p.get('cmax'):null,sort:p.get('sort')||''}}
function filtryDo(fl){var p=new URLSearchParams();['rodz','roz','prod'].forEach(function(k){if(fl[k]&&fl[k].length)p.set(k,fl[k].join(','))});if(fl.w24)p.set('w24','1');if(fl.cmin!=null)p.set('cmin',fl.cmin);if(fl.cmax!=null)p.set('cmax',fl.cmax);if(fl.sort)p.set('sort',fl.sort);var s=p.toString();return s?'?'+s:''}
function sortuj(l,s){
  if(s==='cena-r')l.sort(function(a,b){return a.cena-b.cena});
  else if(s==='cena-m')l.sort(function(a,b){return b.cena-a.cena});
  else if(s==='nazwa')l.sort(function(a,b){return a.t.localeCompare(b.t,'pl')});
  return l;
}
function vKategoria(id,p){
  var k=KN[id];if(!k){vBrak();return}
  document.title=k.n+' | CENTRUMHANDLOWE.NET (demo)';
  var fams=id==='w24'?KAT:KAT.filter(function(f){return f.kat===id});
  var fl=filtryZ(p);
  V.innerHTML='<div class="w">'+okr([[k.n]])+'<div class="kg"><div class="rama"><h1>'+esc(k.n)+'</h1><p>'+esc(k.o)+'</p></div></div><div class="uk"><aside class="fil" id="fil" aria-label="Filtry"></aside><div><div class="pasek"><button class="bfil" type="button" id="bfil">Filtry <em id="fn" hidden></em></button><span class="ile-p" id="ilep" aria-live="polite"></span><label class="sr" for="sort">Sortuj</label><select id="sort"><option value="">Polecane</option><option value="cena-r">Cena: od najniższej</option><option value="cena-m">Cena: od najwyższej</option><option value="nazwa">Nazwa A-Z</option></select></div><div class="akt" id="akt"></div><div class="siatka" id="siatka"></div></div></div></div>';
  var fil=q('#fil'),bfil=q('#bfil');
  var wszystkie=elementy(fams,id==='w24'?{w24:true}:{});
  var opRodz=[],opRoz={},opProd={};
  wszystkie.forEach(function(e){if(e.f.rodz&&opRodz.indexOf(e.f.rodz)<0)opRodz.push(e.f.rodz);e.sz.forEach(function(s){if(s)opRoz[s]=(opRoz[s]||0)+1});if(e.f.prod)opProd[e.f.prod]=(opProd[e.f.prod]||0)+1});
  var rozL=Object.keys(opRoz).sort(function(a,b){return rozNum(a)-rozNum(b)});
  function grupa(t,klucz,opcje,lic){if(opcje.length<2&&!(fl[klucz]&&fl[klucz].length))return '';return '<div class="fgr"><h3>'+t+'</h3>'+opcje.map(function(o){return '<label><input type="checkbox" data-f="'+klucz+'" value="'+esc(o)+'"'+(fl[klucz]&&fl[klucz].indexOf(o)>-1?' checked':'')+'>'+esc(o.charAt(0).toUpperCase()+o.slice(1))+(lic&&lic[o]?'<small>'+lic[o]+'</small>':'')+'</label>'}).join('')+'</div>'}
  function rysujFil(){
    fil.innerHTML='<h2>Filtry<button class="x" type="button" id="fx" aria-label="Zamknij filtry">'+ico('l')+'</button></h2>'+grupa('Rodzaj kołdry','rodz',opRodz)+grupa('Rozmiar','roz',rozL,opRoz)+grupa('Producent','prod',Object.keys(opProd).sort(),opProd)+
     (id!=='w24'?'<div class="fgr"><h3>Dostępność</h3><label><input type="checkbox" data-f="w24"'+(fl.w24?' checked':'')+'>Tylko „wysyłka 24h”</label></div>':'')+
     '<div class="fgr"><h3>Cena</h3><div class="ceny"><label class="sr" for="cmin">Cena od</label><input id="cmin" type="number" inputmode="numeric" min="0" placeholder="od" value="'+(fl.cmin!=null?fl.cmin:'')+'"><span>-</span><label class="sr" for="cmax">Cena do</label><input id="cmax" type="number" inputmode="numeric" min="0" placeholder="do" value="'+(fl.cmax!=null?fl.cmax:'')+'"><span>zł</span></div></div>'+
     '<div class="zam"><button class="btn nb" type="button" id="fpok">Pokaż produkty</button></div>';
    q('#fx',fil).addEventListener('click',function(){fil.classList.remove('on');document.body.style.overflow=''});
    q('#fpok',fil).addEventListener('click',function(){fil.classList.remove('on');document.body.style.overflow='';window.scrollTo({top:q('.pasek').getBoundingClientRect().top+scrollY-120})});
    qa('input[type=checkbox]',fil).forEach(function(c){c.addEventListener('change',function(){var kk=c.dataset.f;if(kk==='w24')fl.w24=c.checked;else{var a=fl[kk]||[];if(c.checked)a.push(c.value);else a=a.filter(function(x){return x!==c.value});fl[kk]=a.length?a:null}lista()})});
    qa('.ceny input',fil).forEach(function(c){c.addEventListener('change',function(){var v=c.value===''?null:Math.max(0,+c.value);fl[c.id]=v;lista()})});
  }
  function lista(){
    var l=elementy(fams,{roz:fl.roz,w24:fl.w24||id==='w24'}).filter(function(e){return (!fl.rodz||fl.rodz.indexOf(e.f.rodz)>-1)&&(!fl.prod||fl.prod.indexOf(e.f.prod)>-1)&&(fl.cmin==null||e.cena>=fl.cmin)&&(fl.cmax==null||e.cena<=fl.cmax)});
    sortuj(l,fl.sort);
    q('#siatka').innerHTML=l.length?l.map(karta).join(''):'';
    if(!l.length)q('#siatka').innerHTML='<div class="pusto" style="grid-column:1/-1"><h3>Brak produktów dla wybranych filtrów</h3><p>Zmień albo usuń część filtrów.</p><button class="btn" type="button" id="wyczysc">Wyczyść filtry</button></div>';
    q('#ilep').textContent=l.length+' '+(l.length===1?'produkt':(l.length%10>=2&&l.length%10<=4&&(l.length%100<10||l.length%100>=20)?'produkty':'produktów'));
    var akt=[];['rodz','roz','prod'].forEach(function(kk){(fl[kk]||[]).forEach(function(v){akt.push([kk,v,v])})});if(fl.w24&&id!=='w24')akt.push(['w24','1','wysyłka 24h']);if(fl.cmin!=null)akt.push(['cmin','','od '+fl.cmin+' zł']);if(fl.cmax!=null)akt.push(['cmax','','do '+fl.cmax+' zł']);
    q('#akt').innerHTML=akt.map(function(a){return '<button type="button" data-u="'+a[0]+'" data-v="'+esc(a[1])+'" aria-label="Usuń filtr '+esc(a[2])+'">'+esc(a[2])+'</button>'}).join('')+(akt.length>1?'<button class="czysc" type="button" data-u="*">Wyczyść wszystkie</button>':'');
    var fn=q('#fn');fn.hidden=!akt.length;fn.textContent=akt.length;
    q('#sort').value=fl.sort;
    history.replaceState(null,'','#/k/'+id+filtryDo(fl));
    initKarty(q('#siatka'));
  }
  function wyczysc(){fl={sort:fl.sort};rysujFil();lista()}
  q('#akt').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var u=b.dataset.u;if(u==='*'){wyczysc();return}if(u==='w24')fl.w24=false;else if(u==='cmin'||u==='cmax')fl[u]=null;else{fl[u]=(fl[u]||[]).filter(function(x){return x!==b.dataset.v});if(!fl[u].length)fl[u]=null}rysujFil();lista()});
  V.addEventListener('click',function h(e){if(e.target.id==='wyczysc')wyczysc()});
  q('#sort').addEventListener('change',function(){fl.sort=this.value;lista()});
  bfil.addEventListener('click',function(){fil.classList.add('on');document.body.style.overflow='hidden';var x=q('#fx');if(x)x.focus()});
  rysujFil();lista();
}

function vSzukaj(p){
  var qs=p.get('q')||'';document.title='Szukaj: '+qs+' | CENTRUMHANDLOWE.NET (demo)';
  var l=szukaj(qs);
  qa('[data-szuk] input').forEach(function(i){i.value=qs});
  V.innerHTML='<div class="w">'+okr([['Wyniki wyszukiwania']])+'<div class="kg"><div class="rama"><h1>„'+esc(qs)+'”</h1><p>'+(l.length?'Znaleźliśmy '+l.length+' '+(l.length===1?'produkt':(l.length%10>=2&&l.length%10<=4&&(l.length%100<10||l.length%100>=20)?'produkty':'produktów'))+'.':'Nie znaleźliśmy produktów pasujących do zapytania.')+'</p></div></div><div style="padding:22px 0 70px">'+
   (l.length?'<div class="siatka">'+l.map(karta).join('')+'</div>':'<div class="pusto"><h3>Spróbuj innego słowa</h3><p>Na przykład: kołdra letnia, poduszka 70x80, koc wełniany, prześcieradło jersey.</p><a class="btn" href="#/k/koldry">Zobacz wszystkie kołdry</a></div>')+'</div></div>';
  initKarty(V);
}

function vProdukt(pid,p){
  var sl=pid;pid=(String(pid).match(/^\d+/)||[''])[0];
  var x=PID[pid];if(!x){vBrak();return}
  var f=x.f,w=x.w,k=KN[f.kat];
  var r=p.get('r');var c=null;if(w.combos){c=0;if(r!=null&&w.combos[+r])c=+r;else w.combos.forEach(function(o,i){if(new RegExp('-'+o.a+'$').test(sl||''))c=i})}
  document.title=nazwaW(f,w,c)+' | CENTRUMHANDLOWE.NET (demo)';
  var gal=(f.typ==='kolor'||f.typ==='wzor')?((w.g&&w.g.length?w.g:[w.img])):(f.gal&&f.gal.length?f.gal:[w.img]);
  if(f.typ==='rozmiar'||f.typ==='komplet'){if(gal.indexOf(w.img)<0)gal=[w.img].concat(gal)}
  gal=gal.slice(0,8);
  var tytul=nazwaW(f,w,c);
  var kan=location.href.split('#')[0]+purl(w.pid,c);
  if(location.hash!==purl(w.pid,c))history.replaceState(null,'',purl(w.pid,c));
  canon('https://centrumhandlowe.net'+w.u,tytul);
  var cena=cenaW(w,c),pro=w.stara&&w.stara>cena;
  var warianty='';
  if(f.typ==='rozmiar'&&f.war.length>1){
    warianty='<div class="wgr"><h2>Rozmiar: <span>'+esc(w.a)+'</span></h2><div class="opc" role="group" aria-label="Rozmiar">'+f.war.map(function(v){return '<button type="button" data-pid="'+v.pid+'" aria-pressed="'+(v===w)+'"'+(v===w?' class="on"':'')+'>'+esc(v.a)+'<small>'+zl(v.cena)+'</small></button>'}).join('')+'</div></div>';
  }else if(f.typ==='komplet'){
    var as=[],bs=[];f.war.forEach(function(v){if(as.indexOf(v.a)<0)as.push(v.a);if(bs.indexOf(v.b)<0)bs.push(v.b)});
    as.sort(function(a,b){return rozNum(a)-rozNum(b)});bs.sort(function(a,b){return (a.charAt(0)-b.charAt(0))||rozNum(a.slice(3))-rozNum(b.slice(3))});
    var jest=function(a,b){return f.war.filter(function(v){return v.a===a&&v.b===b})[0]};
    warianty='<div class="wgr"><h2>Rozmiar kołdry: <span>'+esc(w.a)+'</span></h2><div class="opc" role="group" aria-label="Rozmiar kołdry">'+as.map(function(a){var v=jest(a,w.b)||f.war.filter(function(z){return z.a===a})[0];return '<button type="button" data-pid="'+v.pid+'" aria-pressed="'+(a===w.a)+'"'+(a===w.a?' class="on"':'')+'>'+esc(a)+'</button>'}).join('')+'</div></div>'+
     (bs.length>1?'<div class="wgr"><h2>Poduszki: <span>'+esc(w.b)+'</span></h2><div class="opc" role="group" aria-label="Poduszki">'+bs.map(function(b){var v=jest(w.a,b);return v?'<button type="button" data-pid="'+v.pid+'" aria-pressed="'+(b===w.b)+'"'+(b===w.b?' class="on"':'')+'>'+esc(b.replace('x ','× '))+'<small>'+zl(v.cena)+'</small></button>':'<button type="button" class="nie" disabled title="Niedostępne dla kołdry '+esc(w.a)+'">'+esc(b.replace('x ','× '))+'</button>'}).join('')+'</div></div>':'');
  }else if(f.war.length>1){
    warianty='<div class="wgr"><h2>'+(f.typ==='kolor'?'Kolor':'Wzór')+': <span>'+esc(w.a)+'</span></h2><div class="opc ob" role="group" aria-label="'+(f.typ==='kolor'?'Kolor':'Wzór')+'">'+f.war.map(function(v){return '<button type="button" data-pid="'+v.pid+'" aria-pressed="'+(v===w)+'"'+(v===w?' class="on"':'')+' title="'+esc(v.a)+'"><img src="'+im(v.img)+'" alt="'+esc(v.a)+'" width="60" height="60" loading="lazy"></button>'}).join('')+'</div></div>';
  }
  if(w.combos){warianty+='<div class="wgr"><h2>Rozmiar materaca: <span>'+esc(w.combos[c].a)+'</span></h2><div class="opc" role="group" aria-label="Rozmiar materaca">'+w.combos.map(function(o,i){return '<button type="button" data-r="'+i+'" aria-pressed="'+(i===c)+'"'+(i===c?' class="on"':'')+'>'+esc(o.a)+'<small>'+zl(w.cena+o.dp)+'</small></button>'}).join('')+'</div></div>'}
  var opis=(f.opis||[]).map(function(l){return '<p>'+esc(l)+'</p>'}).join('');
  var par=(f.par||[]).length?'<table class="par"><tbody>'+(f.typ==='rozmiar'||f.typ==='komplet'?'<tr><th>Wybrany wariant</th><td>'+esc(wariantTxt(f,w,c).replace(/^[^:]+: /,''))+'</td></tr>':'')+f.par.map(function(r){return '<tr><th>'+esc(r[0].replace(/:$/,''))+'</th><td>'+esc(r[1])+'</td></tr>'}).join('')+'</tbody></table>':'';
  var kr=(f.krotki||[]).filter(function(l){return !/^(Kupujesz:|Rozmiar:|Producent:)/.test(l)}).slice(0,5);
  var podobne=elementy(KAT.filter(function(z){return z.kat===f.kat&&z!==f})).slice(0,10);
  if(podobne.length<4)podobne=podobne.concat(elementy(KAT.filter(function(z){return z.kat!==f.kat&&(z.kat==='koldry'||z.kat==='poduszki')})).slice(0,8));
  V.innerHTML='<div class="w">'+okr([[k.n,'#/k/'+k.id],[tytul]])+'<div class="kp"><div class="gal" id="gal"><div class="gt" id="gt">'+gal.map(function(id,i){return '<button type="button" data-i="'+i+'" aria-label="Powiększ zdjęcie '+(i+1)+'"><img src="'+im(id,800)+'" srcset="'+im(id)+' 400w, '+im(id,800)+' 800w" sizes="(min-width:1000px) 52vw, 100vw" width="800" height="800" alt="'+esc(tytul)+(i?' - zdjęcie '+(i+1):'')+'"'+(i?' loading="lazy"':' fetchpriority="high"')+' draggable="false"></button>'}).join('')+'</div>'+
   (gal.length>1?'<span class="lic" id="lic">1 / '+gal.length+'</span><button class="st l" type="button" aria-label="Poprzednie zdjęcie">'+ico('l')+'</button><button class="st p" type="button" aria-label="Następne zdjęcie">'+ico('p')+'</button><div class="min" id="min">'+gal.map(function(id,i){return '<button type="button" data-i="'+i+'"'+(i?'':' class="on"')+' aria-label="Zdjęcie '+(i+1)+'"><img src="'+im(id)+'" alt="" width="84" height="84" loading="lazy"></button>'}).join('')+'</div>':'')+'</div>'+
   '<div class="inf">'+(f.prod?'<a class="pd" href="#/k/'+f.kat+'?prod='+encodeURIComponent(f.prod)+'">'+esc(f.prod)+'</a>':'')+'<h1>'+esc(tytul)+'</h1><p class="ref" title="centrumhandlowe.net'+esc(w.u)+'">Adres produktu: <span class="adr-u">centrumhandlowe.net'+esc(w.u)+'</span></p>'+
   '<div class="cena'+(pro?' pro':'')+'" aria-live="polite"><b>'+zl(cena)+'</b>'+(pro?'<s>'+zl(w.stara)+'</s>':'')+'<small>Cena brutto (z VAT)</small></div>'+
   warianty+
   '<div class="kup"><div class="il"><button type="button" data-m="-1" aria-label="Mniej">−</button><input id="ilosc" type="number" min="1" max="99" value="1" aria-label="Ilość" inputmode="numeric"><button type="button" data-m="1" aria-label="Więcej">+</button></div><button class="btn nb" type="button" id="dodaj">Dodaj do koszyka <i class="ar" aria-hidden="true"></i></button></div>'+
   '<ul class="atu">'+(w.w24?'<li><span><span class="ok">Wysyłka 24h</span> - zamów do 13:00, a paczka wyjdzie dziś</span></li>':'<li><span><b>Dostępny</b> - wysyłka po potwierdzeniu dostępności</span></li>')+'<li><span><b>Darmowa dostawa od 100 zł</b>, poniżej: InPost lub GLS 15 zł, pobranie 19 zł</span></li><li><span>BLIK, szybki przelew, PayU „Płacę później” albo za pobraniem</span></li><li><span>Pytania o produkt: <a href="tel:+48880781801"><b>880 781 801</b></a></span></li></ul>'+
   (kr.length?'<ul class="kr2">'+kr.map(function(l){return '<li>'+esc(l)+'</li>'}).join('')+'</ul>':'')+
   '</div></div></div>'+
   '<section class="opw" aria-label="Opis i parametry"><div class="w">'+
   '<div class="zak">'+(opis?'<details open><summary>Opis produktu</summary><div class="tx">'+opis+'</div></details>':'')+(par?'<details open><summary>Parametry</summary><div class="tx">'+par+'</div></details>':'')+'<details><summary>Dostawa i zwroty</summary><div class="tx"><p>Zamówienia złożone do 13:00 z oznaczeniem „wysyłka 24h” wysyłamy tego samego dnia. Paczkomaty InPost i kurier GLS 15 zł, za pobraniem 19 zł, od 100 zł dostawa gratis.</p><p>Towar kupiony przez internet możesz zwrócić w ciągu 14 dni od odbioru - zasady opisuje regulamin sklepu.</p></div></details></div>'+
   '</div></section>'+
   '<section class="sek g" aria-labelledby="h-pod"><div class="w"><div class="gl"><div><h2 id="h-pod">Zobacz też</h2></div>'+navHtml('t-pod')+'</div>'+torHtml('t-pod',podobne)+'</div></section>';
  // galeria
  var gt=q('#gt');
  if(gt){drag(gt);var lic=q('#lic'),mins=qa('#min button');
    var akt=function(){return Math.round(gt.scrollLeft/gt.clientWidth)};
    gt.addEventListener('scroll',function(){var i=akt();if(lic)lic.textContent=(i+1)+' / '+gal.length;mins.forEach(function(m,j){m.classList.toggle('on',i===j)})},{passive:true});
    mins.forEach(function(m){m.addEventListener('click',function(){gt.scrollTo({left:+m.dataset.i*gt.clientWidth,behavior:'smooth'})})});
    qa('#gal .st').forEach(function(b){b.addEventListener('click',function(){var i=(akt()+(b.classList.contains('p')?1:-1)+gal.length)%gal.length;gt.scrollTo({left:i*gt.clientWidth,behavior:'smooth'})})});
    qa('button',gt).forEach(function(b){b.addEventListener('click',function(){lbOtworz(gal,+b.dataset.i,tytul)})});
  }
  qa('.opc [data-pid]').forEach(function(b){b.addEventListener('click',function(){if(b.dataset.pid===w.pid)return;var y=scrollY;history.pushState(null,'',purl(b.dataset.pid,PID[b.dataset.pid].w.combos&&c!=null?c:null));trasa(true);window.scrollTo(0,y);var nb=q('.opc [data-pid="'+b.dataset.pid+'"]');if(nb)nb.focus({preventScroll:true})})});
  qa('.opc [data-r]').forEach(function(b){b.addEventListener('click',function(){var y=scrollY;history.pushState(null,'',purl(w.pid,+b.dataset.r));trasa(true);window.scrollTo(0,y);var nb=q('.opc [data-r="'+b.dataset.r+'"]');if(nb)nb.focus({preventScroll:true})})});
  var il=q('#ilosc');
  qa('.kup .il button').forEach(function(b){b.addEventListener('click',function(){il.value=Math.max(1,Math.min(99,(+il.value||1)+(+b.dataset.m)))})});
  il.addEventListener('change',function(){il.value=Math.max(1,Math.min(99,Math.round(+il.value)||1))});
  q('#dodaj').addEventListener('click',function(){kDodaj(w.pid,c,Math.max(1,Math.min(99,Math.round(+il.value)||1)))});
  initKarty(V);
}

function vKoszyk(){
  document.title='Koszyk | CENTRUMHANDLOWE.NET (demo)';
  if(!kosz.length){V.innerHTML='<div class="w">'+okr([['Koszyk']])+'<div class="ko" style="display:block"><h1>Koszyk</h1><div class="pusto" style="margin-top:20px"><h3>Twój koszyk jest pusty</h3><p>Dodaj produkty z kategorii albo skorzystaj z wyszukiwarki.</p><a class="btn nb" href="#/k/koldry">Zobacz kołdry <i class="ar" aria-hidden="true"></i></a></div></div></div>';return}
  var s=kSuma();
  V.innerHTML='<div class="w">'+okr([['Koszyk']])+'<div class="kroki" aria-label="Etapy zamówienia"><span class="on">1. Koszyk</span><span>2. Dane i dostawa</span><span>3. Płatność</span></div><div class="ko"><div><h1>Koszyk <span style="color:var(--mut);font-size:.55em;font-weight:600">('+kIle()+' szt.)</span></h1><div class="lst" id="lst">'+kosz.map(function(l){return linia(l,true)}).join('')+'</div><a class="wroc" href="#/k/koldry">Kontynuuj zakupy</a></div>'+
   '<aside class="pod-s" aria-labelledby="h-ps"><h2 id="h-ps">Podsumowanie</h2><div class="wier"><span>Wartość produktów</span><b>'+zl(s)+'</b></div><div class="wier"><span>Dostawa</span><b>'+(s>=DARMO?'0,00 zł':'od 15,00 zł')+'</b></div>'+progHtml(s)+'<div class="wier suma"><span>Razem</span><b>'+zl(s>=DARMO?s:s+15)+'</b></div><a class="btn nb" href="#/zamowienie">Przejdź do zamówienia <i class="ar" aria-hidden="true"></i></a><p class="mal">Koszt dostawy wybierzesz w kolejnym kroku. W tym demo zamówienie nie zostanie złożone.</p></aside></div></div>';
  var lst=q('#lst');
  lst.addEventListener('click',function(e){var ln=e.target.closest('.lin');if(!ln)return;var k=ln.dataset.k;
    if(e.target.closest('.us')){kUsun(k);vKoszyk();return}
    var b=e.target.closest('[data-m]');if(b){var l=kosz.filter(function(x){return x.k===k})[0];kZmien(k,l.q+(+b.dataset.m));vKoszyk();var n=q('.lin[data-k="'+CSS.escape(k)+'"] [data-m="'+b.dataset.m+'"]');if(n)n.focus()}});
  lst.addEventListener('change',function(e){var ln=e.target.closest('.lin');if(ln&&e.target.matches('input')){kZmien(ln.dataset.k,Math.round(+e.target.value)||1);vKoszyk()}});
}

var DOST=[{id:'inpost',n:'Paczkomaty InPost',d:'Odbiór w wybranym paczkomacie, zwykle w 24 godziny',c:15},{id:'gls',n:'Kurier GLS - przedpłata',d:'Dostawa pod wskazany adres',c:15},{id:'glsp',n:'Kurier GLS - za pobraniem',d:'Płacisz kurierowi przy odbiorze',c:19}];
var PLAT=[{id:'p24',n:'Przelewy24',d:'BLIK, szybki przelew, karta płatnicza'},{id:'paynow',n:'paynow',d:'BLIK i szybki przelew (mBank)'},{id:'payu',n:'PayU',d:'także „Płacę później” - zapłać do 30 dni'},{id:'pob',n:'Płatność przy odbiorze',d:'tylko z dostawą kurierem GLS za pobraniem'}];
var ostatnie=null;
function vZamowienie(){
  document.title='Zamówienie (demo) | CENTRUMHANDLOWE.NET';
  if(!kosz.length){location.replace('#/koszyk');return}
  var st={d:'inpost',p:'p24'};
  function pole(id,t,typ,kl,extra){return '<div class="pole '+(kl||'')+'"><label for="'+id+'">'+t+'</label><input id="'+id+'" type="'+(typ||'text')+'" autocomplete="off" '+(extra||'')+'><span class="bl" id="'+id+'-b"></span></div>'}
  V.innerHTML='<div class="w">'+okr([['Koszyk','#/koszyk'],['Zamówienie']])+'<div class="kroki" aria-label="Etapy zamówienia"><span>1. Koszyk</span><span class="on">2. Dane i dostawa</span><span class="on">3. Płatność</span></div>'+
   '<div class="uwg" role="note"><span><b>To jest demo.</b> Formularz pokazuje wygląd zamówienia - wpisane dane nigdzie nie są wysyłane ani zapisywane, zamówienie nie zostanie złożone, a płatność nie zostanie pobrana. Można wpisać dowolne, przykładowe dane.</span></div>'+
   '<form class="ko" id="zf" novalidate><div><h1>Zamówienie</h1>'+
   '<fieldset class="fs"><legend><i>1</i>Dane do wysyłki</legend><div class="pola">'+pole('imie','Imię i nazwisko','text','',' required')+pole('email','E-mail','email','p1m',' required')+pole('tel','Telefon','tel','p1m',' required inputmode="tel"')+pole('ulica','Ulica i numer','text','',' required')+pole('kod','Kod pocztowy','text','p1',' required inputmode="numeric" placeholder="00-000" maxlength="6"')+pole('miasto','Miejscowość','text','p1',' required')+'</div>'+
   '<label class="chk"><input type="checkbox" id="fv">Chcę fakturę na firmę</label><div class="pola" id="fvp" hidden>'+pole('firma','Nazwa firmy')+pole('nip','NIP','text','',' inputmode="numeric"')+'</div></fieldset>'+
   '<fieldset class="fs"><legend><i>2</i>Dostawa</legend><div class="opt" id="od"></div><div class="pacz" id="pacz">W docelowym sklepie w tym miejscu otworzy się mapa paczkomatów InPost do wyboru punktu odbioru.</div></fieldset>'+
   '<fieldset class="fs"><legend><i>3</i>Płatność</legend><div class="opt" id="op"></div></fieldset>'+
   '<label class="chk" id="regl"><input type="checkbox" id="reg" required>Akceptuję regulamin sklepu i politykę prywatności (w demo bez znaczenia prawnego)</label></div>'+
   '<aside class="pod-s" aria-labelledby="h-zp"><h2 id="h-zp">Twoje zamówienie</h2><div class="mini">'+kosz.map(function(l){var x=PID[l.pid];return '<div><img src="'+im(x.w.img)+'" alt="" width="52" height="52" loading="lazy"><span>'+esc(x.f.nazwa)+'<br><span style="color:var(--mut)">'+esc(wariantTxt(x.f,x.w,l.c))+' · '+l.q+' szt.</span></span><b>'+zl(cenaW(x.w,l.c)*l.q)+'</b></div>'}).join('')+'</div><a class="wroc" href="#/koszyk" style="font-size:15px">Zmień koszyk</a><div id="zs"></div><button class="btn nb" type="submit">Zamawiam i płacę (demo) <i class="ar" aria-hidden="true"></i></button><p class="mal">Po kliknięciu nic nie zostanie wysłane - zobaczysz ekran, jaki klient widzi po złożeniu zamówienia.</p></aside></form></div>';
  var zf=q('#zf');
  function rysuj(){
    var s=kSuma(),d=DOST.filter(function(x){return x.id===st.d})[0],kd=s>=DARMO?0:d.c;
    if(st.d==='glsp')st.p='pob';else if(st.p==='pob')st.p='p24';
    q('#od').innerHTML=DOST.map(function(x){return '<label><input type="radio" name="dost" value="'+x.id+'"'+(x.id===st.d?' checked':'')+'><span><b>'+x.n+'</b><small>'+x.d+'</small></span><em>'+(s>=DARMO?'0 zł':x.c+' zł')+'</em></label>'}).join('');
    q('#op').innerHTML=PLAT.map(function(x){var wyl=(x.id==='pob')!==(st.d==='glsp');return '<label'+(wyl?' class="wyl"':'')+'><input type="radio" name="plat" value="'+x.id+'"'+(x.id===st.p?' checked':'')+(wyl?' disabled':'')+'><span><b>'+x.n+'</b><small>'+x.d+'</small></span><em></em></label>'}).join('');
    q('#pacz').hidden=st.d!=='inpost';
    q('#zs').innerHTML='<div class="wier"><span>Produkty</span><b>'+zl(s)+'</b></div><div class="wier"><span>Dostawa: '+d.n+'</span><b>'+zl(kd)+'</b></div>'+(s<DARMO?progHtml(s):'')+'<div class="wier suma"><span>Do zapłaty</span><b>'+zl(s+kd)+'</b></div>';
  }
  rysuj();
  zf.addEventListener('change',function(e){if(e.target.name==='dost'){st.d=e.target.value;rysuj()}else if(e.target.name==='plat'){st.p=e.target.value}else if(e.target.id==='fv'){q('#fvp').hidden=!e.target.checked}else if(e.target.id==='reg'){q('#regl').classList.toggle('blad',!e.target.checked)}});
  var kod=q('#kod');kod.addEventListener('input',function(){var v=kod.value.replace(/\D/g,'').slice(0,5);kod.value=v.length>2?v.slice(0,2)+'-'+v.slice(2):v});
  var RE={imie:[/\S+\s+\S+/,'Podaj imię i nazwisko'],email:[/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,'Podaj poprawny adres e-mail'],tel:[/^(\+?48)?\s*(\d[\s-]?){9}$/,'Podaj 9-cyfrowy numer telefonu'],ulica:[/\S{2,}/,'Podaj ulicę i numer'],kod:[/^\d{2}-\d{3}$/,'Format: 00-000'],miasto:[/\S{2,}/,'Podaj miejscowość']};
  function spr(id){var el=q('#'+id),ok=RE[id][0].test(el.value.trim());el.parentNode.classList.toggle('blad',!ok);q('#'+id+'-b').textContent=ok?'':RE[id][1];el.setAttribute('aria-invalid',!ok);if(!ok)el.setAttribute('aria-describedby',id+'-b');return ok}
  Object.keys(RE).forEach(function(id){q('#'+id).addEventListener('blur',function(){if(this.value)spr(id)})});
  zf.addEventListener('submit',function(e){
    e.preventDefault();var zle=Object.keys(RE).filter(function(id){return !spr(id)});
    var reg=q('#reg').checked;q('#regl').classList.toggle('blad',!reg);
    if(zle.length||!reg){var pierw=zle.length?q('#'+zle[0]):q('#reg');pierw.focus();pierw.scrollIntoView({block:'center',behavior:'smooth'});return}
    var s=kSuma(),d=DOST.filter(function(x){return x.id===st.d})[0],kd=s>=DARMO?0:d.c;
    ostatnie={ile:kIle(),s:s,kd:kd,d:d.n,p:PLAT.filter(function(x){return x.id===st.p})[0].n};
    zf.reset();kosz=[];kZapisz();location.hash='#/dziekujemy';
  });
}
function vDzieki(){
  document.title='Dziękujemy (demo) | CENTRUMHANDLOWE.NET';
  var o=ostatnie;
  V.innerHTML='<div class="w potw"><div class="rama"><h1>Dziękujemy - tak wygląda potwierdzenie zamówienia</h1></div><div class="uwg" role="note"><span><b>Demo:</b> zamówienie nie zostało złożone, nic nie zostało wysłane ani pobrane, a koszyk został wyczyszczony.</span></div>'+
   (o?'<div class="zn"><h2 style="font-size:26px">Podsumowanie</h2><ul style="list-style:none;padding:0"><li>Produkty: <b>'+o.ile+' szt.</b>, '+zl(o.s)+'</li><li>Dostawa: <b>'+esc(o.d)+'</b>, '+zl(o.kd)+'</li><li>Płatność: <b>'+esc(o.p)+'</b></li><li>Razem: <b>'+zl(o.s+o.kd)+'</b></li></ul></div>':'')+
   '<h2 style="font-size:clamp(24px,1.8vw,32px);margin-top:26px">Co dzieje się w docelowym sklepie</h2><ul><li>klient przechodzi do bramki płatności (Przelewy24, paynow, PayU) albo wybiera pobranie,</li><li>dostaje e-mail z potwierdzeniem i numerem zamówienia, a po wysyłce numer przesyłki,</li><li>zamówienie pojawia się w panelu sklepu ze statusem, danymi klienta i opcją wydruku etykiety,</li><li>klient z kontem widzi historię zamówień i może zamówić ponownie.</li></ul><p style="margin-top:26px"><a class="btn nb" href="#/">Wróć na stronę główną <i class="ar" aria-hidden="true"></i></a></p></div>';
}
function vTekst(t,h){document.title=t+' | CENTRUMHANDLOWE.NET (demo)';V.innerHTML='<div class="w">'+okr([[t]])+'<div class="kg"><div class="rama"><h1>'+esc(t)+'</h1></div></div><div class="tekst">'+h+'</div></div>'}
function vKonto(){vTekst('Moje konto','<p>W docelowym sklepie klient loguje się tutaj do swojego konta. Dotychczasowi klienci centrumhandlowe.net i adamar.eu logują się tymi samymi hasłami co dziś - konta przenosimy razem z hasłami.</p><h2>Co jest na koncie klienta</h2><ul><li>historia zamówień ze statusami i numerami przesyłek,</li><li>zapisane adresy dostawy i dane do faktury,</li><li>ponowne zamówienie jednym kliknięciem,</li><li>ulubione produkty.</li></ul><p style="margin-top:20px">W demo logowanie jest wyłączone - nie wpisuj tu żadnych danych.</p>')}
function vDostawa(){document.title='Dostawa i płatność | CENTRUMHANDLOWE.NET (demo)';V.innerHTML='<div class="w">'+okr([['Dostawa i płatność']])+'</div><div style="height:16px"></div>'+dostawaHtml()+sklepyHtml()}
function vInfo(){vTekst('Regulamin i informacje','<p>Regulamin sklepu, politykę prywatności, zasady reklamacji i zwrotów przeniesiemy do nowego sklepu z obecnego centrumhandlowe.net (osobno dla F.H.U. DANPOL i Hurtowni ADAMAR) i podepniemy w stopce oraz przy zamówieniu.</p>')}
function vBrak(){vTekst('Nie znaleziono strony','<p>Tej strony nie ma w demo. <a href="#/">Wróć na stronę główną</a>.</p>')}

function canon(u,t){var l=q('link[rel=canonical]');if(!l){l=document.createElement('link');l.rel='canonical';document.head.appendChild(l)}l.href=u;var m=q('meta[name=description]');if(m)m.content=t+' - cena, rozmiary, dostawa 24h. Sklep CENTRUMHANDLOWE.NET (demo).'}
/* ---------- router ---------- */
function trasa(zachowaj){
  var h=location.hash.replace(/^#/,'')||'/';var i=h.indexOf('?');var sciezka=i>-1?h.slice(0,i):h;var p=new URLSearchParams(i>-1?h.slice(i+1):'');
  var cz=sciezka.split('/').filter(Boolean);
  mkUkryj();lbZamknij();menuZamknij();
  qa('#menu a').forEach(function(a){var on=cz[0]==='k'&&a.dataset.kat===cz[1]||cz[0]==='p'&&PID[parseInt(cz[1])]&&a.dataset.kat===PID[parseInt(cz[1])].f.kat;a.classList.toggle('on',!!on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  if(!cz.length)vStart();
  else if(cz[0]==='k')vKategoria(cz[1],p);
  else if(cz[0]==='p')vProdukt(cz[1],p);
  else if(cz[0]==='szukaj')vSzukaj(p);
  else if(cz[0]==='koszyk')vKoszyk();
  else if(cz[0]==='zamowienie')vZamowienie();
  else if(cz[0]==='dziekujemy')vDzieki();
  else if(cz[0]==='konto')vKonto();
  else if(cz[0]==='dostawa')vDostawa();
  else if(cz[0]==='info')vInfo();
  else vBrak();
  if(!zachowaj){window.scrollTo(0,0);if(document.activeElement&&document.activeElement!==document.body&&!document.activeElement.closest('.top'))V.focus({preventScroll:true})}
}
window.addEventListener('hashchange',function(){trasa(false)});
window.addEventListener('popstate',function(){var y=scrollY;trasa(true);window.scrollTo(0,y)});
window.addEventListener('storage',function(e){if(e.key===KEY){kosz=(lsGet(KEY)||[]).filter(function(l){return PID[l.pid]});kOdswiez()}});
kOdswiez();trasa(true);
var r=q('#rok');if(r)r.textContent=new Date().getFullYear();
})();
