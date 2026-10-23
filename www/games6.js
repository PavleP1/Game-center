/* ---------- Monster Tamer ---------- */
function monsters(el){S.mon=S.mon||[{e:'🐣',l:1,x:0}];const R=S.mon,out=div('info'),bar=div('row');out.style.cssText='min-height:130px;line-height:1.6;color:var(--t)';el.append(out,bar);
let w,wh,wm,ph,pm,balls,log,over;const lead=()=>R.reduce((a,b)=>b.l>a.l?b:a),foe=()=>2+Math.round(w.l*1.6)+rand(2);
const B=(t,fn)=>{const b=document.createElement('button');b.className='btn';b.textContent=t;b.onclick=fn;bar.append(b)};
function draw(){const L=lead();out.innerHTML=`${L.e} Lv ${L.l} ❤️ ${Math.max(0,ph)}/${pm} &nbsp;vs&nbsp; ${w.e} Lv ${w.l} ❤️ ${Math.max(0,wh)}/${wm}<br>🎒 Team ${R.length}/12 · 🥎 Balls ${balls}<br>${log}`}
function enc(){const L=lead(),l=Math.max(1,L.l+rand(3)-1);w={e:['🐲','🦊','🐸','🦄','🐙','🦖','🐧','🐺'][rand(8)],l};wm=wh=14+l*7;pm=ph=20+L.l*8;balls=2;over=0;log='A wild '+w.e+' appears!';draw()}
function counter(){const e=foe();ph-=e;log+=` It hits for ${e}.`;if(ph<=0){over=1;log='Your '+lead().e+' fainted…';reward(2,1)}}
function atk(){if(over)return;const L=lead(),d=3+L.l*2+rand(3);wh-=d;log='You hit for '+d+'.';
if(wh<=0){over=1;L.x+=w.l;while(L.x>=L.l*3){L.x-=L.l*3;L.l++}log='Victory! '+L.e+' is now Lv '+L.l;reward(8+w.l*3,4+w.l)}else counter();save();draw()}
function snag(){if(over||balls<1)return;balls--;if(Math.random()<.15+.7*(1-wh/wm)){if(R.length<12)R.push({e:w.e,l:w.l,x:0});over=1;log='Caught '+w.e+'!';reward(15,8);best('mon',R.length)}else{log='It broke free!';counter()}save();draw()}
B('⚔️ Attack',atk);B('🥎 Catch',snag);newBtn(el,enc);el.lastChild.textContent='Next battle';enc()}

/* ---------- Card Battler ---------- */
function cards(el){let hp,eh,f,hand,blk,over;const out=div('info'),bd=div('row');out.style.cssText='line-height:1.6;color:var(--t)';el.append(out,bd);
const deal=()=>hand=[0,0,0].map(()=>({t:rand(3),v:2+rand(7)}));
function draw(m){out.innerHTML=`❤️ ${hp} · 🛡️ ${blk} &nbsp;vs&nbsp; 👾 ${eh} · Floor ${f}<br>${m||'Pick a card'}`;bd.innerHTML='';hand.forEach((c,i)=>{const b=document.createElement('button');b.className='btn';b.style.fontSize='20px';b.textContent=['⚔️','🛡️','💚'][c.t]+c.v;b.disabled=over;b.onclick=()=>play(i);bd.append(b)})}
function play(i){const c=hand[i];let m='';if(c.t==0){eh-=c.v+1;m='You strike for '+(c.v+1)+'. '}else if(c.t==1){blk+=c.v;m='You raise a shield. '}else{hp=Math.min(30,hp+c.v);m='You heal '+c.v+'. '}
if(eh<=0){f++;eh=18+f*7;blk=0;hp=Math.min(30,hp+4);best('card',f-1);m='Enemy defeated! A stronger one steps up.'}else{const a=2+rand(4)+f,d=Math.max(0,a-blk);blk=Math.max(0,blk-a);hp-=d;m+='It hits for '+d+'. '}
if(hp<=0){over=1;reward(f*10,f*5);m='You fell on floor '+f+'.'}deal();draw(m)}
function reset(){hp=30;f=1;eh=25;blk=0;over=0;deal();draw()}
newBtn(el,reset);reset()}

/* ---------- Lights Out ---------- */
function lights(el){let g,mv,done;const info=div('info'),bd=div('b4');bd.style.gridTemplateColumns='repeat(5,1fr)';el.append(info,bd);
const tog=i=>{const r=i/5|0,c=i%5;[[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const R=r+a,C=c+b;if(R>=0&&R<5&&C>=0&&C<5)g[R*5+C]^=1})};
function draw(){bd.innerHTML='';g.forEach((v,i)=>{const t=div('t');t.style.background=v?'#ffd166':'#1b2245';t.onclick=()=>{if(done)return;tog(i);mv++;draw();if(!g.some(x=>x)){done=1;if(!S.best.lights||mv<S.best.lights){S.best.lights=mv;save()}reward(Math.max(10,50-mv),Math.max(5,25-mv/2));info.textContent='Solved in '+mv+' moves!'}};bd.append(t)});if(!done)info.textContent='Turn every light off · Moves '+mv}
function reset(){g=Array(25).fill(0);for(let i=0;i<8;i++)tog(rand(25));if(!g.some(x=>x))tog(12);mv=0;done=0;draw()}
newBtn(el,reset);reset()}

/* ---------- Reaction Rush ---------- */
function react(el){const box=div('cell'),info=div('info');box.style.cssText='width:100%;max-width:340px;aspect-ratio:1;margin:16px auto;font-size:22px;text-align:center;padding:12px';el.append(info,box);let st,t0,tm,rs,n;
const paint=(c,t)=>{box.style.background=c;box.textContent=t};
function wait(){st=1;paint('#7c5cff','Wait for green…');tm=setTimeout(()=>{st=2;t0=performance.now();paint('#00c46a','TAP!')},1000+rand(2500))}
box.onpointerdown=()=>{if(st==1){clearTimeout(tm);st=0;paint('#ff4d6d','Too early! Tap to retry');return}
if(st==2){const ms=Math.round(performance.now()-t0);rs.push(ms);n++;if(n==5){const a=Math.round(rs.reduce((p,q)=>p+q)/5);st=3;paint('#232a4d',a+' ms average');if(!S.best.react||a<S.best.react){S.best.react=a;save()}reward(Math.max(10,60-a/10),Math.max(5,30-a/20));info.textContent='Best '+S.best.react+' ms'}else{st=0;paint('#232a4d',ms+' ms · tap for the next round');info.textContent='Round '+(n+1)+' of 5'}return}
if(st==0)wait()};
function reset(){clearTimeout(tm);rs=[];n=0;st=0;paint('#232a4d','Tap to start');info.textContent='5 rounds · lower is better'}
newBtn(el,reset);reset();return()=>clearTimeout(tm)}

/* ---------- Higher or Lower ---------- */
function hilo(el){let c,s;const info=div('info'),big=div('cell'),row=div('row');big.style.cssText='width:140px;margin:10px auto;font-size:56px';el.append(info,big,row);
const draw=()=>{big.textContent=c;info.textContent=`Streak ${s} · Best ${S.best.hilo||0}`};
const go=up=>{if(s<0)return;let n;do n=1+rand(13);while(n==c);if((n>c)==up){s++;c=n;best('hilo',s);draw()}else{big.textContent=n;info.textContent='Wrong! Final streak '+s;if(s)reward(s*6,s*3);s=-1}};
['⬆️ Higher','⬇️ Lower'].forEach((t,i)=>{const b=document.createElement('button');b.className='btn';b.textContent=t;b.onclick=()=>go(!i);row.append(b)});
function reset(){c=1+rand(13);s=0;draw()}
newBtn(el,reset);reset()}

window.MORE=(window.MORE||[]).concat([
{id:'mon',n:'Monster Tamer',i:'🐲',d:'Battle, catch, level up',u:' monsters',run:monsters},
{id:'card',n:'Card Battler',i:'🃏',d:'Play your hand to win',u:' floors',run:cards},
{id:'hero',n:'Idle Hero',i:'🏆',d:'Train a legend, earn offline',u:' upgrades',run:mkIdle('hero','🏆',[['🗡️ Training','+1 per tap',10,1.5,0,1],['🛡️ Squire','+3 per second',40,1.55,3,0],['🧙 Wizard','+16 per second',320,1.6,16,0],['🐉 Dragon Rider','+90 per second',3000,1.7,90,0]])},
{id:'lights',n:'Lights Out',i:'💡',d:'Switch every light off',u:' moves',run:lights},
{id:'react',n:'Reaction Rush',i:'⚡',d:'How fast are you?',u:' ms',run:react},
{id:'hilo',n:'Higher or Lower',i:'🎴',d:'Guess the next card',u:' streak',run:hilo}]);
