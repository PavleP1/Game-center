/* ---------- Idle builder: one engine, four games ---------- */
function mkIdle(id,cur,ups){return el=>{S.idle=S.idle||{};const E=S.idle[id]=S.idle[id]||{c:0,at:0,u:ups.map(()=>0)};
const cost=i=>Math.floor(ups[i][2]*ups[i][3]**E.u[i]),rate=()=>ups.reduce((a,u,i)=>a+u[4]*E.u[i],0),tap=()=>1+ups.reduce((a,u,i)=>a+u[5]*E.u[i],0);
if(E.at){const g=Math.floor(Math.min((Date.now()-E.at)/1e3,28800)*rate());if(g>0){E.c+=g;toast('Welcome back! +'+g+' '+cur)}}E.at=Date.now();
const info=div('info'),big=document.createElement('button'),list=div('');big.className='tap';big.textContent=cur;el.append(info,big,list);
const bs=ups.map((u,i)=>{const b=document.createElement('button');b.className='up';b.onclick=()=>{if(E.c>=cost(i)){E.c-=cost(i);E.u[i]++;upd()}};list.append(b);return b});
const cash=document.createElement('button');cash.className='btn nb';cash.textContent='💰 Cash out for coins & XP';cash.onclick=()=>{if(E.c<100)return toast('Need 100 '+cur);const g=Math.floor(E.c);E.c=0;reward(g/30,g/12);upd()};list.append(cash);
function upd(){info.textContent=Math.floor(E.c)+' '+cur+' · '+rate()+' per second · earns while away';bs.forEach((b,i)=>{b.disabled=E.c<cost(i);b.innerHTML=`<span>${ups[i][0]} · Lv ${E.u[i]}<small>${ups[i][1]}</small></span><b>${cost(i)} ${cur}</b>`});S.best[id]=E.u.reduce((a,b)=>a+b,0);save()}
big.onclick=()=>{E.c+=tap();upd()};const iv=setInterval(()=>{E.c+=rate();E.at=Date.now();upd()},1000);upd();
return()=>{clearInterval(iv);E.at=Date.now();save()}}}

/* ---------- Minesweeper ---------- */
function mines(el){const N=8,M=10;let g,over,flag=0,first;const info=div('info'),bd=div('b4'),tg=document.createElement('button');bd.style.cssText='grid-template-columns:repeat(8,1fr);gap:3px;padding:5px';tg.className='btn nb';tg.textContent='⛏️ Dig mode';tg.onclick=()=>{flag=!flag;tg.textContent=flag?'🚩 Flag mode':'⛏️ Dig mode'};el.append(info,bd,tg);
const nb=i=>{const r=i/N|0,c=i%N,a=[];for(let y=-1;y<2;y++)for(let x=-1;x<2;x++){const R=r+y,C=c+x;if((y||x)&&R>=0&&R<N&&C>=0&&C<N)a.push(R*N+C)}return a};
function gen(s){let k=0;while(k<M){const i=rand(N*N);if(i!=s&&!g[i].m){g[i].m=1;k++}}g.forEach((c,i)=>c.n=nb(i).filter(j=>g[j].m).length)}
function dig(i){if(over||g[i].o||g[i].f)return;if(first){gen(i);first=0}if(g[i].m){over=1;g.forEach(c=>{if(c.m)c.o=1});reward(3,1);return draw('Boom!')}
const st=[i];while(st.length){const j=st.pop();if(g[j].o)continue;g[j].o=1;if(!g[j].n)nb(j).forEach(k=>{if(!g[k].o&&!g[k].f)st.push(k)})}
if(g.filter(c=>c.o).length==N*N-M){over=1;S.best.mines=(S.best.mines||0)+1;reward(40,25);return draw('Cleared!')}draw()}
function draw(m){bd.innerHTML='';g.forEach((c,i)=>{const t=div('t');t.style.cssText='font-size:16px;border-radius:6px;background:'+(c.o?'#232a4d':'#3a4585');t.textContent=c.o?(c.m?'💣':c.n||''):c.f?'🚩':'';t.onclick=()=>{if(flag){if(!over&&!c.o){c.f=!c.f;draw()}}else dig(i)};bd.append(t)});info.textContent=m||`Wins ${S.best.mines||0} · ${M} mines`}
function reset(){g=[...Array(N*N)].map(()=>({m:0,o:0,f:0,n:0}));over=0;first=1;draw()}
newBtn(el,reset);reset()}

/* ---------- Simon Says ---------- */
function simon(el){const C=['#ff4d6d','#00e0c6','#ffd166','#7c5cff'];let seq,pos,lock,tms=[];const info=div('info'),bd=div('b3');bd.style.gridTemplateColumns='1fr 1fr';const bt=C.map((c,i)=>{const b=div('cell');b.style.background=c+'55';b.onpointerdown=()=>press(i);bd.append(b);return b});el.append(info,bd);
const T=(f,ms)=>tms.push(setTimeout(f,ms)),lit=(i,ms)=>{bt[i].style.background=C[i];T(()=>bt[i].style.background=C[i]+'55',ms)};
function show(){lock=1;pos=0;info.textContent='Watch…';seq.forEach((s,k)=>T(()=>lit(s,350),600+k*600));T(()=>{lock=0;info.textContent='Your turn · Round '+seq.length},600+seq.length*600)}
function press(i){if(lock)return;lit(i,150);if(i!=seq[pos]){lock=1;const r=seq.length-1;best('simon',r);if(r)reward(r*8,r);info.textContent='Missed · You reached round '+r;return}if(++pos==seq.length){seq.push(rand(4));lock=1;T(show,700)}}
function reset(){tms.forEach(clearTimeout);seq=[rand(4)];show()}
newBtn(el,reset);reset();return()=>tms.forEach(clearTimeout)}

/* ---------- 3D helpers ---------- */
function gl(el){const W=Math.min(innerWidth-28,420),H=Math.round(W*1.3),r=new THREE.WebGLRenderer({antialias:true});r.setSize(W,H);r.domElement.style.cssText='display:block;margin:auto;border-radius:16px;touch-action:none';const info=div('info'),sc=new THREE.Scene();sc.background=new THREE.Color(0x0b1020);sc.add(new THREE.AmbientLight(0xffffff,.65));const d=new THREE.DirectionalLight(0xffffff,.8);d.position.set(3,8,5);sc.add(d);el.append(info,r.domElement);return{W,H,r,sc,info}}

/* ---------- 3D Runner ---------- */
function runner3d(el){const{W,H,r,sc,info}=gl(el);sc.fog=new THREE.Fog(0x0b1020,10,45);const cam=new THREE.PerspectiveCamera(60,W/H,.1,100);cam.position.set(0,4,7);cam.lookAt(0,0,-6);
const gr=new THREE.Mesh(new THREE.PlaneGeometry(8,120),new THREE.MeshLambertMaterial({color:0x151b34}));gr.rotation.x=-Math.PI/2;gr.position.z=-40;sc.add(gr);
const pl=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshLambertMaterial({color:0x00e0c6}));sc.add(pl);
const lines=[...Array(12)].map((_,i)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.2,.02,2),new THREE.MeshBasicMaterial({color:0x7c5cff}));m.position.set(0,.02,-i*8);sc.add(m);return m});
let lane,h,vy,obs=[],dist,alive,next;
const score=()=>Math.floor(dist/5);
function reset(){obs.forEach(o=>sc.remove(o));obs=[];lane=0;h=0;vy=0;dist=0;alive=1;next=-30;pl.position.set(0,.5,0);info.textContent='Swipe ← → to dodge, ↑ to jump'}
swipe(r.domElement,(a,b)=>{if(!alive)return;if(a)lane=Math.max(-1,Math.min(1,lane+a));else if(b<0&&h==0)vy=.24});
function step(k){if(!alive)return;const s=(.28+dist*.00004)*k;dist+=s;next+=s;
if(next>-50){const o=new THREE.Mesh(new THREE.BoxGeometry(1.4,1,1.4),new THREE.MeshLambertMaterial({color:0xff4d6d}));o.position.set((rand(3)-1)*2.4,.5,-70);sc.add(o);obs.push(o);next=-50-(14-Math.min(7,dist/80))}
lines.forEach(m=>{m.position.z+=s;if(m.position.z>6)m.position.z-=96});
if(h>0||vy>0){h+=vy*k;vy-=.014*k;if(h<=0){h=0;vy=0}}
pl.position.x+=(lane*2.4-pl.position.x)*Math.min(.5,.25*k);pl.position.y=.5+h;
obs.forEach(o=>{o.position.z+=s;if(Math.abs(o.position.z)<1.1&&Math.abs(o.position.x-pl.position.x)<1.1&&h<.6)die()});
obs=obs.filter(o=>{if(o.position.z>10){sc.remove(o);return false}return true});
if(alive)info.textContent='Distance '+score()+' · Best '+Math.max(score(),S.best.run3d||0)}
function die(){alive=0;best('run3d',score());if(score())reward(score()/3,score()/8);info.textContent='Crashed · Distance '+score()}
newBtn(el,reset);reset();const stop=loopf(step,()=>r.render(sc,cam));return()=>{stop();r.dispose()}}

/* ---------- 3D Stack Tower ---------- */
function stack3d(el){const{W,H,r,sc,info}=gl(el);const cam=new THREE.OrthographicCamera(-5,5,5*H/W,-5*H/W,.1,100);let L,n,m,ms=[],alive,cy;
const box=(b,i)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(b.w,.5,b.d),new THREE.MeshLambertMaterial({color:new THREE.Color().setHSL((i*.035)%1,.7,.6)}));o.position.set(b.x,i*.5,b.z);sc.add(o);ms.push(o);return o};
function spawn(){const t=L[n-1],ax=n%2?'x':'z';m={ax,p:-4,dir:1,o:box({x:t.x,z:t.z,w:t.w,d:t.d},n)};if(ax=='x')m.o.position.x=-4;else m.o.position.z=-4}
function reset(){ms.forEach(o=>sc.remove(o));ms=[];L=[{x:0,z:0,w:3,d:3}];n=1;alive=1;cy=0;box(L[0],0);spawn();info.textContent='Tap to place the block'}
r.domElement.onpointerdown=()=>{if(!alive)return;const t=L[n-1],ax=m.ax,s=ax=='x'?t.w:t.d,dl=m.p-t[ax],ov=s-Math.abs(dl);
if(ov<=.05){alive=0;best('stack',n-1);if(n>1)reward((n-1)*5,n-1);info.textContent='Tower fell · Height '+(n-1);return}
const nb={x:t.x,z:t.z,w:t.w,d:t.d};nb[ax]=t[ax]+dl/2;if(ax=='x')nb.w=ov;else nb.d=ov;sc.remove(m.o);ms.pop();L.push(nb);box(nb,n);n++;spawn();info.textContent='Height '+(n-1)+' · Best '+Math.max(n-1,S.best.stack||0)};
function step(k){if(!alive)return;m.p+=m.dir*.09*k*(1+n*.02);if(Math.abs(m.p)>4){m.dir=-m.dir;m.p=Math.sign(m.p)*4}m.o.position[m.ax]=m.p;cy+=(n*.5-cy)*.1*Math.min(1,k)}
function draw(){cam.position.set(6,6+cy,6);cam.lookAt(0,cy,0);r.render(sc,cam)}
newBtn(el,reset);reset();const stop=loopf(step,draw);return()=>{stop();r.dispose()}}

window.MORE=(window.MORE||[]).concat([
{id:'bake',n:'Cookie Bakery',i:'🍪',d:'Bake, upgrade, expand',u:' upgrades',run:mkIdle('bake','🍪',[['🥖 Rolling Pin','+1 per tap',10,1.5,0,1],['🔥 Oven','+2 per second',30,1.55,2,0],['🏪 Bakery Shop','+10 per second',250,1.6,10,0],['🏭 Cookie Factory','+60 per second',2000,1.7,60,0]])},
{id:'mine',n:'Mine Tycoon',i:'⛏️',d:'Dig deeper for riches',u:' upgrades',run:mkIdle('mine','🪨',[['⛏️ Sharp Pick','+1 per tap',10,1.5,0,1],['🚜 Digger','+3 per second',40,1.55,3,0],['💣 Blast Crew','+15 per second',300,1.6,15,0],['🏗️ Deep Drill','+80 per second',2500,1.7,80,0]])},
{id:'space',n:'Space Miner',i:'🚀',d:'Harvest asteroid fields',u:' upgrades',run:mkIdle('space','☄️',[['🔭 Scanner','+2 per tap',15,1.5,0,2],['🛰️ Probe','+4 per second',50,1.55,4,0],['🚀 Mining Ship','+25 per second',400,1.6,25,0],['🌌 Star Base','+120 per second',3500,1.7,120,0]])},
{id:'zoo',n:'Zoo Manager',i:'🦁',d:'Grow your own zoo',u:' upgrades',run:mkIdle('zoo','🎟️',[['📢 Ticket Booth','+1 per tap',10,1.5,0,1],['🐒 Monkey Pen','+2 per second',35,1.55,2,0],['🦁 Lion Habitat','+12 per second',280,1.6,12,0],['🐘 Elephant Park','+70 per second',2200,1.7,70,0]])},
{id:'mines',n:'Minesweeper',i:'💣',d:'Clear the field',u:' wins',run:mines},
{id:'simon',n:'Simon Says',i:'🎵',d:'Repeat the pattern',u:' rounds',run:simon},
{id:'run3d',n:'Neon Runner 3D',i:'🏃',d:'Dodge and jump in 3D',u:' m',run:runner3d},
{id:'stack',n:'Stack Tower 3D',i:'🗼',d:'Build it sky high',u:' floors',run:stack3d}]);
                
