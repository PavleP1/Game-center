/* ---------- Territory Grab (paper.io style) ---------- */
function terr(el){const N=36,c=Math.min(innerWidth-28,400),u=c/N,cv=document.createElement('canvas'),info=div('info');cv.width=cv.height=c;el.append(info,cv);
const x=cv.getContext('2d'),COL=['#00e0c6','#ff4d6d','#ffd166','#7c5cff'];let own,tr,E,alive,tick,mx,tm;
const out=(a,b)=>a<0||b<0||a>=N||b>=N;
function spawn(i){let a,b;for(let t=0;t<40;t++){a=2+rand(N-4);b=2+rand(N-4);let ok=1;for(let y=-1;y<2;y++)for(let q=-1;q<2;q++)if(own[(b+y)*N+a+q]>=0)ok=0;if(ok)break}
for(let y=-1;y<2;y++)for(let q=-1;q<2;q++)own[(b+y)*N+a+q]=i;Object.assign(E[i],{x:a,y:b,dx:1,dy:0,t:[],live:1,hx:a,hy:b})}
function end(){alive=0;clearTimeout(tm);const p=Math.round(mx);best('terr',p);reward(p*2+5,p);info.textContent='Eliminated · Peak '+p+'%';draw()}
function kill(e){e.t.forEach(k=>tr[k]=-1);e.t=[];for(let k=0;k<N*N;k++)if(own[k]==e.id)own[k]=-1;e.live=0;e.rs=tick+25;if(e.id==0)end()}
function capture(e){e.t.forEach(k=>{own[k]=e.id;tr[k]=-1});e.t=[];const re=new Uint8Array(N*N),st=[];
const add=k=>{if(!re[k]&&own[k]!=e.id){re[k]=1;st.push(k)}};for(let i=0;i<N;i++){add(i);add((N-1)*N+i);add(i*N);add(i*N+N-1)}
while(st.length){const k=st.pop(),a=k%N,b=k/N|0;if(a>0)add(k-1);if(a<N-1)add(k+1);if(b>0)add(k-N);if(b<N-1)add(k+N)}
for(let k=0;k<N*N;k++)if(!re[k]&&own[k]!=e.id)own[k]=e.id}
function move(e){const nx=e.x+e.dx,ny=e.y+e.dy;if(out(nx,ny))return kill(e);const k=ny*N+nx;if(tr[k]==e.id)return kill(e);if(tr[k]>=0)kill(E[tr[k]]);
e.x=nx;e.y=ny;if(own[k]==e.id){if(e.t.length)capture(e)}else{tr[k]=e.id;e.t.push(k)}}
function ai(e){let d=[e.dx,e.dy];const wall=out(e.x+d[0]*2,e.y+d[1]*2);
if(e.t.length>10+e.id*4){const tx=e.hx-e.x,ty=e.hy-e.y;d=Math.abs(tx)>=Math.abs(ty)?[Math.sign(tx),0]:[0,Math.sign(ty)];if(!d[0]&&!d[1])d=[e.dx,e.dy]}
else if(wall||Math.random()<.1)d=e.dx?[0,Math.random()<.5?1:-1]:[Math.random()<.5?1:-1,0];
if(d[0]==-e.dx&&d[1]==-e.dy)d=e.dx?[0,1]:[1,0];if(out(e.x+d[0],e.y+d[1]))d=[-d[1],d[0]];e.dx=d[0];e.dy=d[1]}
function step(){if(!alive)return;tick++;E.forEach(e=>{if(!alive)return;if(!e.live){if(tick>e.rs)spawn(e.id);return}if(e.id)ai(e);move(e)});if(!alive)return;
let n=0;for(let k=0;k<N*N;k++)if(own[k]==0)n++;const p=n/N/N*100;mx=Math.max(mx,p);info.textContent=`Territory ${Math.round(p)}% · Best ${Math.max(Math.round(mx),S.best.terr||0)}%`;draw();tm=setTimeout(step,120)}
function draw(){x.fillStyle='#10162e';x.fillRect(0,0,c,c);for(let k=0;k<N*N;k++){const o=own[k],t=tr[k];if(t>=0)x.fillStyle=COL[t]+'88';else if(o>=0)x.fillStyle=COL[o]+'aa';else continue;x.fillRect(k%N*u,(k/N|0)*u,u,u)}
E.forEach(e=>{if(e.live){x.fillStyle='#fff';x.fillRect(e.x*u+1,e.y*u+1,u-2,u-2)}})}
swipe(cv,(a,b)=>{const p=E[0];if(p.live&&(a+p.dx||b+p.dy)){p.dx=a;p.dy=b}});
function reset(){clearTimeout(tm);own=new Int8Array(N*N).fill(-1);tr=new Int8Array(N*N).fill(-1);E=[0,1,2,3].map(id=>({id,t:[],live:0}));tick=0;mx=0;alive=1;E.forEach(e=>spawn(e.id));info.textContent='Swipe to steer · loop back home to claim land';draw();tm=setTimeout(step,700)}
newBtn(el,reset);reset();return()=>{alive=0;clearTimeout(tm)}}

/* ---------- Dungeon Crawler (RPG) ---------- */
function dungeon(el){S.rpg=S.rpg||{a:0,h:0,g:0};const R=S.rpg;let hp,mhp,f,en,eh,pot,log,over;
const out=div('info'),bar=div('row'),shp=div('');out.style.cssText='min-height:110px;line-height:1.6;color:var(--t)';el.append(out,bar,shp);
const atk=()=>4+R.a*2,eAtk=()=>Math.max(1,Math.round(1+f*1.4)+rand(3)-1);
const B=(t,fn)=>{const b=document.createElement('button');b.className='btn';b.textContent=t;b.onclick=fn;bar.append(b)};
function spawn(){en=['👹','🐺','💀','🐉','🧟'][rand(5)];eh=Math.round(8+f*6);log=en+' blocks the way on floor '+f+' (HP '+eh+')'}
function lose(){over=1;log='You fell on floor '+f+'.';reward(f*8,f*4)}
function hit(){if(over)return;const d=atk()+rand(3);eh-=d;log='You hit for '+d+'. ';if(eh<=0){const g=3+f*2;R.g+=g;best('dun',f);f++;log+=en+' defeated, +'+g+' gold. ';if(f%5==1){hp=mhp;log+='You rest to full HP. '}spawn()}else{const e=eAtk();hp-=e;log+='It hits you for '+e+'.'}if(hp<=0)lose();save();draw()}
function heal(){if(over||pot<1)return;pot--;hp=Math.min(mhp,hp+Math.round(mhp*.5));const e=eAtk();hp-=e;log='You drink a potion. It hits you for '+e+'.';if(hp<=0)lose();draw()}
function draw(){out.innerHTML=`❤️ ${hp}/${mhp} · ⚔️ ${atk()} · 🧪 ${pot} · 🪙 ${R.g} gold<br>${log}`;shp.innerHTML='';
[['🗡️ Sharper Sword','+2 attack','a',10+15*R.a],['🛡️ Stronger Armor','+10 max HP','h',10+15*R.h]].forEach(([n,d,k,c])=>{const b=document.createElement('button');b.className='up';b.disabled=R.g<c;b.innerHTML=`<span>${n} · Lv ${R[k]}<small>${d}</small></span><b>${c} gold</b>`;b.onclick=()=>{if(R.g>=c){R.g-=c;R[k]++;if(k=='h'){mhp+=10;hp+=10}save();draw()}};shp.append(b)})}
B('⚔️ Attack',hit);B('🧪 Heal',heal);
function reset(){mhp=30+R.h*10;hp=mhp;f=1;pot=3;over=0;spawn();draw()}
newBtn(el,reset);reset()}

/* ---------- Space Trader ---------- */
function trader(el){const G=[['🪨 Ore',20],['🍞 Food',10],['💾 Tech',60]];let day,cash,inv,pr,done;const info=div('info'),box=div('');el.append(info,box);
const roll=()=>pr=G.map(g=>Math.max(2,Math.round(g[1]*(.4+Math.random()*1.4)))),net=()=>cash+inv.reduce((a,n,i)=>a+n*pr[i],0);
function draw(){box.innerHTML='';const tot=inv.reduce((a,b)=>a+b,0);
if(day>30){const p=net()-100;best('trade',net());if(!done){done=1;reward(Math.max(5,p/8),Math.max(2,p/20))}info.textContent='Voyage over · Net worth '+net()+' · Profit '+p;return}
info.textContent=`Day ${day}/30 · 💰 ${cash} · Hold ${tot}/20 · Best ${S.best.trade||0}`;
G.forEach((g,i)=>{const r=div('row');r.innerHTML=`<b style="flex:1;align-self:center">${g[0]} ${pr[i]} · have ${inv[i]}</b>`;[['Buy',1],['Sell',-1]].forEach(([t,s])=>{const b=document.createElement('button');b.className='btn';b.textContent=t;b.onclick=()=>{if(s>0&&(cash<pr[i]||tot>=20))return;if(s<0&&!inv[i])return;cash-=s*pr[i];inv[i]+=s;draw()};r.append(b)});box.append(r)});
const f=document.createElement('button');f.className='btn nb';f.textContent='🚀 Fly to the next planet';f.onclick=()=>{day++;roll();draw()};box.append(f)}
function reset(){day=1;cash=100;inv=[0,0,0];done=0;roll();draw()}
newBtn(el,reset);reset()}

window.MORE=(window.MORE||[]).concat([
{id:'terr',n:'Territory Grab',i:'🟩',d:'Claim land, beat the bots',u:'%',run:terr},
{id:'dun',n:'Dungeon Crawler',i:'⚔️',d:'Fight, loot, level up',u:' floors',run:dungeon},
{id:'trade',n:'Space Trader',i:'🛸',d:'Buy low, sell high',u:' net',run:trader}]);
  
