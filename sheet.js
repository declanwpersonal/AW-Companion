(function(){
var KEY='aw-chars-v1',LAST='aw-last-v1',A=['Brawn','Agility','Health','Smarts','Senses','Presence'];
var DIE=[0,4,6,8,12],FAT=['No effect','Disadvantage on ability rolls','Speed halved','Disadvantage on all rolls','HP max halved','No movement, Opportunity Actions, Surprise Actions or Interactions','Death'];
var $=function(s){return document.querySelector(s)},ok=true,db={},cur=null;
function load(){try{db=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){db={};ok=false}}
function put(){try{localStorage.setItem(KEY,JSON.stringify(db));$('#st').textContent='Saved'}catch(e){ok=false;$('#st').textContent='Not saved: storage blocked'}}
function mk(){var o={rb:'',theme:'fan',ab:[],id:'c'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),name:'',race:'',bg:'',concept:'',level:1,raceBonus:0,wounds:0,fatigue:0,hp:0,hpBonus:0,ar:0,pen:0,armName:'',speed:1,mpMax:0,mp:0,carried:0,weapons:'',traits:'',gear:'',money:'',notes:'',upd:Date.now()};A.forEach(function(a){o[a]=0});return o}
function eff(a){return Math.max(0,cur[a]-cur.wounds)}
function dn(r){return r?'d'+DIE[r]:'none'}
function hpMax(){var m=Math.max(0,cur.Health*5+(+cur.hpBonus||0));return (+cur.fatigue||0)>=4?Math.ceil(m/2):m}
var D=window.AWDATA||{races:[],bgs:[],armour:[],weapons:[],abil:[]},TN={fan:'Fantasy',mod:'Modern',sw:'Star Wars'},BY={};D.abil.forEach(function(a){BY[a.id]=a});
function inTh(a){var u=a.used||'';return u.indexOf('All Themes')>-1||u.indexOf(TN[cur.theme])>-1}
function sel(id,items,val,ph){return '<select id="'+id+'" data-p="'+id+'"><option value="">'+ph+'</option>'+items.map(function(x,i){return '<option value="'+i+'"'+(x.n===val?' selected':'')+'>'+esc(x.l||x.n)+'</option>'}).join('')+'</select>'}
var TK='aw-trash-v1';
function getT(){try{return JSON.parse(localStorage.getItem(TK)||'{}')||{}}catch(e){return{}}}
function setT(o){try{localStorage.setItem(TK,JSON.stringify(o))}catch(e){ok=false;var z=$('#st');if(z)z.textContent='Not saved: storage blocked'}}
function trashHtml(){var t=getT(),now=Date.now(),ids=Object.keys(t).filter(function(i){if(now-t[i].del>2592e6){delete t[i];return false}return true});setT(t);if(!ids.length)return'';
 return '<details><summary>Recently deleted ('+ids.length+')</summary><p class="meta">Removed for good after 30 days.</p>'+ids.map(function(i){var c=t[i];return '<div class="card"><span class="open" style="padding:10px 4px"><strong>'+esc(c.name||'Unnamed character')+'</strong><span class="meta">Level '+esc(c.level)+'</span></span><button data-rs="'+i+'">Restore</button><button class="del" data-df="'+i+'">Delete forever</button></div>'}).join('')+'</details>'}
function lvpHtml(){var p=cur.pend;if(!p)return'';var o=A.filter(function(a){return cur[a]<4}).map(function(a){return '<option>'+a+'</option>'}).join('');
  return '<section id="lvp"><h2>Level '+esc(cur.level)+'</h2>'+(p.a?'<p>1. Add 1 rank to an attribute.</p><div class="row"><select id="lsel">'+o+'</select><button class="pri" data-la="1">Add rank</button></div>':'<p>1. Rank added ✓</p>')+(p.t?'<p>2. Choose 1 new trait.</p><button class="pri" data-lt="1">Choose a trait</button>':'<p>2. Trait chosen ✓</p>')+'<div class="row"><button data-ld="1">'+(p.a||p.t?'Skip for now':'Done')+'</button></div></section>'}
function updLvp(){var el=$('#lvp'),h=lvpHtml();if(el){if(h)el.outerHTML=h;else el.remove()}}
var NUM={level:[1,30],raceBonus:[0,10],wounds:[0,3],fatigue:[0,6],hp:[0,999],hpBonus:[-99,999],ar:[0,20],pen:[0,10],speed:[0,10],mpMax:[0,9999],mp:[0,9999],carried:[0,999]};
function cleanC(o){if(!o||typeof o!=='object'||Array.isArray(o))return null;var c=mk();
  ['name','race','bg','concept','armName','money'].forEach(function(k){if(typeof o[k]==='string')c[k]=o[k].slice(0,120)});
  ['weapons','traits','gear','notes'].forEach(function(k){if(typeof o[k]==='string')c[k]=o[k].slice(0,6000)});
  Object.keys(NUM).forEach(function(k){var v=+o[k];if(o[k]!==''&&o[k]!=null&&isFinite(v))c[k]=Math.max(NUM[k][0],Math.min(NUM[k][1],Math.round(v)))});
  A.forEach(function(a){var v=+o[a];if(isFinite(v))c[a]=Math.max(0,Math.min(4,Math.round(v)))});
  c.theme=['fan','mod','sw'].indexOf(o.theme)>-1?o.theme:'fan';c.rb=A.indexOf(o.rb)>-1?o.rb:'';
  c.ab=Array.isArray(o.ab)?o.ab.filter(function(x,i,r){return typeof x==='string'&&BY[x]&&r.indexOf(x)===i}).slice(0,200):[];
  c.abr={};if(o.abr&&typeof o.abr==='object')c.ab.forEach(function(id){var v=+o.abr[id];if(v>=1&&v<=5)c.abr[id]=Math.round(v)});
  c.wl=Array.isArray(o.wl)?o.wl.slice(0,60).filter(function(w){return w&&typeof w.n==='string'}).map(function(w){return{n:w.n.slice(0,80),p:String(w.p||'').slice(0,80),d:String(w.d||'').slice(0,40),a:A.indexOf(w.a)>-1?w.a:'Brawn',b:Math.max(-20,Math.min(20,Math.round(+w.b||0)))}}):[];
  var id=String(o.id||'');c.id=/^[A-Za-z0-9][A-Za-z0-9_-]{2,39}$/.test(id)&&!db[id]?id:mk().id;c.upd=Date.now();c.pend=null;return c}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fld(l,f,t){return '<label class="f"><span>'+l+'</span><input data-f="'+f+'" type="'+(t||'text')+'"'+(t==='number'?' inputmode="numeric"':'')+' value="'+esc(cur[f])+'"></label>'}
function area(l,f,r){return '<label class="f"><span>'+l+'</span><textarea data-f="'+f+'" rows="'+(r||4)+'">'+esc(cur[f])+'</textarea></label>'}
function step(k,l){return '<div class="st"><button data-s="'+k+'" data-d="-1" aria-label="Lower '+l+'">−</button><b id="v-'+k+'"></b><button data-s="'+k+'" data-d="1" aria-label="Raise '+l+'">+</button></div>'}
function listView(){
  $('#sheet').hidden=true;$('#list').hidden=false;$('#back').hidden=true;$('#ttl').textContent='After World Characters';$('#st').textContent='';
  var ids=Object.keys(db).sort(function(a,b){return db[b].upd-db[a].upd}),h='';
  if(!ok)h+='<p class="warn">This browser is blocking storage, so characters will not be kept. Use Export to keep a copy.</p>';
  h+='<button class="pri" id="new">New character</button>';
  if(!ids.length)h+='<p class="meta">No characters yet. Tap New character to make one.</p>';
  ids.forEach(function(id){var c=db[id];
    h+='<div class="card"><button class="open" data-o="'+id+'"><strong>'+esc(c.name||'Unnamed character')+'</strong><span>Level '+esc(c.level)+(c.race?' · '+esc(c.race):'')+(c.bg?' · '+esc(c.bg):'')+'</span><span class="meta">HP '+esc(c.hp)+' · edited '+new Date(c.upd).toLocaleDateString()+'</span></button><button data-dp="'+id+'">Copy</button><button data-sh="'+id+'">Share</button><button class="del" data-x="'+id+'">Delete</button></div>'});
  h+=trashHtml();h+='<div class="foot"><button id="exp">Export all</button><label class="btn">Import<input id="imp" type="file" accept="application/json,.json" hidden></label></div>';
  $('#list').innerHTML=h;
}
function open(id,keep){
  cur=db[id];if(!cur)return listView();if(!cur.ab)cur.ab=[];if(!cur.theme)cur.theme='fan';try{localStorage.setItem(LAST,id)}catch(e){}
  $('#list').hidden=true;$('#sheet').hidden=false;$('#back').hidden=false;$('#ttl').textContent=cur.name||'Unnamed character';
  var th=cur.theme,SH=D.armour.filter(function(x){return x.t===th&&x.kind==='shield'}),R=D.races.filter(function(x){return x.t===th}),B=D.bgs.filter(function(x){return x.t===th}),AR=D.armour.filter(function(x){return x.t===th&&x.kind==='armour'}),WP=[].concat(D.weapons.filter(function(x){return x.t===th}).map(function(x){return{n:x.n,p:x.prof,d:x.dmg,l:x.n+' — '+x.prof+', '+x.dmg,line:x.n+' — '+x.prof+(x.dmg?'; damage '+x.dmg:'')+(x.rng?'; range '+x.rng:'')+(x.tags?'; '+x.tags:'')}}));
  var rr=R.filter(function(x){return x.n===cur.race})[0],bb=B.filter(function(x){return x.n===cur.bg})[0];
  var h=lvpHtml()+'<section><label class="f"><span>Theme</span><select id="theme" data-p="theme"><option value="fan">Fantasy</option><option value="mod">Modern</option><option value="sw">Star Wars</option></select></label>'+fld('Name','name');
  h+='<label class="f"><span>Race</span>'+sel('race',R,cur.race,'Choose from the book')+'</label>'+fld('Race (edit or type your own)','race');
  h+=rr&&rr.stats.some(function(x){return /^Rank 1 in/i.test(x)})?'<label class="f"><span>Racial bonus rank goes to</span><select id="rbs" data-p="rbs"><option value="">Not placed yet</option>'+A.map(function(a){return '<option'+(a===cur.rb?' selected':'')+'>'+a+'</option>'}).join('')+'</select></label><p class="meta">'+esc(window._rbm||'Applied automatically. You can move it.')+'</p>':'';
  h+=rr?'<details><summary>Race details</summary><ul>'+rr.stats.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul><p class="meta">'+esc(rr.desc)+'</p></details>':'';
  h+='<label class="f"><span>Background</span>'+sel('bg',B,cur.bg,'Choose from the book')+'</label>'+fld('Background (edit or type your own)','bg');
  h+=bb?'<details><summary>Background details</summary><ul>'+bb.info.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul><button data-kit="1">Add kit to Equipment</button></details>':'';
  h+=fld('Concept','concept')+'<div class="g2">'+fld('Level','level','number')+fld('Race bonus ranks','raceBonus','number')+'</div><button data-lv="1">Level up</button><p class="meta" id="lvm"></p></section>';
  h+='<section><h2>Attributes</h2><p class="meta" id="rk"></p>';
  A.forEach(function(a){h+='<div class="row"><span class="an">'+a+'</span>'+step(a,a)+'<span class="die" id="d-'+a+'"></span><button class="roll" data-r="'+a+'">Roll</button></div>'});
  h+='<label class="f"><span>Roll mode</span><select id="adv"><option value="n">Normal</option><option value="a">Advantage (keep higher)</option><option value="d">Disadvantage (keep lower)</option></select></label><label class="f"><span>Target Armour Rating for attacks (max 8)</span><input id="tar" type="number" inputmode="numeric" value="0"></label><label class="f"><span>Roll bonus (tools, traits)</span><input id="bon" type="number" inputmode="numeric" value="0"></label><p id="rr" class="res" aria-live="polite">Tap Roll on an attribute.</p></section>';
  h+='<section><h2>Health</h2><div class="row"><span class="an">Hit Points</span>'+step('hp','Hit Points')+'<span class="die" id="hm"></span></div>'+'<div class="row"><input id="dmg" type="number" inputmode="numeric" placeholder="Amount" style="flex:1"><button data-dm="-1">Damage</button><button data-dm="1">Heal</button></div><p class="meta" id="zr"></p>'+fld('HP bonus (traits such as Healthy)','hpBonus','number');
  h+='<div class="row"><span class="an">Wounds</span><div class="wd">'+[1,2,3].map(function(n){return '<button data-w="'+n+'" id="w'+n+'">'+n+'</button>'}).join('')+'</div></div><p class="meta" id="wn"></p>';
  h+='<div class="row"><span class="an">Fatigue</span>'+step('fatigue','Fatigue')+'</div><p class="meta" id="fx"></p><div class="row"><span class="an">Rest</span><button data-rt="l">Light</button><button data-rt="m">Middle</button><button data-rt="f">Full</button></div><p class="meta" id="rt" aria-live="polite"></p></section>';
  h+='<section><h2>Defence</h2><div class="big"><div><b id="cd"></b><span>Combat Defence</span></div><div><b id="mds"></b><span>Magic DS</span></div></div>';
  h+='<label class="f"><span>Shield (adds to Combat Defence)</span>'+sel('shd',SH,cur.shName,'No shield')+'</label><label class="f"><span>Armour</span>'+sel('arm',AR,cur.armName,'Choose from the book')+'</label><div class="g3">'+fld('Armour','armName')+fld('Armour Rating (max 8)','ar','number')+fld('Armour penalty','pen','number')+'</div><div class="g2">'+fld('Speed (zones)','speed','number')+fld('Carried weight','carried','number')+'</div><p class="meta" id="cw"></p><p class="meta" id="spd"></p></section>';
  h+='<section><h2>Magic</h2><div class="row"><span class="an">Magic points</span>'+step('mp','Magic points')+'<span class="die" id="mm"></span></div>'+fld('Magic points max','mpMax','number')+'<p class="meta" id="lr"></p></section>';
  h+='<section><h2>Traits and powers</h2><div id="abl"></div><label class="f"><span>Add a trait or power</span><input id="abq" type="search" placeholder="Search by name, ID or type" autocomplete="off"></label><label class="f"><span>Show</span><select id="abs"><option value="t">Core and this theme</option><option value="a">Every theme</option></select></label><div id="abres"></div>'+area('Other traits (your own)','traits',3)+'</section>';
  h+='<section><h2>Gear</h2><label class="f"><span>Add a weapon or shield</span><span class="row">'+sel('wp',WP,'','Choose from the book')+'<button data-aw="1">Add</button></span></label>'+'<div id="wl"></div><p id="wr" class="res" aria-live="polite" hidden></p>'+area('Other weapons or notes','weapons',3)+area('Equipment','gear',6)+fld('Money','money')+area('Notes','notes',5)+'</section>';
  $('#sheet').innerHTML=h;$('#theme').value=th;window._wp=WP;window._bb=bb;if(!keep)scrollTo(0,0);refresh();renderAb();renderRes();renderWl();
}
function renderAb(){var h='';cur.abr=cur.abr||{};cur.ab.forEach(function(id){var a=BY[id];if(!a)return;var m=[a.cat,a.ranked&&a.ranked!=='No'?'Ranked: '+a.ranked:'',a.pre&&a.pre!=='None'?'Prerequisite: '+a.pre:''].concat(Object.keys(a.x).map(function(k){return k+': '+a.x[k]})).filter(Boolean).join(' · ');
  var mx=(a.txt.match(/^Rank \d/mg)||[]).length,rk=cur.abr[id]||1,rs=mx>1?'<div class="row"><span class="an">Your rank</span><div class="st"><button data-ra="'+id+'" data-d="-1">−</button><b>'+rk+'</b><button data-ra="'+id+'" data-d="1">+</button></div></div>':'';
  var tx=a.txt.split('\n').map(function(l){var q=l.match(/^Rank (\d)/);return q&&mx>1&&+q[1]===rk?'<mark>'+esc(l)+'</mark>':esc(l)}).join('\n');
  h+='<details class="ab"><summary>'+esc(a.n)+(mx>1?' (rank '+rk+')':'')+' <span class="meta">'+esc(a.id)+'</span></summary><p class="meta">'+esc(m)+'</p>'+rs+'<p class="tx">'+tx+'</p>'+(a.a?'<button data-rb="'+a.a+'">Open in rulebook</button> ':'')+'<button class="del" data-ar="'+a.id+'">Remove</button></details>'});
  $('#abl').innerHTML='<p class="meta">'+cur.ab.length+' chosen. You gain 1 trait per level (level '+esc(cur.level)+'), plus racial traits.</p>'+h}
function renderRes(){var q=($('#abq').value||'').toLowerCase().trim(),all=$('#abs').value==='a',h='',n=0;
  D.abil.forEach(function(a){if(n>=40||cur.ab.indexOf(a.id)>-1)return;if(!all&&!inTh(a))return;if(q&&(a.n+' '+a.id+' '+a.cat).toLowerCase().indexOf(q)<0)return;n++;h+='<button class="pk" data-ab="'+a.id+'"><strong>'+esc(a.n)+'</strong><span class="meta">'+esc(a.id+' · '+a.cat)+'</span></button>'});
  $('#abres').innerHTML=(h||'<p class="meta">No matches.</p>')+(n>=40?'<p class="meta">Showing the first 40. Search to narrow.</p>':'')}
function SHL(th){return D.armour.filter(function(x){return x.t===th&&x.kind==='shield'})}
function pick(p,v){
  var th=cur.theme,i=v===''?-1:+v,keep=function(){save();open(cur.id,true)};
  if(p==='theme'){cur.theme=v;save();return open(cur.id,true)}
  if(p==='rbs'){window._rbm='';if(cur.rb&&cur[cur.rb]>0)cur[cur.rb]--;cur.rb='';if(v&&cur[v]<4){cur[v]++;cur.rb=v}else if(v)window._rbm=v+' is already at Rank 4.';return keep()}
  if(p==='shd'){var sh=SHL(th)[i];cur.shName=sh?sh.n:'';cur.shMod=sh?({Light:1,Medium:2,Heavy:3}[sh.prof.split(' ')[0]]||0):0;return keep()}
  if(p==='race'&&i>-1){var r=D.races.filter(function(x){return x.t===th})[i];cur.race=r.n;if(cur.rb&&cur[cur.rb]>0)cur[cur.rb]--;cur.rb='';window._rbm='';
    var m=null;r.stats.forEach(function(x){var q=x.match(/^Rank 1 in (.+?) ability/i);if(q&&!m)m=q[1]});
    if(m){cur.raceBonus=1;var f=A.filter(function(a){return new RegExp('\\b'+a+'\\b','i').test(m)})[0];if(f){if(cur[f]<4){cur[f]++;cur.rb=f}else window._rbm=f+' is already at Rank 4.'}else window._rbm='Choose where your racial bonus rank goes.'}else cur.raceBonus=0;keep()}
  if(p==='bg'&&i>-1){cur.bg=D.bgs.filter(function(x){return x.t===th})[i].n;keep()}
  if(p==='arm'&&i>-1){var a=D.armour.filter(function(x){return x.t===th&&x.kind==='armour'})[i];cur.armName=a.n;cur.ar=Math.min(8,a.ar);cur.pen=a.pen;keep()}
}
function refresh(){
  var sp=0;A.forEach(function(a){sp+=+cur[a]||0;$('#v-'+a).textContent=cur[a];$('#d-'+a).textContent=cur.wounds?(dn(eff(a))+' (wounded)'):dn(cur[a])});
  var tot=10+(+cur.raceBonus||0)+Math.max(0,(+cur.level||1)-1);
  $('#rk').textContent='Ranks spent '+sp+' of '+tot+'. Max Rank 4.';$('#rk').className='meta'+(sp>tot?' over':'');
  var hm=hpMax();$('#v-hp').textContent=cur.hp;$('#zr').textContent=cur.hp===0?'At 0 HP: roll a d6 three times. Above 3 passes, below 3 fails, a 3 rerolls. More passes: back up on 1 HP or more. More fails: death. If attacked at 0 HP you take 2 Wounds, and damage beyond your max HP kills you regardless.':'';$('#hm').textContent='of '+hm;
  [1,2,3].forEach(function(n){$('#w'+n).className=cur.wounds>=n?'on':''});
  $('#wn').textContent=cur.wounds?'Wounds lower every attribute by '+cur.wounds+' rank'+(cur.wounds>1?'s':'')+'. A fourth Wound is death.':'Spend a Wound to turn a hit into 0 damage.';
  $('#v-fatigue').textContent=cur.fatigue;$('#fx').textContent=FAT[cur.fatigue]||'';var rc=D.races.filter(function(x){return x.t===cur.theme&&x.n===cur.race})[0],sz=rc?(rc.stats.join(' ').match(/Size:\s*(\w+)/)||[0,'Medium'])[1]:'Medium',ac=D.armour.filter(function(x){return x.t===cur.theme&&x.n===cur.armName})[0],bk=ac?parseInt(ac.bulk,10)||0:0,sp=Math.max(0.5,(/Large/i.test(sz)?2:1)-0.5*bk);if((+cur.fatigue||0)>=2)sp=Math.max(0.5,sp/2);$('#spd').textContent='Calculated Speed: '+sp+' zone'+(sp===1?'':'s')+' ('+sz+(bk?', armour Bulk '+bk:'')+((+cur.fatigue||0)>=2?', Fatigue halves it':'')+').';
  $('#cd').textContent=12+eff('Agility')-(+cur.pen||0)+(+cur.shMod||0);
  $('#mds').textContent=10+Math.max(eff('Senses'),eff('Presence'));
  var cap=eff('Brawn')*5;$('#cw').textContent='Carry capacity '+cap+(+cur.carried>cap?' (over)':'')+'. Light 1, Medium 3, Heavy 6.';
  $('#v-mp').textContent=cur.mp;$('#mm').textContent='of '+(+cur.mpMax||0);
  $('#lr').textContent='A light rest returns '+Math.max(cur.Senses,cur.Presence)*10+' magic points.';
}
function save(){cur.upd=Date.now();db[cur.id]=cur;put()}
function lim(k){if(k==='hp')return[0,hpMax()];if(k==='mp')return[0,Math.max(0,+cur.mpMax||0)];if(k==='fatigue')return[0,6];return[0,4]}
function defA(p){p=p||'';if(/Siege/.test(p))return eff('Senses')>eff('Agility')?'Senses':'Agility';if(/Ranged/.test(p))return /Heavy/.test(p)?'Senses':'Agility';if(/Heavy/.test(p))return 'Brawn';return eff('Brawn')>eff('Agility')?'Brawn':'Agility'}
function renderWl(){var h='';(cur.wl||[]).forEach(function(w,i){h+='<div class="wrow"><strong>'+esc(w.n)+'</strong> <span class="meta">'+esc(w.p+(w.d?' · damage '+w.d:''))+'</span><div class="row"><select data-wa="'+i+'">'+A.map(function(a){return '<option'+(a===w.a?' selected':'')+'>'+a+'</option>'}).join('')+'</select><input data-wb="'+i+'" type="number" inputmode="numeric" placeholder="Bonus" value="'+(w.b||'')+'" style="width:5.5rem"><button data-at="'+i+'">Attack</button><button class="del" data-wd="'+i+'">Remove</button></div></div>'});$('#wl').innerHTML=h}
function attack(i){var w=cur.wl[i],r=$('#wr');r.hidden=false;
  if(/Thrown/.test(w.p)){r.textContent=w.n+' ('+w.p+'): no attack roll. The target saves against the DS in the profile (12-13). Fail: full effect'+(w.d?', damage '+w.d:'')+'. Pass: half damage or no effect.';return}
  var e=eff(w.a),b=(+w.b||0)+(+$('#bon').value||0),m=fm($('#adv').value,'all'),x=one(e),y=m==='n'?null:one(e),p=x,ar=Math.max(0,Math.min(8,+$('#tar').value||0));
  if(y)p=m==='a'?(y.v>x.v?y:x):(y.v<x.v?y:x);
  var dm=parseInt((String(w.d).match(/\d+/)||[0])[0],10),o=w.n+' ('+w.a+'): ',dd=function(d){var f=fl(d,ar);return 'Damage '+f+(ar?' ('+d+' less Armour '+ar+', minimum half)':'')+', plus any trait bonuses.'};
  if(p.v===-1)o+='natural 1. Miss.';else if(p.v===99)o+='natural 10. Hit, critical. '+dd(dm*2);else o+=p.t+(b?' + '+b:'')+' = '+(p.v+b)+'. Hits if it beats the target\'s Combat Defence. '+dd(dm);
  if(y)o+=' ('+(m==='a'?'Advantage':'Disadvantage')+')';if((+cur.fatigue||0)>=3)o+=' Fatigue gives Disadvantage on all rolls.';r.textContent=o}
function fm(m,k){var f=+cur.fatigue||0;return(k==='ab'?f>=1:f>=3)?(m==='a'?'n':'d'):m}
function fl(d,a){return Math.max(Math.ceil(d/2),d-a)}
function one(e){var r=Math.ceil(Math.random()*10);if(r===10)return{v:99,t:'natural 10'};if(r===1)return{v:-1,t:'natural 1'};var s=e?Math.ceil(Math.random()*DIE[e]):0;return{v:r+s,t:'d10 '+r+(e?' + '+dn(e)+' '+s:'')}}
function roll(a){
  var e=eff(a),b=+$('#bon').value||0,m=fm($('#adv').value,'ab'),x=one(e),y=m==='n'?null:one(e),p=x;
  if(y)p=m==='a'?(y.v>x.v?y:x):(y.v<x.v?y:x);
  var o=a+': '+(p.v===99?'natural 10. Success.':p.v===-1?'natural 1. Failure.':p.t+(b?' + bonus '+b:'')+' = '+(p.v+b)+'.');
  if(y)o+=' ('+(m==='a'?'Advantage':'Disadvantage')+': rolled '+x.t+' and '+y.t+'.)';
  $('#rr').textContent=o;
}
document.addEventListener('click',function(e){
  var t=e.target.closest('button,label.btn');if(!t)return;
  if(t.id==='new'){var c=mk();db[c.id]=c;put();open(c.id)}
  else if(t.dataset.o)open(t.dataset.o);
  else if(t.dataset.x){var c2=db[t.dataset.x];if(confirm('Delete '+(c2.name||'this character')+'? You can restore it from Recently deleted for 30 days.')){var tr=getT();c2.del=Date.now();tr[c2.id]=c2;setT(tr);delete db[t.dataset.x];put();listView()}}
  else if(t.id==='back'){listView()}
  else if(t.dataset.s){var k=t.dataset.s,full=cur.hp===hpMax(),l=lim(k),v=(+cur[k]||0)+(+t.dataset.d);cur[k]=Math.max(l[0],Math.min(l[1],v));if((k==='Health'&&full)||cur.hp>hpMax())cur.hp=hpMax();save();refresh()}
  else if(t.dataset.w){var n=+t.dataset.w;cur.wounds=cur.wounds===n?n-1:n;save();refresh()}
  else if(t.dataset.r)roll(t.dataset.r);
  else if(t.dataset.rs){var tt=getT(),rc=tt[t.dataset.rs];if(rc){delete rc.del;db[rc.id]=rc;delete tt[rc.id];setT(tt);put();listView()}}
  else if(t.dataset.df){if(confirm('Delete this character for good?')){var t3=getT();delete t3[t.dataset.df];setT(t3);listView()}}
  else if(t.dataset.dm){var n=Math.abs(+$('#dmg').value||0);cur.hp=Math.max(0,Math.min(hpMax(),cur.hp+n*(+t.dataset.dm)));$('#dmg').value='';save();refresh()}
  else if(t.dataset.at)attack(+t.dataset.at)
  else if(t.dataset.rt){var k=t.dataset.rt,mg=Math.max(cur.Senses,cur.Presence)*10,ot=[],mx=+cur.mpMax||0;
    if(mx>0){var nm=Math.min(mx,cur.mp+mg);ot.push('+'+(nm-cur.mp)+' magic points ('+nm+'/'+mx+')');cur.mp=nm}
    if(k!=='l'){var hm=hpMax(),nh=Math.min(hm,cur.hp+cur.Health);ot.push('+'+(nh-cur.hp)+' HP ('+nh+'/'+hm+')');cur.hp=nh}
    save();refresh();$('#rt').textContent=({l:'Light rest, 1 hour',m:'Middle rest, 4 hours',f:'Full rest, 8 hours'})[k]+': '+(ot.join(', ')||'nothing to restore')+'. Rests remove most effects.'+(k==='f'?' Also heal 2 injuries (not tracked on this sheet).':'')+(cur.wounds?' Wounds are not healed by resting. Use a potion or surgery, then a full rest.':'')}
  else if(t.dataset.wd){cur.wl.splice(+t.dataset.wd,1);save();renderWl()}
  else if(t.dataset.ra){var id2=t.dataset.ra,mx2=(BY[id2].txt.match(/^Rank \d/mg)||[]).length||1;cur.abr[id2]=Math.max(1,Math.min(mx2,(cur.abr[id2]||1)+(+t.dataset.d)));save();renderAb()}
  else if(t.dataset.lv){if(confirm('Level up to '+((+cur.level||1)+1)+'?')){cur.level=(+cur.level||1)+1;var mp=+cur.mpMax>0;if(mp)cur.mpMax=+cur.mpMax+50;cur.pend={a:1,t:1};save();open(cur.id,true);$('#lvm').textContent=mp?'Magic points max is now '+cur.mpMax+'.':'';scrollTo(0,0)}}
  else if(t.dataset.la){var at=$('#lsel').value;if(at&&cur[at]<4){cur[at]++;cur.pend.a=0;save();refresh();updLvp()}}
  else if(t.dataset.lt){var q2=$('#abq');q2.scrollIntoView({block:'center'});q2.focus()}
  else if(t.dataset.ld){cur.pend=null;save();updLvp()}
  else if(t.dataset.dp){var o=JSON.parse(JSON.stringify(db[t.dataset.dp]));o.id=mk().id;o.name=(o.name||'Unnamed character')+' (copy)';o.upd=Date.now();db[o.id]=o;put();listView()}
  else if(t.dataset.sh){var c4=db[t.dataset.sh],ob={};ob[c4.id]=c4;var f=new File([JSON.stringify(ob)],(c4.name||'character').replace(/\W+/g,'-')+'.json',{type:'application/json'});
    if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:c4.name||'After World character'}).catch(function(){});
    else{var a2=document.createElement('a');a2.href=URL.createObjectURL(f);a2.download=f.name;document.body.appendChild(a2);a2.click();a2.remove()}}
  else if(t.dataset.rb){parent.postMessage({aw:'rule',hash:t.dataset.rb},location.origin)}
  else if(t.dataset.ab){cur.ab.push(t.dataset.ab);if(cur.pend&&cur.pend.t)cur.pend.t=0;save();renderAb();renderRes();updLvp()}
  else if(t.dataset.ar){cur.ab=cur.ab.filter(function(x){return x!==t.dataset.ar});save();renderAb();renderRes()}
  else if(t.dataset.aw){var w=window._wp[+$('#wp').value];if(w){(cur.wl=cur.wl||[]).push({n:w.n,p:w.p,d:w.d,a:defA(w.p),b:0});save();renderWl()}}
  else if(t.dataset.kit&&window._bb){var eq=window._bb.info.filter(function(x){return /^Equipment/.test(x)})[0]||'';cur.gear=(cur.gear?cur.gear+'\n':'')+window._bb.n+' kit: '+eq.replace(/^Equipment:\s*/,'');save();open(cur.id,true)}
  else if(t.id==='exp'){var bl=new Blob([JSON.stringify(db,null,1)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download='after-world-characters.json';document.body.appendChild(a);a.click();a.remove()}
});
document.addEventListener('input',function(e){if(e.target.id==='abq'&&cur)return renderRes();if(e.target.dataset&&e.target.dataset.wb&&cur){cur.wl[+e.target.dataset.wb].b=+e.target.value||0;save();return}var f=e.target.dataset&&e.target.dataset.f;if(!f||!cur)return;
  cur[f]=e.target.type==='number'?(e.target.value===''?0:Number(e.target.value)):e.target.value;if(f==='ar')cur.ar=Math.max(0,Math.min(8,cur.ar));
  if(f==='name')$('#ttl').textContent=cur.name||'Unnamed character';
  save();refresh()});
document.addEventListener('change',function(e){var t=e.target;if(t.dataset&&t.dataset.p&&cur){return pick(t.dataset.p,t.value)}if(t.dataset&&t.dataset.wa&&cur){cur.wl[+t.dataset.wa].a=t.value;save();return}if(t.id==='abs'&&cur)return renderRes();if(t.id!=='imp')return;var fl=e.target.files[0];if(!fl)return;if(fl.size>2e6){alert('That file is too large to be a characters export.');return}var rd=new FileReader();
  rd.onload=function(){try{var d=JSON.parse(rd.result);if(!d||typeof d!=='object'||Array.isArray(d))throw 0;if(typeof d.name==='string'&&d.id){var w0={};w0[d.id]=d;d=w0}
    var n=0,bad=0,ks=Object.keys(d).slice(0,200);ks.forEach(function(k){var c=cleanC(d[k]);if(c){db[c.id]=c;n++}else bad++});put();listView();alert('Imported '+n+' character'+(n===1?'':'s')+(bad?'. Skipped '+bad+' that were not valid.':'.'))}catch(x){alert('That file is not an After World characters export.')}};rd.readAsText(fl)});
load();
listView();
})();
