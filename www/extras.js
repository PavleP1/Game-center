/* Loaded after the main script: adds sound, themes and achievements */
document.head.insertAdjacentHTML('beforeend','<style>body{background:radial-gradient(circle at 20% 0,var(--g1,#1d1650),var(--bg) 60%) fixed}.modal{cursor:pointer}.sheet{cursor:auto}</style>');

/* ---------- Sound (synthesized, no files) ---------- */
let ac;
function snd(f,d=.08,t='sine',v=.12){if(S.mute)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,ac.currentTime);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
document.addEventListener('pointerdown',e=>{if(e.target.closest('button,.card,.t,.cell'))snd(520,.05,'triangle',.06)},true);
function tsnd(){S.mute=!S.mute;save();home();snd(660,.1)}

/* ---------- Sheets ---------- */
function sheet(html){const m=div('modal');m.innerHTML='<div class="sheet">'+html+'<button class="btn nb" onclick="this.closest(\'.modal\').remove()">Close</button></div>';m.onclick=e=>{if(e.target==m)m.remove()};document.body.append(m)}

/* ---------- Achievements ---------- */
const ACH=[
['first','🎮 First Steps','Play a game',s=>s.plays>=1,25],
['p10','🕹️ Regular','Play 10 games',s=>s.plays>=10,50],
['p50','🏅 Hooked','Play 50 games',s=>s.plays>=50,200],
['try','🧩 Explorer','Try 10 different games',s=>Object.keys(s.tried||{}).length>=10,150],
['try2','🗺️ Collector','Try 25 different games',s=>Object.keys(s.tried||{}).length>=25,400],
['l3','⭐ Level 3','Reach level 3',()=>lvl()>=3,50],
['l10','🌟 Level 10','Reach level 10',()=>lvl()>=10,300],
['c500','💰 Saver','Hold 500 coins',s=>s.coins>=500,25],
['st3','🔥 Three days','Claim the daily reward 3 days in a row',s=>s.streak>=3,100],
['st7','🔥 One week','Claim the daily reward 7 days in a row',s=>s.streak>=7,300],
['boost','⚡ Boosted','Buy a boost',s=>s.up.xp+s.up.coin>=1,60],
['sk','🎨 Stylish','Unlock a second theme',s=>(s.skins||[]).length>1,80]];
function chk(){S.ach=S.ach||{};let n=0;ACH.forEach(a=>{if(!S.ach[a[0]]&&a[3](S)){S.ach[a[0]]=1;S.coins+=a[4];save();setTimeout(()=>{toast('🏅 '+a[1]+'  +'+a[4]+' 🪙');snd(660,.1);setTimeout(()=>snd(880,.1),90);setTimeout(()=>snd(1100,.2),180)},n++*2500)}})}
function awards(){S.ach=S.ach||{};const n=ACH.filter(a=>S.ach[a[0]]).length;sheet(`<h2 style="margin-bottom:12px">Awards · ${n}/${ACH.length}</h2><div style="max-height:55vh;overflow:auto">`+ACH.map(a=>{const d=S.ach[a[0]];return `<div class="up" style="opacity:${d?1:.5}"><span>${a[1]}<small>${a[2]}</small></span><b>${d?'✓':'+'+a[4]+' 🪙'}</b></div>`}).join('')+'</div>')}

/* ---------- Themes ---------- */
const TH=[['Nexora',0,'#7c5cff','#00e0c6','#1d1650'],['Sunset',200,'#ff7a45','#ffd166','#4a1d2e'],['Forest',200,'#2fbf71','#a3e635','#123524'],['Ocean',300,'#3b82f6','#22d3ee','#10234d'],['Royal',500,'#d4a017','#f5e6a8','#2e1f4d']];
function applyTh(){const t=TH[S.skin||0],s=document.documentElement.style;s.setProperty('--p',t[2]);s.setProperty('--a',t[3]);s.setProperty('--g1',t[4])}
function themes(){S.skins=S.skins||[0];sheet('<h2 style="margin-bottom:12px">Themes</h2>'+TH.map((t,i)=>{const own=S.skins.includes(i),on=(S.skin||0)==i;return `<button class="up" ${!own&&S.coins<t[1]?'disabled':''} onclick="pickTh(${i})"><span>${t[0]}<small>${on?'Equipped':own?'Tap to equip':'Tap to unlock'}</small></span><b style="color:${t[2]}">${own?'●':t[1]+' 🪙'}</b></button>`}).join(''))}
function pickTh(i){S.skins=S.skins||[0];if(!S.skins.includes(i)){if(S.coins<TH[i][1])return;S.coins-=TH[i][1];S.skins.push(i)}S.skin=i;save();applyTh();document.querySelector('.modal').remove();home();themes();chk()}

/* ---------- Hooks into the main script ---------- */
const _reward=reward;reward=function(a,b){_reward(a,b);snd(660,.12);setTimeout(()=>snd(880,.16),90);setTimeout(chk,2500)};
const _play=play;play=function(id){S.plays=(S.plays||0)+1;(S.tried=S.tried||{})[id]=1;save();_play(id);chk()};
const _daily=daily;daily=function(){_daily();setTimeout(chk,2500)};
const _buy=buy;buy=function(k){_buy(k);setTimeout(chk,300)};
const _home=home;home=function(){_home();const r=$('.row');if(!r)return;const x=div('row');x.style.marginTop='-4px';
[['🏅 Awards','awards()'],['🎨 Themes','themes()'],[S.mute?'🔇 Sound off':'🔊 Sound on','tsnd()']].forEach(([t,f])=>{const b=document.createElement('button');b.className='btn alt';b.style.flex='1';b.textContent=t;b.setAttribute('onclick',f);x.append(b)});r.after(x)};
window.onpopstate=home;
applyTh();home();
