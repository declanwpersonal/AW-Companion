(function(){
var $=function(s){return document.querySelector(s)},X=window.GX={};
function ld(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}}function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){var w=document.getElementById('wn');if(w)w.hidden=false;return false}}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function uid(){return 'x'+Date.now().toString(36)+Math.random().toString(36).slice(2,5)}
function S(id,arr,v){return '<select id="'+id+'">'+arr.map(function(a){return '<option value="'+a[0]+'"'+(String(a[0])===String(v)?' selected':'')+'>'+a[1]+'</option>'}).join('')+'</select>'}
var EK='aw-enc-v1',NKY='aw-notes-v1',enc=ld(EK,{}),ES={L:3,th:'fan',solo:false,enemy:0,count:1,items:[]},nt=ld(NKY,{log:[],notes:{},sessions:{},active:null}),LO={L:1,n:2,c:''},lootOut=null,pl=null,au=new Audio(),mcat='',mi=-1,lp=false;LO.s='fan';LO.t=0;
if(!nt.sessions)nt.sessions={};if(nt.active===undefined)nt.active=null;
var TH=[['fan','Fantasy'],['mod','Modern'],['sw','Star Wars']];
function enemyOptions(){return GM.E.map(function(e,i){return {e:e,i:i}}).filter(function(x){return x.e.t===ES.th})}
function enemyTotal(items){return items.reduce(function(n,x){return n+(+x.lv||0)*(+x.cnt||0)},0)}
function addEncounterEnemy(){var e=GM.E[ES.enemy];if(!e)return;var found=ES.items.find(function(x){return x.i===ES.enemy});if(found)found.cnt+=Math.max(1,ES.count);else ES.items.push({i:ES.enemy,cnt:Math.max(1,ES.count),n:e.n,lv:e.lv,t:e.t});}
function fillEnemy(e,count){for(var k=0;k<count;k++)GM.addT({n:e.n+(count>1?' '+(k+1):''),hp:8*e.lv,cd:e.cd,ar:e.ar,atk:e.atk,attacks:/Boss/i.test(e.tags||'')?e.lv:(ES.solo?1:e.lv),dmg:e.dmg,wu:e.wu,sp:e.sp,boss:/Boss/i.test(e.tags||'')})}
X.ec=function(){var opts=enemyOptions();if(!opts.some(function(x){return x.i===ES.enemy}))ES.enemy=opts.length?opts[0].i:-1;
var h='<h2>Build an encounter</h2><p class="meta">Add enemies and quantities. Encounter level is the sum of enemy levels, compared with the level of one player character. Do not add the party levels together.</p><div class="g3">'+S('eth',TH,ES.th)+S('el2',[1,2,3,4,5,6,7,8,9,10].map(function(l){return[l,'Player level '+l]}),ES.L)+'</div><label class="f"><span>Enemy</span><select id="een">'+opts.map(function(x){return '<option value="'+x.i+'"'+(ES.enemy===x.i?' selected':'')+'>'+esc(x.e.n)+' · Level '+x.e.lv+'</option>'}).join('')+'</select></label><div class="row"><label class="f" style="flex:1"><span>Quantity</span><input id="ecnt" type="number" min="1" max="50" value="'+ES.count+'"></label><button class="pri" data-x="eadditem|">Add enemy</button></div>';
h+='<label class="chk"><input id="esolo" type="checkbox"'+(ES.solo?' checked':'')+'> Solo player encounter (ordinary enemies make only 1 ordinary attack each turn)</label><h2>Encounter contents</h2>';
if(!ES.items.length)h+='<p class="meta">No enemies added yet.</p>';ES.items.forEach(function(x,j){h+='<div class="card"><b>'+x.cnt+' × '+esc(x.n)+'</b> <span class="meta">Level '+x.lv+' · '+(x.lv*x.cnt)+' total levels</span><div class="row"><button data-x="erm|'+j+'">Remove</button></div></div>'});
var total=enemyTotal(ES.items),diff=total<ES.L?'Easier':total===ES.L?'Standard':'Harder';h+='<div class="res">Enemy level total: '+total+' · Player level: '+ES.L+' · '+diff+'</div><p class="meta">This is a guideline, not a guarantee. Bosses use their normal level in the calculation. Specialist abilities are included in their level and do not add extra levels.</p><div class="row"><button class="pri" data-x="eadd|">Add encounter to tracker</button></div><label class="f"><span>Save this encounter</span><input id="enm" type="text" placeholder="Name"></label><div class="row"><button data-x="esv|">Save</button></div><h2>Saved encounters</h2>';
Object.keys(enc).forEach(function(id){var c=enc[id],sn=c.sid&&nt.sessions&&nt.sessions[c.sid]?nt.sessions[c.sid].n:'';h+='<div class="card"><strong>'+esc(c.n)+'</strong><span class="meta">'+(c.items||[]).map(function(x){return x.cnt+'× '+esc(x.n)}).join(', ')+(sn?' · Session: '+esc(sn):'')+'</span><div class="row"><button class="pri" data-x="eld|'+id+'">Load</button><button data-x="eta|'+id+'">Add to tracker</button><button class="del" data-x="edl|'+id+'">Delete</button></div></div>'});$('#m').innerHTML=h};
function savedFill(c){(c.items||[]).forEach(function(x){var e=GM.E.find(function(z){return z.n===x.n&&z.t===x.t&&z.lv===x.lv});if(e)fillEnemy(e,x.cnt)})}
X.no=function(){
  var sid=nt.active,sess=nt.sessions||{},sids=Object.keys(sess).sort(function(a,b){return(sess[b].created||0)-(sess[a].created||0)});
  var h='<h2>Sessions</h2><p class="meta">Group log entries, notes and saved encounters by play session. Select a session to filter the lists below, or choose All.</p>';
  h+='<div class="row"><select id="nsel" style="flex:2"><option value="">All sessions</option>'+sids.map(function(id){return '<option value="'+id+'"'+(sid===id?' selected':'')+'>'+esc(sess[id].n||'Untitled')+(sess[id].date?' · '+esc(sess[id].date):'')+'</option>'}).join('')+'</select><button data-x="nsact|">Set active</button></div>';
  h+='<div class="row" style="margin-top:6px"><input id="nsn" type="text" placeholder="New session name" style="flex:2"><button class="pri" data-x="nsnew|">Create session</button></div>';
  if(sid&&sess[sid]){h+='<div class="card" style="margin-top:8px"><strong>'+esc(sess[sid].n)+'</strong><span class="meta">'+(sess[sid].date||'')+'</span><div class="row"><input id="nsrn" type="text" value="'+esc(sess[sid].n)+'" style="flex:2"><button data-x="nsren|'+sid+'">Rename</button><button class="del" data-x="nsdel|'+sid+'">Delete session</button></div></div>'}
  h+='<h2>Session log'+(sid&&sess[sid]?' · '+esc(sess[sid].n):'')+'</h2><div class="row"><input id="lgt" type="text" placeholder="What happened?" style="flex:3"><button class="pri" data-x="lga|">Add</button></div>';
  var logs=nt.log.filter(function(l){return!sid||l.sid===sid}).slice().reverse().slice(0,50);
  if(!logs.length)h+='<p class="meta">No log entries'+(sid?' in this session':'')+' yet.</p>';
  logs.forEach(function(l){var sn=l.sid&&sess[l.sid]?sess[l.sid].n:'';h+='<div class="card"><span class="meta">'+esc(l.d)+(sn?' · '+esc(sn):'')+'</span><div>'+esc(l.t)+'</div><div class="row"><button class="del" data-x="lgd|'+l.id+'">Delete</button></div></div>'});
  h+='<h2>Campaign notes'+(sid&&sess[sid]?' · '+esc(sess[sid].n):'')+'</h2><div class="row"><button class="pri" data-x="nna|">New note</button></div>';
  var nids=Object.keys(nt.notes).filter(function(id){return!sid||nt.notes[id].sid===sid}).sort(function(a,b){return nt.notes[b].upd-nt.notes[a].upd});
  if(!nids.length)h+='<p class="meta">No notes'+(sid?' in this session':'')+' yet.</p>';
  nids.forEach(function(id){var n=nt.notes[id],sn=n.sid&&sess[n.sid]?sess[n.sid].n:'';h+='<details class="card"><summary><strong>'+esc(n.t||'Untitled note')+'</strong>'+(sn?' <span class="meta">· '+esc(sn)+'</span>':'')+'</summary><label class="f"><span>Title</span><input data-xi="nt|'+id+'" type="text" value="'+esc(n.t)+'"></label><label class="f"><span>Session</span><select data-xi="nsid|'+id+'"><option value="">None</option>'+sids.map(function(s){return '<option value="'+s+'"'+(n.sid===s?' selected':'')+'>'+esc(sess[s].n||s)+'</option>'}).join('')+'</select></label><label class="f"><span>Notes</span><textarea data-xi="nb|'+id+'" rows="7">'+esc(n.b)+'</textarea></label><div class="row"><button class="del" data-x="nnd|'+id+'">Delete</button></div></details>'});
  $('#m').innerHTML=h};
var FAT=['No effect','Disadvantage on ability rolls','Speed halved','Disadvantage on all rolls','HP max halved','No movement, Opportunity Actions, Surprise Actions or Interactions','Death'];
var LINKS=[['Encounter rules','encounters'],['Survival levers','the-survival-levers'],['Rule 1: Damage Floor','rule-1-the-damage-floor'],['Rule 2: Wind-Up','rule-2-the-wind-up'],['Rule 3: Breaking Off','rule-3-breaking-off'],['Fatigue and recovery','chapter-4-fatigue-and-recovery'],['Resting','resting'],['Quick Reference','quick-reference'],['Glossary','glossary']];
X.rf=function(){var R=(window.AWX2&&window.AWX2.ref)||[];$('#m').innerHTML='<h2>Star Wars reference</h2><p class="meta">Starships, vehicles, droids, bounties and syndicates, copied from the Star Wars modules.</p>'+R.map(function(r){return '<details class="card"><summary>'+esc(r[0])+'</summary>'+r[1].map(function(l){return l.indexOf('## ')===0?'<h2>'+esc(l.slice(3))+'</h2>':'<div class="meta" style="margin:4px 0">'+esc(l)+'</div>'}).join('')+'</details>'}).join('')};
X.sc=function(){var h='<h2>Quick numbers</h2><div class="card"><div>Combat Defence = 12 + Agility rank − armour penalty</div><div>Magic DS = 10 + Senses or Presence rank</div><div>Natural 10 always succeeds (hits for double damage). Natural 1 always fails.</div><div>Advantage or Disadvantage: roll both dice twice and keep the better or worse pair.</div><div>Light rest returns magic points equal to Senses or Presence rank × 10.</div><div>At 0 HP: roll a d6 three times. Above 3 passes, below 3 fails, a 3 rerolls.</div><div>Wounds lower every attribute by 1 rank each. A fourth Wound is death.</div></div><h2>Fatigue</h2><div class="card">'+FAT.map(function(f,i){return '<div><b>'+i+'</b> '+f+'</div>'}).join('')+'</div><h2>Enemy encounter rules</h2><div class="card"><div>Enemy HP = 8 × enemy level.</div><div>Ordinary attacks per turn = enemy level.</div><div>Compare total enemy levels with one player character’s level.</div><div>Solo encounters: each ordinary enemy makes no more than one ordinary attack against the solo character per turn.</div><div>Bosses use their normal level in encounter calculations; no Boss Action or multiplier.</div><div>Specialist abilities are included in the enemy’s level.</div></div><h2>Campaign backup</h2><p class="meta">Export or restore player characters, GM tracker, NPCs, saved encounters, notes and preferences stored by this app on this device.</p><div class="row"><button class="pri" data-x="backup|">Export complete backup</button><label class="btn">Import backup<input id="awbackup" type="file" accept="application/json,.json" hidden></label></div><h2>Open in the rulebook</h2><div class="row">'+LINKS.map(function(l){return '<button data-x="go|'+l[1]+'">'+l[0]+'</button>'}).join('')+'</div>';$('#m').innerHTML=h};
var LOOT_CATS=['Weapons','Armour & Shields','Consumables','Equipment','Materials','Special Items','Currency'];
function lootBand(){return LO.L<3?'1-2':LO.L<5?'3-4':LO.L<7?'5-6':'7+'}
function lootTier(){return LO.L<3?1:LO.L<5?2:LO.L<7?3:4}
function lootCategory(x,theme){var n=(x.n||'').toLowerCase(),c=(x.c||'').toLowerCase(),e=(x.e||'').toLowerCase(),v=(n+' '+e).toLowerCase();
 if(/credit|coin|currency/.test(v))return 'Currency';
 if(/material|ore|hide|shard|wood|ingot|silk|scrap|herb/.test(c+' '+n))return 'Materials';
 if(/armour|armor|shield|vest|jacket|plate|mail|brigandine|buckler|robe|clothing/.test(v))return 'Armour & Shields';
 if(/weapon|sword|dagger|knife|axe|bow|crossbow|blaster|rifle|pistol|carbine|vibro|club|staff|spear|hammer|baton|slingshot|sling|trident|rapier|halberd|morningstar|mace|greatsword|thermal detonator/.test(c+' '+n))return 'Weapons';
 if(/potion|poison|medicine|medpac|bacta|antidote|stim|serum|toxin|tincture|salve|dose|patch|elixir|vial|oil|powder|consumable|heals|cures|restores|removes|instantly/.test(c+' '+n+' '+e))return 'Consumables';
 if(/utility|tool|kit|rope|ration|waterskin|bedroll|lockpick|tent|map|spyglass|toolbox|datapad|power cell|salvage|crafting|equipment/.test(c+' '+n))return 'Equipment';
 if(/magical|enhanced|enhancement|relic|crystal|wand|ring|amulet|cloak|boots|gem|charm|scroll|familiar|whistle|artifact|unique/.test(c+' '+n))return 'Special Items';
 return 'Equipment';}
function themeLoot(){var Z=window.AWLOOT,band=lootBand(),theme=LO.s,rows=[];
 if(theme==='fan'||theme==='mod'){var B=theme==='mod'?(Z.mod||{bands:{},wealth:[]}):Z;(B.bands[band]||[]).forEach(function(x){rows.push({n:x.n,c:x.c,e:x.e,v:x.v})});(B.wealth||[]).filter(function(x){return x.lv===+LO.L}).forEach(function(x){rows.push({n:x.n,c:'Currency',e:x.e,v:x.v})});
  if(theme==='fan'){(Z.extra.alc[band]||[]).forEach(function(x){rows.push(x)});}
  if(theme==='mod'){(Z.extra.med||[]).filter(function(x){return x.band===band}).forEach(function(x){rows.push(x)});(Z.extra.enh||[]).forEach(function(x){rows.push({n:x.n,c:'Special Items',e:x.e})});}
 }else{
  (Z.sw.tiers[String(lootTier())]||[]).forEach(function(n){rows.push({n:n,c:lootCategory({n:n},'sw'),e:''})});
  (Z.extra.med||[]).filter(function(x){return x.band===band}).forEach(function(x){rows.push(x)});
  (Z.sw.credits||[]).filter(function(x,i){return i===lootTier()-1}).forEach(function(x){rows.push({n:x.t,c:'Currency',e:x.f})});
 }
 return rows;}
X.lo=function(){var Z=window.AWLOOT;if(!Z||!Z.sw){$('#m').innerHTML='<p class="meta">Loot data is missing.</p>';return}
 var pool=themeLoot(),cats=LOOT_CATS,h='<h2>Loot</h2><p class="meta">GM tool · One loot table structure for every theme. Changing the theme changes the available items while keeping the same loot categories.</p>'+S('ls',[['fan','Fantasy'],['mod','Modern'],['sw','Star Wars']],LO.s)+'<div class="g3" style="margin-top:8px">'+S('ll',[1,2,3,4,5,6,7,8,9,10].map(function(l){return[l,'Level '+l]}),LO.L)+S('ln',[1,2,3,4,5,6,7,8,9,10].map(function(n){return[n,n+' item'+(n>1?'s':'')]}),LO.n)+'</div>'+S('lc',[['','All categories']].concat(cats.map(function(c){return[c,c]})),LO.c)+'<div class="row"><button class="pri" data-x="lr|f">Roll loot</button></div>';
 if(lootOut)h+=lootOut.map(function(x){return '<div class="card"><strong>'+esc(x.n)+'</strong> <span class="meta">'+esc(x.m||'')+'</span>'+(x.e?'<div>'+esc(x.e)+'</div>':'')+'</div>'}).join('');
 h+='<h2>Loot table · '+({fan:'Fantasy',mod:'Modern',sw:'Star Wars'}[LO.s])+' · Level '+LO.L+'</h2>';
 LOOT_CATS.forEach(function(c){var items=pool.filter(function(x){return lootCategory(x,LO.s)===c});h+='<details class="card"><summary>'+c+' ('+items.length+')</summary>'+(items.length?items.map(function(x){return '<div class="meta"><b>'+esc(x.n)+'</b>'+(x.v?' · '+esc(x.v):'')+(x.e?': '+esc(x.e):'')+'</div>'}).join(''):'<div class="meta">No entries at this level in this theme yet.</div>')+'</details>'});
 $('#m').innerHTML=h};
function pickRoll(k){var p=themeLoot().filter(function(x){return!LO.c||lootCategory(x,LO.s)===LO.c});if(!p.length)return[{n:'No entries in this category for this theme and level.',m:''}];var out=[];for(var i=0;i<LO.n&&p.length;i++){var x=p[Math.floor(Math.random()*p.length)];out.push({n:x.n,m:lootCategory(x,LO.s)+(x.v?' · value '+x.v:''),e:x.e||''})}return out}
function d10(){return Math.ceil(Math.random()*10)}
function swItem(tier){var r=d10(),n=window.AWLOOT.sw.tiers[tier][r-1],o=[{n:n,m:'Tier '+tier+' item · rolled '+r}];if(/^Credits/.test(n))o.push(swCred(tier));return o}
function swCred(tier){var c=window.AWLOOT.sw.credits[tier-1],mu=+((c.f.match(/x\s*([\d,]+)/)||[0,'1'])[1].replace(/,/g,'')),r=d10();return{n:(r*mu).toLocaleString()+' credits',m:c.t+' · rolled '+r+' × '+mu}}
function pickRoll(k){if(k==='x'){var p=xpool();if(!p.length)return[{n:'Nothing in this table for those choices.',m:''}];var x=p[Math.floor(Math.random()*p.length)];return[{n:x.n,m:x.c||'Enhancement',e:x.e}]}var Z=window.AWLOOT,band=LO.L<3?'1-2':LO.L<5?'3-4':LO.L<7?'5-6':'7+',tier=LO.L<3?1:LO.L<5?2:LO.L<7?3:4,o=[];
  if(k==='f'){var B2=LO.s==='mod'?(Z.mod||{bands:{},wealth:[]}):Z,pool=(B2.bands[band]||[]).filter(function(x){return!LO.c||x.c===LO.c});for(var i=0;i<LO.n&&pool.length;i++){var x=pool[Math.floor(Math.random()*pool.length)];o.push({n:x.n,m:x.c+(x.v?' · value '+x.v:''),e:x.e})}
    var w=B2.wealth.filter(function(x){return x.lv===+LO.L})[0];if(w)o.push({n:w.n,m:'Wealth · value '+w.v,e:w.e});return o}
  if(k==='i')return swItem(tier);if(k==='c')return[swCred(tier)];
  var loc=Z.sw.locs[LO.t],r=d10(),t=loc.rows[r-1];o.push({n:t,m:loc.n+' · rolled '+r});
  if(/tier table|restricted equipment/i.test(t))o=o.concat(swItem(tier));else if(/^Credits|roll the Credits/i.test(t))o.push(swCred(tier));return o}
function list(){return(pl||[]).filter(function(t){return!mcat||t.c===mcat})}
function revokeUrl(u){if(u&&String(u).indexOf('blob:')===0){try{URL.revokeObjectURL(u)}catch(e){}}}
var _blobUrls={};
function musicDb(){return new Promise(function(res,rej){var r=indexedDB.open('aw-music-v1',1);r.onupgradeneeded=function(){var db=r.result;if(!db.objectStoreNames.contains('tracks'))db.createObjectStore('tracks',{keyPath:'id'});if(!db.objectStoreNames.contains('files'))db.createObjectStore('files',{keyPath:'id'})};r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)}})}
function musicAll(){return musicDb().then(function(db){return new Promise(function(res,rej){var q=db.transaction('tracks','readonly').objectStore('tracks').getAll();q.onsuccess=function(){res(q.result||[])};q.onerror=function(){rej(q.error)}})})}
function musicPut(meta,blob){return musicDb().then(function(db){return new Promise(function(res,rej){var tx=db.transaction(['tracks','files'],'readwrite');tx.objectStore('tracks').put(meta);tx.objectStore('files').put({id:meta.id,blob:blob,mime:meta.mime||blob.type||'audio/mpeg'});tx.oncomplete=function(){res()};tx.onerror=function(){rej(tx.error)}})})}
function musicDel(id){return musicDb().then(function(db){return new Promise(function(res,rej){var tx=db.transaction(['tracks','files'],'readwrite');tx.objectStore('tracks').delete(id);tx.objectStore('files').delete(id);tx.oncomplete=function(){res()};tx.onerror=function(){rej(tx.error)}})})}
function musicGetFile(id){return musicDb().then(function(db){return new Promise(function(res,rej){var q=db.transaction('files','readonly').objectStore('files').get(id);q.onsuccess=function(){res(q.result||null)};q.onerror=function(){rej(q.error)}})})}
function musicLoad(){return musicAll().then(function(rows){pl=rows.sort(function(a,b){return (a.t||'').localeCompare(b.t||'')});return pl}).catch(function(){pl=[];return pl})}
function trackPlay(item){if(!item)return;au.loop=lp;function go(url){revokeUrl(au._awurl);au._awurl=url;au.src=url;var pr=au.play();if(pr&&pr.catch)pr.catch(function(){});if('mediaSession' in navigator){try{navigator.mediaSession.metadata=new MediaMetadata({title:item.t||'Track',artist:item.c||'After World'});navigator.mediaSession.setActionHandler('nexttrack',function(){X.nx(1)});navigator.mediaSession.setActionHandler('previoustrack',function(){X.nx(-1)})}catch(e){}}}
  if(item.blobUrl){go(item.blobUrl);return}
  if(item.f&&!item.id){go(item.f);return}
  musicGetFile(item.id).then(function(row){if(!row||!row.blob)return;var url=URL.createObjectURL(row.blob);item.blobUrl=url;_blobUrls[item.id]=url;go(url)}).catch(function(){})}
function track(a,b){if(b)trackPlay(b);else if(a){au.loop=lp;au.src=a;var pr=au.play();if(pr&&pr.catch)pr.catch(function(){})}}
X.nx=function(d){var l=list();if(!l.length)return;mi=(mi+d+l.length)%l.length;trackPlay(l[mi]);GM.render()};
au.onended=function(){if(!lp)X.nx(1)};
X.mu=function(){if(pl===null){$('#m').innerHTML='<p class="meta">Loading library…</p>';musicLoad().then(function(){GM.render()});return}
  var cats=[];pl.forEach(function(t){if(t.c&&cats.indexOf(t.c)<0)cats.push(t.c)});cats.sort();
  var l=list(),cur=l[mi]||null;
  var h='<h2>Music</h2><p class="meta">Upload tracks on this device. Files stay in this browser (IndexedDB) — they are not uploaded to a server. Only use music you have the right to play.</p>';
  h+='<div class="row"><label class="btn pri" style="flex:1;text-align:center;cursor:pointer">Upload tracks<input id="mupload" type="file" accept="audio/*,.mp3,.m4a,.ogg,.wav,.flac" multiple hidden></label></div>';
  h+='<div class="g3" style="margin-top:8px"><label class="f"><span>Default scene</span><input id="mnewcat" type="text" list="mscenes" placeholder="e.g. Combat, Tavern" value="'+esc(mcat||'')+'"></label><datalist id="mscenes">'+cats.map(function(c){return '<option value="'+esc(c)+'">'}).join('')+'</datalist></div>';
  if(pl.length){
    h+=S('mc',[['','All scenes']].concat(cats.map(function(c){return[c,c]})),mcat);
    h+='<p class="res">'+(cur&&!au.paused?'Playing: '+esc(cur.t):'Stopped')+(l.length?' · '+l.length+' in list':'')+'</p>';
    h+='<div class="row"><button data-x="mp|">'+(au.paused?'Play':'Pause')+'</button><button data-x="mb|">Back</button><button data-x="mn|">Next</button><button data-x="ml|">'+(lp?'Loop on':'Loop off')+'</button></div>';
    h+='<label class="f"><span>Volume</span><input data-xi="vol|" type="range" min="0" max="1" step="0.05" value="'+au.volume+'"></label>';
    l.forEach(function(t,i){
      h+='<div class="card" style="margin:8px 0"><button class="pk" data-x="mt|'+i+'" style="border:0;background:transparent;padding:0;width:100%"><strong>'+esc(t.t)+'</strong><small>'+esc((t.c||'Uncategorised')+(t.a?' · '+t.a:''))+'</small></button>';
      h+='<div class="row" style="margin-top:6px"><input data-xi="mtitle|'+t.id+'" type="text" value="'+esc(t.t)+'" placeholder="Title" style="flex:2"><input data-xi="mcat2|'+t.id+'" type="text" value="'+esc(t.c||'')+'" placeholder="Scene" style="flex:1"><button class="del" data-x="mdel|'+t.id+'">Remove</button></div></div>';
    });
  }else{
    h+='<p class="res">No tracks yet. Use Upload tracks to add MP3, M4A, OGG or WAV files.</p>';
  }
  $('#m').innerHTML=h;
  var up=$('#mupload');if(up)up.onchange=function(){X.mUpload(up.files)};
};
X.mUpload=function(files){if(!files||!files.length)return;var defCat=(($('#mnewcat')||{}).value||'').trim();var arr=[],i;for(i=0;i<files.length;i++)arr.push(files[i]);
  var chain=Promise.resolve();
  arr.forEach(function(file){if(!file||file.type&&file.type.indexOf('audio')!==0&&!/\.(mp3|m4a|ogg|wav|flac|aac)$/i.test(file.name))return;
    if(file.size>40*1024*1024){alert(file.name+' is larger than 40 MB and was skipped.');return}
    chain=chain.then(function(){var id='m'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);var title=file.name.replace(/\.[^.]+$/,'');var meta={id:id,t:title,c:defCat,a:'',mime:file.type||'audio/mpeg',size:file.size,added:Date.now()};return musicPut(meta,file)});
  });
  chain.then(function(){return musicLoad()}).then(function(){mi=-1;GM.render()}).catch(function(e){alert('Could not save tracks in this browser.');console.error(e)});
};
X.click=function(p,say){var a=p[0],g=p[1],G=GM;
  if(a==='backup'){var data={app:'After World',version:1,created:new Date().toISOString(),storage:{}};for(var bi=0;bi<localStorage.length;bi++){var bk=localStorage.key(bi);if(bk&&bk.indexOf('aw-')===0)data.storage[bk]=localStorage.getItem(bk)}var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='after-world-backup-'+new Date().toISOString().slice(0,10)+'.json';link.click();setTimeout(function(){URL.revokeObjectURL(url)},1000);return}
  if(a==='eadditem'){addEncounterEnemy();G.render();return}
  if(a==='erm'){ES.items.splice(+g,1);G.render();return}
  if(a==='eadd'){ES.items.forEach(function(x){var e=G.E[x.i];if(e)fillEnemy(e,x.cnt)});tr();return}
  if(a==='esv'){var nm=($('#enm').value||'').trim()||'Encounter',id=uid();enc[id]={id:id,n:nm,L:ES.L,th:ES.th,solo:ES.solo,sid:nt.active||null,items:ES.items.map(function(x){return{n:x.n,lv:x.lv,t:x.t,cnt:x.cnt}})};sv(EK,enc);G.render();return}
  if(a==='eld'){var c=enc[g];ES.L=c.L;ES.th=c.th;ES.solo=!!c.solo;ES.items=[];(c.items||[]).forEach(function(x){var i=G.E.findIndex(function(e){return e.n===x.n&&e.t===x.t&&e.lv===x.lv});if(i>=0)ES.items.push({i:i,n:x.n,lv:x.lv,t:x.t,cnt:x.cnt})});G.render();return}
  if(a==='eta'){ES.solo=!!enc[g].solo;savedFill(enc[g]);tr();return}
  if(a==='edl'){if(confirm('Delete this saved encounter?')){delete enc[g];sv(EK,enc);G.render()}return}
  if(a==='lga'){var t=($('#lgt').value||'').trim();if(t){nt.log.push({id:uid(),d:new Date().toLocaleString(),t:t,sid:nt.active||null});sv(NKY,nt)}G.render();return}
  if(a==='lg'){if(say){nt.log.push({id:uid(),d:new Date().toLocaleString(),t:say,sid:nt.active||null});sv(NKY,nt)}G.render();return}
  if(a==='lgd'){nt.log=nt.log.filter(function(l){return l.id!==g});sv(NKY,nt);G.render();return}
  if(a==='nna'){var n=uid();nt.notes[n]={id:n,t:'',b:'',sid:nt.active||null,upd:Date.now()};sv(NKY,nt);G.render();return}
  if(a==='nnd'){if(confirm('Delete this note?')){delete nt.notes[g];sv(NKY,nt);G.render()}return}
  if(a==='nsnew'){var nm2=($('#nsn').value||'').trim()||('Session '+new Date().toLocaleDateString()),id2=uid();nt.sessions[id2]={id:id2,n:nm2,date:new Date().toLocaleDateString(),created:Date.now()};nt.active=id2;sv(NKY,nt);G.render();return}
  if(a==='nsact'){var v=($('#nsel')||{}).value||'';nt.active=v||null;sv(NKY,nt);G.render();return}
  if(a==='nsren'){var nn=($('#nsrn').value||'').trim();if(nn&&nt.sessions[g]){nt.sessions[g].n=nn;sv(NKY,nt)}G.render();return}
  if(a==='nsdel'){if(confirm('Delete this session? Log entries and notes stay, but lose the session tag.')){delete nt.sessions[g];if(nt.active===g)nt.active=null;nt.log.forEach(function(l){if(l.sid===g)l.sid=null});Object.keys(nt.notes).forEach(function(id){if(nt.notes[id].sid===g)nt.notes[id].sid=null});Object.keys(enc).forEach(function(id){if(enc[id].sid===g)enc[id].sid=null});sv(NKY,nt);sv(EK,enc);G.render()}return}
  if(a==='go'){parent.postMessage({aw:'rule',hash:g},location.origin);return}
  if(a==='lr'){lootOut=pickRoll(g);G.render();return}
  if(a==='mt'){mi=+g;var l=list();trackPlay(l[mi]);G.render();return}
  if(a==='mp'){if(au.src){au.paused?au.play():au.pause()}else X.nx(1);setTimeout(G.render,50);return}
  if(a==='mn'){X.nx(1);return}if(a==='mb'){X.nx(-1);return}
  if(a==='ml'){lp=!lp;au.loop=lp;G.render();return}
  if(a==='mdel'){if(!confirm('Remove this track from the library?'))return;musicDel(g).then(function(){if(_blobUrls[g]){revokeUrl(_blobUrls[g]);delete _blobUrls[g]}return musicLoad()}).then(function(){mi=-1;au.pause();G.render()});return}
};
X.input=function(e){var t=e.target,id=t.id,x=t.dataset.xi;
  if(id==='el2'||id==='eth'||id==='een'||id==='ecnt'||id==='esolo'){ES.L=+($('#el2')||{}).value||ES.L;ES.th=$('#eth').value;ES.enemy=+$('#een').value;ES.count=Math.max(1,Math.min(50,+$('#ecnt').value||1));ES.solo=$('#esolo').checked;GM.render();return true}
  if(x&&x.indexOf('pk|')===0){ES.pk[+x.split('|')[1]]=+t.value;return true}
  if(id==='ll'||id==='ln'||id==='lc'||id==='ls'){var q=function(s){var e=$(s);return e?e.value:null};LO.s=q('#ls')||LO.s;LO.L=+q('#ll')||LO.L;LO.n=+q('#ln')||LO.n;LO.c=q('#lc')||'';lootOut=null;GM.render();return true}
  if(id==='mc'){mcat=t.value;mi=-1;GM.render();return true}
  if(x){var p=x.split('|');if(p[0]==='vol'){au.volume=+t.value;return true}
    if(p[0]==='mtitle'||p[0]==='mcat2'){var tid=p[1];var row=(pl||[]).filter(function(z){return z.id===tid})[0];if(row){if(p[0]==='mtitle')row.t=t.value;else row.c=t.value;musicDb().then(function(db){db.transaction('tracks','readwrite').objectStore('tracks').put({id:row.id,t:row.t,c:row.c||'',a:row.a||'',mime:row.mime||'',size:row.size||0,added:row.added||Date.now()})});}return true}
    if(p[0]==='nt'||p[0]==='nb'){var n=nt.notes[p[1]];if(n){n[p[0]==='nt'?'t':'b']=t.value;n.upd=Date.now();sv(NKY,nt)}return true}
    if(p[0]==='nsid'){var n2=nt.notes[p[1]];if(n2){n2.sid=t.value||null;n2.upd=Date.now();sv(NKY,nt)}return true}}
  return false};
document.addEventListener('change',function(e){if(e.target.id!=='awbackup')return;var f=e.target.files&&e.target.files[0];if(!f)return;if(f.size>10*1024*1024){alert('Backup is too large.');return}var r=new FileReader();r.onload=function(){try{var d=JSON.parse(r.result);if(d.app!=='After World'||!d.storage||typeof d.storage!=='object')throw 0;if(!confirm('Restore this backup? Existing After World data on this device will be replaced.'))return;Object.keys(localStorage).forEach(function(k){if(k.indexOf('aw-')===0)localStorage.removeItem(k)});Object.keys(d.storage).forEach(function(k){if(k.indexOf('aw-')===0&&typeof d.storage[k]==='string')localStorage.setItem(k,d.storage[k])});alert('Backup restored. The app will now reload.');location.reload()}catch(x){alert('This is not a valid After World backup.')}};r.readAsText(f)});
})();
