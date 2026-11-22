(function(){
var $=function(s){return document.querySelector(s)},X=window.GX={};
function ld(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}}function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function uid(){return 'x'+Date.now().toString(36)+Math.random().toString(36).slice(2,5)}
function S(id,arr,v){return '<select id="'+id+'">'+arr.map(function(a){return '<option value="'+a[0]+'"'+(String(a[0])===String(v)?' selected':'')+'>'+a[1]+'</option>'}).join('')+'</select>'}
var EK='aw-enc-v1',NKY='aw-notes-v1',enc=ld(EK,{}),ES={d:'standard',L:3,P:4,th:'fan',pk:[]},nt=ld(NKY,{log:[],notes:{}}),LO={L:1,n:2,c:''},lootOut=null,pl=null,au=new Audio(),mcat='',mi=-1,lp=false,sl=[];LO.s='fan';LO.t=0;
var DIFF=[['routine','Routine'],['standard','Standard'],['hard','Hard'],['deadly','Deadly'],['boss','Boss']],TH=[['fan','Fantasy'],['mod','Modern'],['sw','Star Wars']];
function slots(){var L=+ES.L,k=+ES.P-4,m=function(n,l,g){return{cnt:Math.max(0,n),lv:Math.max(1,Math.min(7,l)),g:!!g}};
  return({routine:[m(4+k,L-2)],standard:[m(4+k,L)],hard:[m(4+k,L),m(2,L-2)],deadly:[m(6+k,L)],boss:[m(1,L,1),m(4+k,L-1)]}[ES.d]).filter(function(x){return x.cnt>0})}
function opts(s){var E=GM.E;return E.map(function(e,i){return[i,e]}).filter(function(p){return p[1].t===ES.th&&(ES.th==='sw'||p[1].lv===s.lv)&&(!s.g||p[1].ghp||ES.th==='sw')})}
function dflt(s){var o=opts(s),g=o.filter(function(p){return /Generalist/.test(p[1].tags)})[0]||o[0];return g?g[0]:-1}
function fill(sIdx,cnt,g,ei){var e=GM.E[ei];if(!e)return;for(var k=0;k<cnt;k++)GM.addT({n:e.n+(cnt>1?' '+(k+1):'')+(g?' (group)':''),hp:g?e.ghp:e.hp,cd:e.cd,ar:e.ar,atk:e.atk,die:e.die,dmg:e.dmg,wu:e.wu,sp:e.sp})}
function ensure(){sl=slots();sl.forEach(function(s,i){var o=opts(s).map(function(p){return p[0]});if(o.indexOf(ES.pk[i])<0)ES.pk[i]=dflt(s)})}
X.ec=function(){ensure();var h='<h2>Build an encounter</h2><p class="meta">Uses the Threat Budget for a party of four, adjusted by one Solo statline per player above or below four.</p><div class="g3">'+S('ed',DIFF,ES.d)+S('el2',[1,2,3,4,5,6,7].map(function(l){return[l,'Party level '+l]}),ES.L)+S('ep',[1,2,3,4,5,6,7,8].map(function(l){return[l,l+' players']}),ES.P)+S('eth',TH,ES.th)+'</div>';
  sl.forEach(function(s,i){h+='<div class="card"><b>'+s.cnt+' × '+(s.g?'Group':'Solo')+' at Level '+s.lv+'</b><select data-xi="pk|'+i+'">'+opts(s).map(function(p){return '<option value="'+p[0]+'"'+(ES.pk[i]===p[0]?' selected':'')+'>'+esc(p[1].n)+'</option>'}).join('')+'</select></div>'});
  if(ES.d==='boss')h+='<p class="meta">Boss Action: once per round, at the end of the round, the Group-statline boss makes one extra basic attack as a free action, against a different target if it can.</p>';
  h+='<div class="row"><button class="pri" data-x="eadd|">Add all to tracker</button></div><label class="f"><span>Save this encounter</span><input id="enm" type="text" placeholder="Name"></label><div class="row"><button data-x="esv|">Save</button></div><h2>Saved encounters</h2>';
  var ids=Object.keys(enc);if(!ids.length)h+='<p class="meta">None saved yet.</p>';
  ids.forEach(function(id){var c=enc[id];h+='<div class="card"><strong>'+esc(c.n)+'</strong> <span class="meta">'+DIFF.filter(function(d){return d[0]===c.d})[0][1]+' · level '+c.L+' · '+c.sl.map(function(s){return s.cnt+'× '+esc(s.e)}).join(', ')+'</span><div class="row"><button class="pri" data-x="eld|'+id+'">Load</button><button data-x="eta|'+id+'">Add to tracker</button><button class="del" data-x="edl|'+id+'">Delete</button></div></div>'});
  $('#m').innerHTML=h};
function tr(){GM.sc();GM.go('tr')}
function savedFill(c){c.sl.forEach(function(s){var ei=GM.E.findIndex(function(e){return e.n===s.e&&e.t===s.t&&e.lv===s.lv});fill(0,s.cnt,s.g,ei)})}
X.no=function(){var h='<h2>Session log</h2><div class="row"><input id="lgt" type="text" placeholder="What happened?" style="flex:3"><button class="pri" data-x="lga|">Add</button></div>';
  nt.log.slice().reverse().slice(0,40).forEach(function(l){h+='<div class="card"><span class="meta">'+esc(l.d)+'</span><div>'+esc(l.t)+'</div><div class="row"><button class="del" data-x="lgd|'+l.id+'">Delete</button></div></div>'});
  h+='<h2>Campaign notes</h2><div class="row"><button class="pri" data-x="nna|">New note</button></div>';
  Object.keys(nt.notes).sort(function(a,b){return nt.notes[b].upd-nt.notes[a].upd}).forEach(function(id){var n=nt.notes[id];h+='<details class="card"><summary><strong>'+esc(n.t||'Untitled note')+'</strong></summary><label class="f"><span>Title</span><input data-xi="nt|'+id+'" type="text" value="'+esc(n.t)+'"></label><label class="f"><span>Notes</span><textarea data-xi="nb|'+id+'" rows="7">'+esc(n.b)+'</textarea></label><div class="row"><button class="del" data-x="nnd|'+id+'">Delete</button></div></details>'});
  $('#m').innerHTML=h};
var FAT=['No effect','Disadvantage on ability rolls','Speed halved','Disadvantage on all rolls','HP max halved','No movement, Opportunity Actions, Surprise Actions or Interactions','Death'];
var LINKS=[['Threat Budget','threat-budget'],['Survival levers','the-survival-levers'],['Rule 1: Damage Floor','rule-1-the-damage-floor'],['Rule 2: Wind-Up','rule-2-the-wind-up'],['Rule 3: Breaking Off','rule-3-breaking-off'],['Fatigue and recovery','chapter-4-fatigue-and-recovery'],['Resting','resting'],['Quick Reference','quick-reference'],['Glossary','glossary']];
X.sc=function(){var h='<h2>Quick numbers</h2><div class="card"><div>Combat Defence = 12 + Agility rank − armour penalty</div><div>Magic DS = 10 + Senses or Presence rank</div><div>Natural 10 always succeeds (hits for double damage). Natural 1 always fails.</div><div>Advantage or Disadvantage: roll both dice twice and keep the better or worse pair.</div><div>Light rest returns magic points equal to Senses or Presence rank × 10.</div><div>At 0 HP: roll a d6 three times. Above 3 passes, below 3 fails, a 3 rerolls.</div><div>Wounds lower every attribute by 1 rank each. A fourth Wound is death.</div></div><h2>Fatigue</h2><div class="card">'+FAT.map(function(f,i){return '<div><b>'+i+'</b> '+f+'</div>'}).join('')+'</div><h2>Threat Budget (party of four)</h2><div class="card"><div><b>Routine</b> 4 Solo at party level − 2</div><div><b>Standard</b> 4 Solo at party level</div><div><b>Hard</b> 4 Solo at level + 2 Solo at level − 2</div><div><b>Deadly</b> 6 Solo at party level</div><div><b>Boss</b> 1 Group at level with Boss Action + 4 Solo at level − 1</div><div class="meta">Add or remove one Solo statline per player above or below four.</div></div><h2>Open in the rulebook</h2><div class="row">'+LINKS.map(function(l){return '<button data-x="go|'+l[1]+'">'+l[0]+'</button>'}).join('')+'</div>';$('#m').innerHTML=h};
X.lo=function(){var Z=window.AWLOOT;if(!Z||!Z.sw){$('#m').innerHTML='<p class="meta">Loot data is missing.</p>';return}
  var fan=LO.s!=='sw',M=Z.mod||{bands:{},wealth:[]},B=LO.s==='mod'?M:Z,band=LO.L<3?'1-2':LO.L<5?'3-4':LO.L<7?'5-6':'7+',tier=LO.L<3?1:LO.L<5?2:LO.L<7?3:4,cats=[];
  (B.bands[band]||[]).forEach(function(x){if(cats.indexOf(x.c)<0)cats.push(x.c)});
  var h='<h2>Loot roller</h2>'+S('ls',[['fan','Fantasy loot tables'],['mod','Modern loot tables (draft)'],['sw','Star Wars loot module']],LO.s)+'<div class="g3" style="margin-top:8px">'+S('ll',[1,2,3,4,5,6,7].map(function(l){return[l,'Level '+l]}),LO.L)+(fan?S('ln',[1,2,3].map(function(n){return[n,n+' item'+(n>1?'s':'')]}),LO.n):S('lt',Z.sw.locs.map(function(l,i){return[i,l.n]}),LO.t))+'</div>';
  if(fan)h+=S('lc',[['','Any category']].concat(cats.map(function(c){return[c,c]})),LO.c)+'<div class="row"><button class="pri" data-x="lr|f">Roll loot</button></div>';
  else h+='<p class="meta">Tier '+tier+' for level '+LO.L+'. Pick a location, or roll straight from the tier table.</p><div class="row"><button class="pri" data-x="lr|l">Roll location</button><button data-x="lr|i">Roll item</button><button data-x="lr|c">Roll credits</button></div>';
  if(lootOut)h+=lootOut.map(function(x){return '<div class="card"><strong>'+esc(x.n)+'</strong> <span class="meta">'+esc(x.m||'')+'</span>'+(x.e?'<div>'+esc(x.e)+'</div>':'')+'</div>'}).join('');
  h+='<h2>All loot tables</h2>';
  Object.keys(Z.bands).forEach(function(b){h+='<details class="card"><summary>Fantasy loot, levels '+b+' ('+Z.bands[b].length+' items)</summary>'+Z.bands[b].map(function(x){return '<div class="meta"><b>'+esc(x.n)+'</b> ('+esc(x.c)+', '+esc(x.v)+'): '+esc(x.e)+'</div>'}).join('')+'</details>'});
  h+='<details class="card"><summary>Fantasy wealth and materials</summary>'+Z.wealth.map(function(x){return '<div class="meta">Level '+x.lv+' · <b>'+esc(x.n)+'</b>: '+esc(x.e)+'</div>'}).join('')+'</details>';
  Object.keys(M.bands).forEach(function(b){h+='<details class="card"><summary>Modern loot (draft), levels '+b+' ('+M.bands[b].length+' items)</summary>'+M.bands[b].map(function(x){return '<div class="meta"><b>'+esc(x.n)+'</b> ('+esc(x.c)+'): '+esc(x.e)+'</div>'}).join('')+'</details>'});
  if(M.wealth.length)h+='<details class="card"><summary>Modern wealth (draft)</summary>'+M.wealth.map(function(x){return '<div class="meta">Level '+x.lv+' · <b>'+esc(x.n)+'</b>: '+esc(x.e)+'</div>'}).join('')+'</details>';
  h+='<details class="card"><summary>Star Wars credits by tier</summary>'+Z.sw.credits.map(function(x){return '<div class="meta">Levels '+esc(x.lv)+' · '+esc(x.t)+': '+esc(x.f)+'</div>'}).join('')+'</details>';
  Object.keys(Z.sw.tiers).forEach(function(t){h+='<details class="card"><summary>Star Wars item tier '+t+'</summary>'+Z.sw.tiers[t].map(function(x,i){return '<div class="meta"><b>'+(i+1)+'</b> '+esc(x)+'</div>'}).join('')+'</details>'});
  Z.sw.locs.forEach(function(l){h+='<details class="card"><summary>Star Wars location: '+esc(l.n)+'</summary>'+l.rows.map(function(x,i){return '<div class="meta"><b>'+(i+1)+'</b> '+esc(x)+'</div>'}).join('')+'</details>'});
  [['salvage','Star Wars salvage and crafting'],['price','Star Wars price guide']].forEach(function(p){var t=Z.sw[p[0]];if(t)h+='<details class="card"><summary>'+p[1]+'</summary>'+t.rows.map(function(r){return '<div class="meta">'+r.map(esc).join(' · ')+'</div>'}).join('')+'</details>'});
  $('#m').innerHTML=h};
function d10(){return Math.ceil(Math.random()*10)}
function swItem(tier){var r=d10(),n=window.AWLOOT.sw.tiers[tier][r-1],o=[{n:n,m:'Tier '+tier+' item · rolled '+r}];if(/^Credits/.test(n))o.push(swCred(tier));return o}
function swCred(tier){var c=window.AWLOOT.sw.credits[tier-1],mu=+((c.f.match(/x\s*([\d,]+)/)||[0,'1'])[1].replace(/,/g,'')),r=d10();return{n:(r*mu).toLocaleString()+' credits',m:c.t+' · rolled '+r+' × '+mu}}
function pickRoll(k){var Z=window.AWLOOT,band=LO.L<3?'1-2':LO.L<5?'3-4':LO.L<7?'5-6':'7+',tier=LO.L<3?1:LO.L<5?2:LO.L<7?3:4,o=[];
  if(k==='f'){var B2=LO.s==='mod'?(Z.mod||{bands:{},wealth:[]}):Z,pool=(B2.bands[band]||[]).filter(function(x){return!LO.c||x.c===LO.c});for(var i=0;i<LO.n&&pool.length;i++){var x=pool[Math.floor(Math.random()*pool.length)];o.push({n:x.n,m:x.c+(x.v?' · value '+x.v:''),e:x.e})}
    var w=B2.wealth.filter(function(x){return x.lv===+LO.L})[0];if(w)o.push({n:w.n,m:'Wealth · value '+w.v,e:w.e});return o}
  if(k==='i')return swItem(tier);if(k==='c')return[swCred(tier)];
  var loc=Z.sw.locs[LO.t],r=d10(),t=loc.rows[r-1];o.push({n:t,m:loc.n+' · rolled '+r});
  if(/tier table|restricted equipment/i.test(t))o=o.concat(swItem(tier));else if(/^Credits|roll the Credits/i.test(t))o.push(swCred(tier));return o}
function track(a,b){au.loop=lp;au.src=a;var pr=au.play();if(pr&&pr.catch)pr.catch(function(){});if('mediaSession' in navigator){try{navigator.mediaSession.metadata=new MediaMetadata({title:b.t,artist:b.c||'After World'});navigator.mediaSession.setActionHandler('nexttrack',function(){X.nx(1)});navigator.mediaSession.setActionHandler('previoustrack',function(){X.nx(-1)})}catch(e){}}}
function list(){return(pl||[]).filter(function(t){return!mcat||t.c===mcat})}
X.nx=function(d){var l=list();if(!l.length)return;mi=(mi+d+l.length)%l.length;track(l[mi].f,l[mi]);GM.render()};
au.onended=function(){if(!lp)X.nx(1)};
X.mu=function(){if(pl===null){$('#m').innerHTML='<p class="meta">Loading…</p>';fetch('music/playlist.json').then(function(r){return r.json()}).then(function(j){pl=Array.isArray(j)?j:[]}).catch(function(){pl=[]}).then(function(){GM.render()});return}
  if(!pl.length){$('#m').innerHTML='<h2>Music</h2><p>No tracks yet. Put MP3 files in a folder called <b>music</b> next to <b>index.html</b>, then list them in <b>music/playlist.json</b> like this:</p><pre class="card" style="overflow:auto;font-size:13px">[\n {"t":"Tavern Night","f":"music/tavern.mp3","c":"Tavern","a":"Composer, CC0"},\n {"t":"Long Road","f":"music/road.mp3","c":"Travel","a":"Composer, CC BY 4.0"}\n]</pre><p class="meta">t = title, f = file, c = scene category, a = credit and licence. Only use music you are allowed to host.</p>';return}
  var cats=[];pl.forEach(function(t){if(cats.indexOf(t.c)<0)cats.push(t.c)});var l=list(),cur=l[mi];
  var h='<h2>Music</h2>'+S('mc',[['','All scenes']].concat(cats.map(function(c){return[c,c||'Other']})),mcat)+'<p class="res">'+(cur&&!au.paused?'Playing: '+esc(cur.t):'Stopped')+'</p><div class="row"><button data-x="mp|">'+(au.paused?'Play':'Pause')+'</button><button data-x="mb|">Back</button><button data-x="mn|">Next</button><button data-x="ml|">'+(lp?'Loop on':'Loop off')+'</button></div><label class="f"><span>Volume</span><input data-xi="vol|" type="range" min="0" max="1" step="0.05" value="'+au.volume+'"></label>';
  l.forEach(function(t,i){h+='<button class="pk" data-x="mt|'+i+'"><strong>'+esc(t.t)+'</strong><small>'+esc(t.c||'')+'</small></button>'});
  h+='<details class="card"><summary>Credits</summary>'+pl.map(function(t){return '<div class="meta">'+esc(t.t)+': '+esc(t.a||'')+'</div>'}).join('')+'</details>';$('#m').innerHTML=h};
X.click=function(p,say){var a=p[0],g=p[1],G=GM;
  if(a==='eadd'){sl.forEach(function(s,i){fill(0,s.cnt,s.g,ES.pk[i])});tr();return}
  if(a==='esv'){var nm=($('#enm').value||'').trim()||'Encounter';var id=uid();enc[id]={id:id,n:nm,d:ES.d,L:ES.L,P:ES.P,th:ES.th,sl:sl.map(function(s,i){var e=G.E[ES.pk[i]]||{};return{cnt:s.cnt,g:s.g,e:e.n,t:e.t,lv:e.lv}})};sv(EK,enc);G.render();return}
  if(a==='eld'){var c=enc[g];ES.d=c.d;ES.L=c.L;ES.P=c.P;ES.th=c.th;ES.pk=[];ensure();c.sl.forEach(function(s,i){var ei=G.E.findIndex(function(e){return e.n===s.e&&e.t===s.t&&e.lv===s.lv});if(ei>-1)ES.pk[i]=ei});G.render();return}
  if(a==='eta'){savedFill(enc[g]);tr();return}
  if(a==='edl'){if(confirm('Delete this saved encounter?')){delete enc[g];sv(EK,enc);G.render()}return}
  if(a==='lga'){var t=($('#lgt').value||'').trim();if(t){nt.log.push({id:uid(),d:new Date().toLocaleString(),t:t});sv(NKY,nt)}G.render();return}
  if(a==='lg'){if(say){nt.log.push({id:uid(),d:new Date().toLocaleString(),t:say});sv(NKY,nt)}G.render();return}
  if(a==='lgd'){nt.log=nt.log.filter(function(l){return l.id!==g});sv(NKY,nt);G.render();return}
  if(a==='nna'){var n=uid();nt.notes[n]={id:n,t:'',b:'',upd:Date.now()};sv(NKY,nt);G.render();return}
  if(a==='nnd'){if(confirm('Delete this note?')){delete nt.notes[g];sv(NKY,nt);G.render()}return}
  if(a==='go'){parent.postMessage({aw:'rule',hash:g},location.origin);return}
  if(a==='lr'){lootOut=pickRoll(g);G.render();return}
  if(a==='mt'){mi=+g;var l=list();track(l[mi].f,l[mi]);G.render();return}
  if(a==='mp'){if(au.src){au.paused?au.play():au.pause()}else X.nx(1);setTimeout(G.render,50);return}
  if(a==='mn'){X.nx(1);return}if(a==='mb'){X.nx(-1);return}
  if(a==='ml'){lp=!lp;au.loop=lp;G.render()}
};
X.input=function(e){var t=e.target,id=t.id,x=t.dataset.xi;
  if(id==='ed'||id==='el2'||id==='ep'||id==='eth'){ES.d=$('#ed').value;ES.L=+$('#el2').value;ES.P=+$('#ep').value;ES.th=$('#eth').value;ES.pk=[];GM.render();return true}
  if(x&&x.indexOf('pk|')===0){ES.pk[+x.split('|')[1]]=+t.value;return true}
  if(id==='ll'||id==='ln'||id==='lc'||id==='ls'||id==='lt'){var q=function(s){var e=$(s);return e?e.value:null};LO.s=q('#ls')||LO.s;LO.L=+q('#ll');if(q('#ln'))LO.n=+q('#ln');if(q('#lt')!==null)LO.t=+q('#lt');LO.c=(id==='ll'||id==='ls')?'':(q('#lc')||'');lootOut=id==='ll'||id==='ls'?null:lootOut;GM.render();return true}
  if(id==='mc'){mcat=t.value;mi=-1;GM.render();return true}
  if(x){var p=x.split('|');if(p[0]==='vol'){au.volume=+t.value;return true}
    if(p[0]==='nt'||p[0]==='nb'){var n=nt.notes[p[1]];if(n){n[p[0]==='nt'?'t':'b']=t.value;n.upd=Date.now();sv(NKY,nt)}return true}}
  return false};
})();
