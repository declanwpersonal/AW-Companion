(function(){
var E=window.AWENEMY||[],TK='aw-track-v1',NK='aw-npc-v1',$=function(s){return document.querySelector(s)};
function ld(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){var w=document.getElementById('wn');if(w)w.hidden=false;return false}}
sv('aw-probe',1)&&localStorage.removeItem('aw-probe');
var T=ld(TK,{round:1,turn:0,list:[]}),N=ld(NK,{}),V='en',F={th:'',lv:'',q:'',role:''},op=-1,say='',amt='',tcd='13',tar='0',tfx='n',tvr='n',TN={fan:'Fantasy',mod:'Modern',sw:'Star Wars'},_undo=[];
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function uid(){return 'g'+Date.now().toString(36)+Math.random().toString(36).slice(2,5)}
var Q={t:{},r:{}};function tick(){var o=[];T.list.forEach(function(c){c.st=(c.st||[]).filter(function(s){s.r--;if(s.r<=0){o.push(s.t+' ended on '+c.n);return false}return true})});return o.join('. ')}
function snap(){_undo.push(JSON.stringify(T));if(_undo.length>12)_undo.shift()}
function undo(){if(!_undo.length){say='Nothing to undo.';return false}T=JSON.parse(_undo.pop());sc();say='Undone.';return true}
function sc(){sv(TK,T);try{localStorage.setItem('aw-share-v1',JSON.stringify({upd:Date.now(),track:T}))}catch(e){}}function sn(){sv(NK,N)}
function addT(o){snap();T.list.push({id:uid(),n:o.n,hp:+o.hp||1,max:+o.hp||1,cd:+o.cd||0,ar:+o.ar||0,atk:+o.atk||0,attacks:+o.attacks||0,die:o.die||'',dmg:+o.dmg||0,wu:o.wu||'',sp:o.sp||'',boss:!!o.boss});sc()}
var GX8={8:{hp:40,cd:12,ar:5,atk:11,dmg:20},9:{hp:47,cd:12,ar:5,atk:12,dmg:23},10:{hp:54,cd:12,ar:6,atk:12,dmg:26}};
function gen(l){return l>7?GX8[l]:E.filter(function(e){return e.t==='fan'&&/Generalist/.test(e.tags)&&e.lv===l})[0]}
function lvl(e){return e.lv?'Level '+e.lv+(e.est?' (estimated)':'')+(e.lv>7?' (extrapolated)':'')+(e.draft?' · draft':''):'Unassigned level'}
function stats(e){return '<div class="sg">'+[['HP',8*e.lv],['Combat Defence',e.cd],['Armour',e.ar],['Attack',e.atk?'+'+e.atk:(e.atkTxt||'–')],['Damage',e.dmg],['Wind-Up',e.wu||'–']].map(function(x){return '<div><b>'+esc(x[1])+'</b><span>'+x[0]+'</span></div>'}).join('')+'</div>'}
function render(){
  $('#seg').innerHTML=[['en','Enemies'],['np','NPCs'],['tr','Tracker ('+T.list.length+')'],['ec','Encounters'],['lo','Loot'],['no','Notes'],['sc','GM screen'],['rf','Reference'],['mu','Music']].map(function(x){return '<button data-v="'+x[0]+'"'+(V===x[0]?' class="on"':'')+'>'+x[1]+'</button>'}).join('');
  var m=$('#m');
  if(V==='en'){m.innerHTML='<div class="g3"><select id="fth"><option value="">All themes</option>'+['fan','mod','sw'].map(function(k){return '<option value="'+k+'"'+(F.th===k?' selected':'')+'>'+TN[k]+'</option>'}).join('')+'</select><select id="frole"><option value="">All roles</option><option>Generalist</option><option>Specialist</option><option>Boss</option></select><select id="flv"><option value="">All levels</option>'+[1,2,3,4,5,6,7,8,9,10,0].map(function(l){return '<option value="'+l+'"'+(F.lv===String(l)?' selected':'')+'>'+(l?'Level '+l:'Unassigned')+'</option>'}).join('')+'</select></div><input id="fq" type="search" placeholder="Search enemies or tags" value="'+esc(F.q)+'"><div id="el"></div>';listEn()}
  else if(V==='np')npcs();else if(V==='tr')track();else if(window.GX&&GX[V])GX[V]();
}
function listEn(){var h='',n=0;E.forEach(function(e,i){if(F.th&&e.t!==F.th||F.lv!==''&&String(e.lv)!==F.lv||F.q&&(e.n+' '+e.tags+' '+e.ds+' '+e.sp).toLowerCase().indexOf(F.q)<0||F.role&&((F.role==='Generalist'&&!/Generalist/.test(e.tags))||(F.role==='Specialist'&&/Generalist/.test(e.tags))||(F.role==='Boss'&&!/Boss/.test(e.tags))))return;n++;
  h+='<div class="card"><button class="pk" data-e="'+i+'"><strong>'+esc(e.n)+'</strong><small>'+TN[e.t]+' · '+lvl(e)+(e.tags?' · '+esc(e.tags):'')+'</small></button>';
  if(op===i)h+=stats(e)+(e.ds?'<p>'+esc(e.ds)+'</p>':'')+(e.sp?'<p><b>Special:</b> '+esc(e.sp)+'</p>':'')+(e.ad?'<p class="meta">'+esc(e.ad)+'</p>':'')+'<div class="row"><button class="pri" data-ea="'+i+'">Add to tracker</button>'+'<button data-en="'+i+'">Make NPC</button></div>';
  h+='</div>'});$('#el').innerHTML=(say?'<p class="res">'+esc(say)+'</p>':'')+(h||'<p class="meta">No enemies match.</p>')}
function inp(id,k,l,v,t){return '<label class="f"><span>'+l+'</span><input data-nk="'+id+'|'+k+'" type="'+(t||'number')+'" value="'+esc(v)+'"'+(t?'':' inputmode="numeric"')+'></label>'}
function npcs(){var ids=Object.keys(N).sort(function(a,b){return N[b].upd-N[a].upd});
  var h='<h2>New NPC</h2><p class="meta">Starts from the Generalist line for the level you pick. Edit anything after.</p><div class="g3"><select id="nl">'+[1,2,3,4,5,6,7,8,9,10].map(function(l){return '<option value="'+l+'">Level '+l+(l>7?' (extrapolated)':'')+'</option>'}).join('')+'</select><button class="pri" data-nn="1">Create</button></div>';
  if(say)h+='<p class="res">'+esc(say)+'</p>';
  ids.forEach(function(id){var c=N[id];h+='<details class="card"><summary><strong>'+esc(c.n||'Unnamed NPC')+'</strong> <span class="meta">Level '+esc(c.lv)+' · HP '+esc(c.hp)+' · CD '+esc(c.cd)+'</span></summary>'+inp(id,'n','Name',c.n,'text')+'<div class="g3">'+inp(id,'lv','Level',c.lv)+inp(id,'hp','HP',c.hp)+inp(id,'cd','Combat Defence',c.cd)+inp(id,'ar','Armour',c.ar)+inp(id,'atk','Attack bonus',c.atk)+inp(id,'dmg','Damage per hit',c.dmg)+'</div>'+inp(id,'sp','Notes and special abilities',c.sp,'text')+'<div class="row"><button class="pri" data-na="'+id+'">Add to tracker</button><button class="del" data-nd="'+id+'">Delete</button></div></details>'});
  if(!ids.length)h+='<p class="meta">No NPCs yet.</p>';$('#m').innerHTML=h}
function track(){var l=T.list,h='<div class="row"><b style="flex:1;align-self:center">Round '+T.round+'</b><button class="pri" data-nt="1">Next turn</button><button data-tr="1">Reset round</button><button data-undo="1"'+( _undo.length?'':' disabled')+'>Undo</button></div><div class="g3" style="margin-top:8px"><label class="f"><span>Amount</span><input id="amt" type="number" inputmode="numeric" value="'+esc(amt)+'"></label><label class="f"><span>Target Combat Defence</span><input id="tcd" type="number" inputmode="numeric" value="'+esc(tcd)+'"></label><label class="f"><span>Target Armour Rating (max 8)</span><input id="tar" type="number" inputmode="numeric" value="'+esc(tar)+'"></label><label class="f"><span>Target effect</span><select id="tfx">'+[['n','None'],['s','Stunned (Advantage)'],['g','Grounded (melee)'],['p','Paralysed or Restrained']].map(function(x){return '<option value="'+x[0]+'"'+(x[0]===tfx?' selected':'')+'>'+x[1]+'</option>'}).join('')+'</select></label><label class="f"><span>Target type</span><select id="tvr">'+[['n','Normal'],['v','Vulnerable'],['r','Resistant'],['i','Immune']].map(function(x){return '<option value="'+x[0]+'"'+(x[0]===tvr?' selected':'')+'>'+x[1]+'</option>'}).join('')+'</select></label><label class="f"><span>A tie counts as</span><select id="tie"><option value="s"'+(TIE()?' selected':'')+'>Success</option><option value="f"'+(TIE()?'':' selected')+'>Failure</option></select></label></div>';
  if(say)h+='<p class="res" aria-live="polite">'+esc(say)+'</p><div class="row"><button data-x="lg|">Add to session log</button></div>';
  l.forEach(function(c,i){h+='<div class="card'+(i===T.turn?' turn':'')+(c.hp<=0?' dead':'')+'"><strong>'+esc(c.n)+'</strong> <span class="meta">HP '+c.hp+'/'+c.max+' · CD '+c.cd+' · Armour '+c.ar+' · Atk '+(c.atk?'+'+c.atk:(c.die||'–'))+' · Attacks '+(c.attacks||'—')+' · Dmg '+c.dmg+(c.wu?' · Wind-Up '+esc(c.wu):'')+'</span>'+(c.sp?'<div class="meta">'+esc(c.sp)+'</div>':'')+(c.hp>0&&c.hp<c.max/4?'<div class="meta"><b>Below a quarter HP:</b> it may flee, surrender or negotiate (Rule 3), unless mindless, cornered or fanatical.</div>':'')+'<div class="row">'+(c.st||[]).map(function(s,j){return '<button class="chip" data-sx="'+i+'|'+j+'">'+esc(s.t)+' ('+s.r+') ✕</button>'}).join('')+'</div><div class="row"><input data-sq="'+i+'" placeholder="Status" style="flex:2"><input data-sr="'+i+'" type="number" inputmode="numeric" placeholder="Rounds" style="flex:1;min-width:4rem"><button data-sa="'+i+'">Add status</button><button data-sw="'+i+'">Wind-up</button></div><div class="row"><button data-td="'+i+'">Damage</button><button data-th="'+i+'">Heal</button><button data-ta="'+i+'">Attack</button>'+(c.wu?'<button data-tw="'+i+'">Wind-Up attack</button>':'')+'<button data-tu="'+i+'" aria-label="Move up">↑</button><button data-tv="'+i+'" aria-label="Move down">↓</button><button class="del" data-tx="'+i+'">Remove</button></div></div>'});
  if(!l.length)h+='<p class="meta">Nothing here yet. Add enemies or NPCs from their tabs.</p>';else h+='<div class="row"><button class="del" data-tc="1">Clear all</button></div>';$('#m').innerHTML=h}
function fl(d,a){return Math.max(Math.ceil(d/2),d-a)}
function TIE(){try{return localStorage.getItem('aw-tie')!=='f'}catch(e){return true}}
function once(c){var r=Math.ceil(Math.random()*10),b=c.atk,t='';if(r!==10&&r!==1&&!b&&c.die){var m=c.die.match(/d(\d+)/);if(m){b=Math.ceil(Math.random()*+m[1]);t=' + '+c.die+' '+b}}return{r:r,b:b,t:t,v:r===10?99:r===1?-1:r+b}}
function attack(c,dv){var cd=+tcd||0,ar=Math.max(0,Math.min(8,+tar||0)),d=(dv!==undefined?dv:+c.dmg)||0,fx=tfx,vr=tvr,auto=fx==='p',adv=fx==='s'||fx==='g',x=once(c),y=adv?once(c):null,p=y&&y.v>x.v?y:x;
  var n10=p.r===10,n1=p.r===1&&!auto,tot=p.r+p.b,hit=auto||n10||(!n1&&(cd?(tot>cd||(tot===cd&&TIE())):null)),crit=n10||auto||(fx==='g'&&hit!==false);
  var res=n1?'natural 1. Miss.':n10?'natural 10. Hit, critical.':auto?'Automatic hit, critical (the target cannot defend).':'d10 '+p.r+(c.atk?' + '+c.atk:p.t)+' = '+tot+(cd?(hit?'. Hits CD '+cd+'.':'. Misses CD '+cd+'.'):'.');
  if(n1||hit===false)return c.n+': '+res+(adv&&y?' (Advantage)':'');
  var dmg=crit?d*2:(vr==='v'?d*2:d);if(vr==='r')dmg=Math.ceil(dmg/2);if(vr==='i')dmg=0;var f=dmg?fl(dmg,ar):0;
  return c.n+': '+res+(adv?' (Advantage)':'')+(fx==='g'&&!n10&&!auto?' Critical if it hits.':'')+' Damage '+f+(ar&&dmg?' ('+dmg+' less Armour '+ar+', minimum half)':'')+(vr==='i'?' (immune)':vr==='r'?' (resistant: halved)':vr==='v'&&!crit?' (vulnerable: critical damage)':'')+'.'}
document.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var d=b.dataset,i;if(d.x){GX.click(d.x.split('|'),say);return}say='';
  if(d.v){V=d.v;render();return}
  if(d.e!==undefined){op=op===+d.e?-1:+d.e;listEn();return}
  if(d.ea!==undefined){var en=E[+d.ea];addT({n:en.n,hp:8*en.lv,cd:en.cd,ar:en.ar,atk:en.atk,attacks:en.lv,dmg:en.dmg,wu:en.wu,sp:en.sp});say=en.n+' added to the tracker.';render();return}
  if(d.eg!==undefined){var g=E[+d.eg];addT({n:g.n+' (group)',hp:8*g.lv,cd:g.cd,ar:g.ar,atk:g.atk,attacks:g.lv,dmg:g.dmg,wu:g.wu,sp:g.sp});say=g.n+' (group) added to the tracker.';render();return}
  if(d.en!==undefined){var s=E[+d.en],id=uid();N[id]={id:id,n:s.n,lv:s.lv,hp:s.hp,cd:s.cd,ar:s.ar,atk:s.atk,dmg:s.dmg,sp:s.sp,upd:Date.now()};sn();say=s.n+' saved as an NPC.';V='np';render();return}
  if(d.nn){var l=+$('#nl').value,s2=gen(l),id2=uid();N[id2]={id:id2,n:'',lv:l,hp:s2?s2.hp:8,cd:s2?s2.cd:13,ar:s2?s2.ar:0,atk:s2?s2.atk:8,dmg:s2?s2.dmg:5,sp:'',upd:Date.now()};sn();render();return}
  if(d.na){addT(N[d.na]);say=(N[d.na].n||'NPC')+' added to the tracker.';render();return}
  if(d.nd){if(confirm('Delete this NPC?')){delete N[d.nd];sn();render()}return}
  if(d.undo){undo();render();return}
  if(d.nt){if(T.list.length){snap();T.turn++;if(T.turn>=T.list.length){T.turn=0;T.round++;say=tick()}sc()}render();return}
  if(d.tw!==undefined){var cw=T.list[+d.tw];if(cw){snap();var w2=parseInt(String(cw.wu).replace(/\D/g,''),10)||0;if(!w2)say=cw.n+' has no Wind-Up.';else{say='Wind-Up: '+attack(cw,w2);cw.st=(cw.st||[]).filter(function(x){return x.t!=='Winding up'})}}sc();render();return}
  if(d.sa!==undefined){var cc=T.list[+d.sa],tx=(Q.t[d.sa]||'').trim();if(cc&&tx){snap();(cc.st=cc.st||[]).push({t:tx,r:Math.max(1,+Q.r[d.sa]||1)});sc()}Q={t:{},r:{}};render();return}
  if(d.sw!==undefined){var c5=T.list[+d.sw];if(c5){snap();(c5.st=c5.st||[]).push({t:'Winding up',r:1});sc()}render();return}
  if(d.sx!==undefined){snap();var pp=d.sx.split('|');T.list[+pp[0]].st.splice(+pp[1],1);sc();render();return}
  if(d.tr){snap();T.round=1;T.turn=0;sc();render();return}
  if(d.tc){if(confirm('Remove everyone from the tracker?')){snap();T.list=[];T.turn=0;T.round=1;sc();render()}return}
  i=+(d.td!==undefined?d.td:d.th!==undefined?d.th:d.ta!==undefined?d.ta:d.tu!==undefined?d.tu:d.tv!==undefined?d.tv:d.tx);var c=T.list[i];if(!c)return;
  var n=Math.abs(+amt||0);
  if(d.td!==undefined||d.th!==undefined||d.tx!==undefined||d.tu!==undefined||d.tv!==undefined)snap();
  if(d.td!==undefined){c.hp=Math.max(0,c.hp-n);say=c.n+' takes '+n+(c.hp?'.':'. Down.')}
  else if(d.th!==undefined){c.hp=Math.min(c.max,c.hp+n);say=c.n+' heals '+n+'.'}
  else if(d.ta!==undefined)say=attack(c);
  else if(d.tu!==undefined&&i>0){if(T.turn===i)T.turn=i-1;else if(T.turn===i-1)T.turn=i;T.list.splice(i-1,0,T.list.splice(i,1)[0])}
  else if(d.tv!==undefined&&i<T.list.length-1){if(T.turn===i)T.turn=i+1;else if(T.turn===i+1)T.turn=i;T.list.splice(i+1,0,T.list.splice(i,1)[0])}
  else if(d.tx!==undefined){T.list.splice(i,1);if(i<T.turn)T.turn--;if(T.turn>=T.list.length){T.turn=0;if(T.list.length){T.round++;say=tick()}}}
  sc();render()});
document.addEventListener('input',function(e){var t=e.target;if(window.GX&&GX.input&&GX.input(e))return;if(t.dataset.sq!==undefined){Q.t[t.dataset.sq]=t.value;return}if(t.dataset.sr!==undefined){Q.r[t.dataset.sr]=t.value;return}
  if(t.id==='fq'){F.q=t.value.toLowerCase();listEn()}else if(t.id==='amt')amt=t.value;else if(t.id==='tcd')tcd=t.value;else if(t.id==='tar')tar=t.value;
  else if(t.dataset.nk){var p=t.dataset.nk.split('|'),c=N[p[0]];if(c){c[p[1]]=t.type==='number'?(+t.value||0):t.value;c.upd=Date.now();sn()}}});
document.addEventListener('change',function(e){if(e.target.id==='tfx'){tfx=e.target.value;return}if(e.target.id==='tvr'){tvr=e.target.value;return}if(e.target.id==='tie'){try{localStorage.setItem('aw-tie',e.target.value)}catch(x){}return}if(window.GX&&GX.input&&GX.input(e))return;if(e.target.id==='fth'){F.th=e.target.value;listEn()}if(e.target.id==='flv'){F.lv=e.target.value;listEn()}});
window.GM={E:E,T:T,addT:addT,sc:sc,render:render,go:function(v){V=v;render()}};
addEventListener('storage',function(e){if(e.key===TK){T=ld(TK,{round:1,turn:0,list:[]});if(window.GM)window.GM.T=T;render()}});
render();
})();
