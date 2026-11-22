(function(){
var E=window.AWENEMY||[],TK='aw-track-v1',NK='aw-npc-v1',$=function(s){return document.querySelector(s)};
function ld(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
var T=ld(TK,{round:1,turn:0,list:[]}),N=ld(NK,{}),V='en',F={th:'',lv:'',q:''},op=-1,say='',amt='',tcd='13',TN={fan:'Fantasy',mod:'Modern',sw:'Star Wars'};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function uid(){return 'g'+Date.now().toString(36)+Math.random().toString(36).slice(2,5)}
var Q={t:{},r:{}};function tick(){var o=[];T.list.forEach(function(c){c.st=(c.st||[]).filter(function(s){s.r--;if(s.r<=0){o.push(s.t+' ended on '+c.n);return false}return true})});return o.join('. ')}
function sc(){sv(TK,T)}function sn(){sv(NK,N)}
function addT(o){T.list.push({id:uid(),n:o.n,hp:+o.hp||1,max:+o.hp||1,cd:+o.cd||0,ar:+o.ar||0,atk:+o.atk||0,die:o.die||'',dmg:+o.dmg||0,wu:o.wu||'',sp:o.sp||''});sc()}
function gen(l){return E.filter(function(e){return e.t==='fan'&&/Generalist/.test(e.tags)&&e.lv===l})[0]}
function lvl(e){return e.lv?'Level '+e.lv:'Unassigned level'}
function stats(e){return '<div class="sg">'+[['HP',e.hp+(e.ghp?' ('+e.ghp+' group)':'')],['Combat Defence',e.cd],['Armour',e.ar],['Attack',e.atk?'+'+e.atk:(e.atkTxt||'–')],['Damage',e.dmg],['Wind-Up',e.wu||'–']].map(function(x){return '<div><b>'+esc(x[1])+'</b><span>'+x[0]+'</span></div>'}).join('')+'</div>'}
function render(){
  $('#seg').innerHTML=[['en','Enemies'],['np','NPCs'],['tr','Tracker ('+T.list.length+')'],['ec','Encounters'],['lo','Loot'],['no','Notes'],['sc','GM screen'],['mu','Music']].map(function(x){return '<button data-v="'+x[0]+'"'+(V===x[0]?' class="on"':'')+'>'+x[1]+'</button>'}).join('');
  var m=$('#m');
  if(V==='en'){m.innerHTML='<div class="g3"><select id="fth"><option value="">All themes</option>'+['fan','mod','sw'].map(function(k){return '<option value="'+k+'"'+(F.th===k?' selected':'')+'>'+TN[k]+'</option>'}).join('')+'</select><select id="flv"><option value="">All levels</option>'+[1,2,3,4,5,6,7,0].map(function(l){return '<option value="'+l+'"'+(F.lv===String(l)?' selected':'')+'>'+(l?'Level '+l:'Unassigned')+'</option>'}).join('')+'</select></div><input id="fq" type="search" placeholder="Search enemies or tags" value="'+esc(F.q)+'"><div id="el"></div>';listEn()}
  else if(V==='np')npcs();else if(V==='tr')track();else if(window.GX&&GX[V])GX[V]();
}
function listEn(){var h='',n=0;E.forEach(function(e,i){if(F.th&&e.t!==F.th||F.lv!==''&&String(e.lv)!==F.lv||F.q&&(e.n+' '+e.tags).toLowerCase().indexOf(F.q)<0)return;n++;
  h+='<div class="card"><button class="pk" data-e="'+i+'"><strong>'+esc(e.n)+'</strong><small>'+TN[e.t]+' · '+lvl(e)+(e.tags?' · '+esc(e.tags):'')+'</small></button>';
  if(op===i)h+=stats(e)+(e.ds?'<p>'+esc(e.ds)+'</p>':'')+(e.sp?'<p><b>Special:</b> '+esc(e.sp)+'</p>':'')+(e.ad?'<p class="meta">'+esc(e.ad)+'</p>':'')+'<div class="row"><button class="pri" data-ea="'+i+'">Add to tracker</button>'+(e.ghp?'<button data-eg="'+i+'">Add group</button>':'')+'<button data-en="'+i+'">Make NPC</button></div>';
  h+='</div>'});$('#el').innerHTML=(say?'<p class="res">'+esc(say)+'</p>':'')+(h||'<p class="meta">No enemies match.</p>')}
function inp(id,k,l,v,t){return '<label class="f"><span>'+l+'</span><input data-nk="'+id+'|'+k+'" type="'+(t||'number')+'" value="'+esc(v)+'"'+(t?'':' inputmode="numeric"')+'></label>'}
function npcs(){var ids=Object.keys(N).sort(function(a,b){return N[b].upd-N[a].upd});
  var h='<h2>New NPC</h2><p class="meta">Starts from the Generalist line for the level you pick. Edit anything after.</p><div class="g3"><select id="nl">'+[1,2,3,4,5,6,7].map(function(l){return '<option value="'+l+'">Level '+l+'</option>'}).join('')+'</select><button class="pri" data-nn="1">Create</button></div>';
  if(say)h+='<p class="res">'+esc(say)+'</p>';
  ids.forEach(function(id){var c=N[id];h+='<details class="card"><summary><strong>'+esc(c.n||'Unnamed NPC')+'</strong> <span class="meta">Level '+esc(c.lv)+' · HP '+esc(c.hp)+' · CD '+esc(c.cd)+'</span></summary>'+inp(id,'n','Name',c.n,'text')+'<div class="g3">'+inp(id,'lv','Level',c.lv)+inp(id,'hp','HP',c.hp)+inp(id,'cd','Combat Defence',c.cd)+inp(id,'ar','Armour',c.ar)+inp(id,'atk','Attack bonus',c.atk)+inp(id,'dmg','Damage per hit',c.dmg)+'</div>'+inp(id,'sp','Notes and special abilities',c.sp,'text')+'<div class="row"><button class="pri" data-na="'+id+'">Add to tracker</button><button class="del" data-nd="'+id+'">Delete</button></div></details>'});
  if(!ids.length)h+='<p class="meta">No NPCs yet.</p>';$('#m').innerHTML=h}
function track(){var l=T.list,h='<div class="row"><b style="flex:1;align-self:center">Round '+T.round+'</b><button class="pri" data-nt="1">Next turn</button><button data-tr="1">Reset round</button></div><div class="g3" style="margin-top:8px"><label class="f"><span>Amount</span><input id="amt" type="number" inputmode="numeric" value="'+esc(amt)+'"></label><label class="f"><span>Target Combat Defence</span><input id="tcd" type="number" inputmode="numeric" value="'+esc(tcd)+'"></label></div>';
  if(say)h+='<p class="res" aria-live="polite">'+esc(say)+'</p><div class="row"><button data-x="lg|">Add to session log</button></div>';
  l.forEach(function(c,i){h+='<div class="card'+(i===T.turn?' turn':'')+(c.hp<=0?' dead':'')+'"><strong>'+esc(c.n)+'</strong> <span class="meta">HP '+c.hp+'/'+c.max+' · CD '+c.cd+' · Armour '+c.ar+' · Atk '+(c.atk?'+'+c.atk:(c.die||'–'))+' · Dmg '+c.dmg+(c.wu?' · Wind-Up '+esc(c.wu):'')+'</span>'+(c.sp?'<div class="meta">'+esc(c.sp)+'</div>':'')+'<div class="row">'+(c.st||[]).map(function(s,j){return '<button class="chip" data-sx="'+i+'|'+j+'">'+esc(s.t)+' ('+s.r+') ✕</button>'}).join('')+'</div><div class="row"><input data-sq="'+i+'" placeholder="Status" style="flex:2"><input data-sr="'+i+'" type="number" inputmode="numeric" placeholder="Rounds" style="flex:1;min-width:4rem"><button data-sa="'+i+'">Add status</button><button data-sw="'+i+'">Wind-up</button></div><div class="row"><button data-td="'+i+'">Damage</button><button data-th="'+i+'">Heal</button><button data-ta="'+i+'">Attack</button><button data-tu="'+i+'" aria-label="Move up">↑</button><button data-tv="'+i+'" aria-label="Move down">↓</button><button class="del" data-tx="'+i+'">Remove</button></div></div>'});
  if(!l.length)h+='<p class="meta">Nothing here yet. Add enemies or NPCs from their tabs.</p>';else h+='<div class="row"><button class="del" data-tc="1">Clear all</button></div>';$('#m').innerHTML=h}
function attack(c){var r=Math.ceil(Math.random()*10),cd=+tcd||0,d=+c.dmg||0;
  if(r===10)return c.n+': natural 10. Hits for '+d*2+' (doubled).';if(r===1)return c.n+': natural 1. Miss.';
  var b=c.atk,t='';if(!b&&c.die){var m=c.die.match(/d(\d+)/);if(m){b=Math.ceil(Math.random()*+m[1]);t=' + '+c.die+' '+b}}
  var tot=r+b;return c.n+': d10 '+r+(c.atk?' + '+c.atk:t)+' = '+tot+(tot>=cd?'. Hits CD '+cd+' for '+d+'.':'. Misses CD '+cd+'.')}
document.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var d=b.dataset,i;if(d.x){GX.click(d.x.split('|'),say);return}say='';
  if(d.v){V=d.v;render();return}
  if(d.e!==undefined){op=op===+d.e?-1:+d.e;listEn();return}
  if(d.ea!==undefined){addT(E[+d.ea]);say=E[+d.ea].n+' added to the tracker.';render();return}
  if(d.eg!==undefined){var g=E[+d.eg];addT({n:g.n+' (group)',hp:g.ghp,cd:g.cd,ar:g.ar,atk:g.atk,die:g.die,dmg:g.dmg,wu:g.wu,sp:g.sp});say=g.n+' (group) added to the tracker.';render();return}
  if(d.en!==undefined){var s=E[+d.en],id=uid();N[id]={id:id,n:s.n,lv:s.lv,hp:s.hp,cd:s.cd,ar:s.ar,atk:s.atk,dmg:s.dmg,sp:s.sp,upd:Date.now()};sn();say=s.n+' saved as an NPC.';V='np';render();return}
  if(d.nn){var l=+$('#nl').value,s2=gen(l),id2=uid();N[id2]={id:id2,n:'',lv:l,hp:s2?s2.hp:8,cd:s2?s2.cd:13,ar:s2?s2.ar:0,atk:s2?s2.atk:8,dmg:s2?s2.dmg:5,sp:'',upd:Date.now()};sn();render();return}
  if(d.na){addT(N[d.na]);say=(N[d.na].n||'NPC')+' added to the tracker.';render();return}
  if(d.nd){if(confirm('Delete this NPC?')){delete N[d.nd];sn();render()}return}
  if(d.nt){if(T.list.length){T.turn++;if(T.turn>=T.list.length){T.turn=0;T.round++;say=tick()}sc()}render();return}
  if(d.sa!==undefined){var cc=T.list[+d.sa],tx=(Q.t[d.sa]||'').trim();if(cc&&tx){(cc.st=cc.st||[]).push({t:tx,r:Math.max(1,+Q.r[d.sa]||1)});sc()}Q={t:{},r:{}};render();return}
  if(d.sw!==undefined){var c5=T.list[+d.sw];if(c5){(c5.st=c5.st||[]).push({t:'Winding up',r:1});sc()}render();return}
  if(d.sx!==undefined){var pp=d.sx.split('|');T.list[+pp[0]].st.splice(+pp[1],1);sc();render();return}
  if(d.tr){T.round=1;T.turn=0;sc();render();return}
  if(d.tc){if(confirm('Remove everyone from the tracker?')){T.list=[];T.turn=0;T.round=1;sc();render()}return}
  i=+(d.td!==undefined?d.td:d.th!==undefined?d.th:d.ta!==undefined?d.ta:d.tu!==undefined?d.tu:d.tv!==undefined?d.tv:d.tx);var c=T.list[i];if(!c)return;
  var n=Math.abs(+amt||0);
  if(d.td!==undefined){c.hp=Math.max(0,c.hp-n);say=c.n+' takes '+n+(c.hp?'.':'. Down.')}
  else if(d.th!==undefined){c.hp=Math.min(c.max,c.hp+n);say=c.n+' heals '+n+'.'}
  else if(d.ta!==undefined)say=attack(c);
  else if(d.tu!==undefined&&i>0){T.list.splice(i-1,0,T.list.splice(i,1)[0])}
  else if(d.tv!==undefined&&i<T.list.length-1){T.list.splice(i+1,0,T.list.splice(i,1)[0])}
  else if(d.tx!==undefined){T.list.splice(i,1);if(T.turn>=T.list.length)T.turn=0}
  sc();render()});
document.addEventListener('input',function(e){var t=e.target;if(window.GX&&GX.input&&GX.input(e))return;if(t.dataset.sq!==undefined){Q.t[t.dataset.sq]=t.value;return}if(t.dataset.sr!==undefined){Q.r[t.dataset.sr]=t.value;return}
  if(t.id==='fq'){F.q=t.value.toLowerCase();listEn()}else if(t.id==='amt')amt=t.value;else if(t.id==='tcd')tcd=t.value;
  else if(t.dataset.nk){var p=t.dataset.nk.split('|'),c=N[p[0]];if(c){c[p[1]]=t.type==='number'?(+t.value||0):t.value;c.upd=Date.now();sn()}}});
document.addEventListener('change',function(e){if(window.GX&&GX.input&&GX.input(e))return;if(e.target.id==='fth'){F.th=e.target.value;listEn()}if(e.target.id==='flv'){F.lv=e.target.value;listEn()}});
window.GM={E:E,T:T,addT:addT,sc:sc,render:render,go:function(v){V=v;render()}};
render();
})();
