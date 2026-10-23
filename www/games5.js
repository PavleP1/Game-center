const mk3=(g,c)=>new THREE.Mesh(g,new THREE.MeshLambertMaterial({color:c}));

/* ---------- Space Shooter 3D ---------- */
function shooter3d(el){const{W,H,r,sc,info}=gl(el);sc.fog=new THREE.Fog(0x0b1020,15,60);const cam=new THREE.PerspectiveCamera(60,W/H,.1,100);cam.position.set(0,6,8);cam.lookAt(0,0,-4);
const sh=mk3(new THREE.ConeGeometry(.6,1.6,4),0x00e0c6),bg=new THREE.BoxGeometry(.2,.2,.8),eg=new THREE.BoxGeometry(1.2,1,1.2);sh.rotation.x=-Math.PI/2;sc.add(sh);
let px,B,Em,pts,lives,fc,sp,alive;const rm=(a,i)=>{sc.remove(a[i]);a.splice(i,1)};
function reset(){[...(B||[]),...(Em||[])].forEach(m=>sc.remove(m));B=[];Em=[];px=0;pts=0;lives=3;fc=0;sp=0;alive=1;sh.position.set(0,.4,0)}
r.domElement.onpointermove=r.domElement.onpointerdown=e=>{px=((e.clientX-r.domElement.getBoundingClientRect().left)/W*2-1)*6};
function die(){alive=0;best('shoot',pts);if(pts)reward(pts*3,pts);info.textContent='Destroyed · Score '+pts}
function step(k){if(!alive)return;sh.position.x+=(px-sh.position.x)*Math.min(.6,.3*k);fc+=k;if(fc>12){fc=0;const b=mk3(bg,0xffd166);b.position.set(sh.position.x,.4,-1);sc.add(b);B.push(b)}
sp-=k;if(sp<=0){sp=Math.max(22,60-pts*.6);const e=mk3(eg,0xff4d6d);e.position.set((Math.random()*2-1)*6,.5,-60);sc.add(e);Em.push(e)}
B.forEach(b=>b.position.z-=k);for(let i=B.length-1;i>=0;i--)if(B[i].position.z<-60)rm(B,i);
const v=(.3+pts*.004)*k;for(let i=Em.length-1;i>=0;i--){const e=Em[i];e.position.z+=v;let hit=0;
for(let j=B.length-1;j>=0;j--)if(Math.abs(B[j].position.x-e.position.x)<.9&&Math.abs(B[j].position.z-e.position.z)<1){rm(B,j);hit=1;break}
if(hit){rm(Em,i);pts++;continue}
if(e.position.z>1.5||(Math.abs(e.position.x-sh.position.x)<1.1&&Math.abs(e.position.z)<1)){rm(Em,i);lives--;if(lives<=0)die()}}
if(alive)info.textContent=`Score ${pts} · Lives ${lives} · Best ${Math.max(pts,S.best.shoot||0)}`}
newBtn(el,reset);reset();const stop=loopf(step,()=>r.render(sc,cam));return()=>{stop();r.dispose()}}

/* ---------- Cube Dash 3D ---------- */
function dash3d(el){const{W,H,r,sc,info}=gl(el);const cam=new THREE.PerspectiveCamera(50,W/H,.1,100);cam.position.set(0,3,13);cam.lookAt(0,1.5,0);
const fl=mk3(new THREE.BoxGeometry(40,.5,3),0x151b34),cb=mk3(new THREE.BoxGeometry(1,1,1),0x00e0c6);fl.position.y=-.25;sc.add(fl,cb);
let y,vy,ob,dist,alive,nx;const score=()=>Math.floor(dist/3);
function reset(){(ob||[]).forEach(o=>sc.remove(o));ob=[];y=0;vy=0;dist=0;alive=1;nx=0;cb.rotation.z=0;cb.position.set(-4,.5,0)}
r.domElement.onpointerdown=()=>{if(y==0&&alive)vy=.3};
function die(){alive=0;best('dash',score());if(score())reward(score()/2,score()/6);info.textContent='Crashed · Score '+score()}
function step(k){if(!alive)return;const s=(.22+dist*.00005)*k;dist+=s;nx-=s;
if(nx<=0){const h=1+rand(2)*.8,o=mk3(new THREE.BoxGeometry(1,h,1),0xff4d6d);o.position.set(14,h/2,0);o.h=h;sc.add(o);ob.push(o);nx=7+rand(5)+Math.min(4,dist/60)}
if(y>0||vy>0){y+=vy*k;vy-=.02*k;cb.rotation.z-=.1*k;if(y<=0){y=0;vy=0;cb.rotation.z=Math.round(cb.rotation.z/(Math.PI/2))*Math.PI/2}}cb.position.y=.5+y;
for(let i=ob.length-1;i>=0;i--){const o=ob[i];o.position.x-=s;if(Math.abs(o.position.x+4)<.9&&y<o.h-.1)die();if(o.position.x<-12){sc.remove(o);ob.splice(i,1)}}
if(alive)info.textContent='Score '+score()+' · Tap to jump · Best '+Math.max(score(),S.best.dash||0)}
newBtn(el,reset);reset();const stop=loopf(step,()=>r.render(sc,cam));return()=>{stop();r.dispose()}}

/* ---------- Tunnel Racer 3D ---------- */
function tunnel3d(el){const{W,H,r,sc,info}=gl(el);sc.fog=new THREE.Fog(0x0b1020,8,50);const cam=new THREE.PerspectiveCamera(70,W/H,.1,100);cam.position.set(0,0,5);
const sh=mk3(new THREE.ConeGeometry(.4,1.2,3),0xffd166);sh.rotation.x=-Math.PI/2;sc.add(sh);
const rings=[...Array(10)].map((_,i)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(5,.08,6,24),new THREE.MeshBasicMaterial({color:0x7c5cff}));m.position.z=-i*7;sc.add(m);return m});
let tx,ty,ob,dist,alive,nx;const score=()=>Math.floor(dist/4);
r.domElement.onpointermove=r.domElement.onpointerdown=e=>{const q=r.domElement.getBoundingClientRect();tx=((e.clientX-q.left)/W*2-1)*3.5;ty=-((e.clientY-q.top)/H*2-1)*3.5};
function reset(){(ob||[]).forEach(o=>sc.remove(o));ob=[];tx=ty=0;dist=0;alive=1;nx=0;sh.position.set(0,0,0)}
function die(){alive=0;best('tunnel',score());if(score())reward(score()/2,score()/6);info.textContent='Crashed · Score '+score()}
function step(k){if(!alive)return;const s=(.35+dist*.00006)*k;dist+=s;nx+=s;
if(nx>8){nx=0;const o=mk3(new THREE.BoxGeometry(1.6,1.6,1.6),0xff4d6d);o.position.set((Math.random()*2-1)*3.5,(Math.random()*2-1)*3.5,-60);sc.add(o);ob.push(o)}
rings.forEach(m=>{m.position.z+=s;if(m.position.z>6)m.position.z-=70});
sh.position.x+=(tx-sh.position.x)*.2*Math.min(1.5,k);sh.position.y+=(ty-sh.position.y)*.2*Math.min(1.5,k);
for(let i=ob.length-1;i>=0;i--){const o=ob[i];o.position.z+=s;o.rotation.x+=.02;if(Math.abs(o.position.z)<1.2&&Math.abs(o.position.x-sh.position.x)<1.2&&Math.abs(o.position.y-sh.position.y)<1.2)die();if(o.position.z>6){sc.remove(o);ob.splice(i,1)}}
if(alive)info.textContent='Score '+score()+' · Drag to fly · Best '+Math.max(score(),S.best.tunnel||0)}
newBtn(el,reset);reset();const stop=loopf(step,()=>r.render(sc,cam));return()=>{stop();r.dispose()}}

/* ---------- Marble Maze 3D ---------- */
function marble3d(el){const{W,H,r,sc,info}=gl(el);const cam=new THREE.PerspectiveCamera(55,W/H,.1,100);cam.position.set(0,10,6);cam.lookAt(0,0,0);
const bd=mk3(new THREE.BoxGeometry(11,.4,11),0x232a4d),ball=mk3(new THREE.SphereGeometry(.35,16,12),0xffffff);bd.position.y=-.2;sc.add(bd,ball);
let bx,bz,vx,vz,ax,az,hs,os,score,alive,L,ms=[];const rp=()=>Math.random()*9-4.5,put=(g,c,x,z,y)=>{const m=mk3(g,c);m.position.set(x,y,z);sc.add(m);ms.push(m);return m};
function spot(){let x,z;do{x=rp();z=rp()}while(Math.hypot(x-bx,z-bz)<2);return[x,z]}
function level(){ms.forEach(m=>sc.remove(m));ms=[];hs=[];os=[];for(let i=0;i<2+L;i++){const[x,z]=spot();hs.push({x,z});put(new THREE.CylinderGeometry(.6,.6,.05,16),0x000000,x,z,.03)}for(let i=0;i<3;i++){const[x,z]=spot(),m=put(new THREE.SphereGeometry(.25,12,10),0xffd166,x,z,.35);os.push({x,z,m})}}
function reset(){bx=bz=vx=vz=ax=az=0;score=0;L=1;alive=1;level()}
r.domElement.onpointermove=r.domElement.onpointerdown=e=>{const q=r.domElement.getBoundingClientRect();ax=((e.clientX-q.left)/W*2-1)*.03;az=((e.clientY-q.top)/H*2-1)*.03};
r.domElement.onpointerup=()=>{ax=az=0};
function die(){alive=0;best('marble',score);if(score)reward(score*5,score*2);info.textContent='You fell · Orbs '+score}
function step(k){if(!alive)return;vx=(vx+ax*k)*.98;vz=(vz+az*k)*.98;bx+=vx*k;bz+=vz*k;ball.position.set(bx,.35,bz);
if(Math.abs(bx)>5.4||Math.abs(bz)>5.4||hs.some(h=>Math.hypot(h.x-bx,h.z-bz)<.5))return die();
os=os.filter(o=>{if(Math.hypot(o.x-bx,o.z-bz)<.55){sc.remove(o.m);score++;return false}return true});if(!os.length){L++;level()}
info.textContent='Orbs '+score+' · Hold and drag to tilt · Best '+Math.max(score,S.best.marble||0)}
newBtn(el,reset);reset();const stop=loopf(step,()=>r.render(sc,cam));return()=>{stop();r.dispose()}}

/* ---------- Tower Defense ---------- */
function td(el){const C=9,RW=12,W=Math.min(innerWidth-28,360),u=W/C,cv=document.createElement('canvas'),info=div('info');cv.width=W;cv.height=u*RW;el.append(info,cv);const x=cv.getContext('2d');
const wp=[[0,1],[7,1],[7,4],[1,4],[1,7],[7,7],[7,10],[0,10]],P=wp.map(p=>[(p[0]+.5)*u,(p[1]+.5)*u]),pc=new Set(),seg=[];let tot=0;
for(let i=0;i<wp.length-1;i++){const[a,b]=wp[i],[c,d]=wp[i+1],n=Math.max(Math.abs(c-a),Math.abs(d-b));for(let s=0;s<=n;s++)pc.add((a+Math.sign(c-a)*s)+','+(b+Math.sign(d-b)*s))}
for(let i=0;i<P.length-1;i++){const l=Math.hypot(P[i+1][0]-P[i][0],P[i+1][1]-P[i][1]);seg.push([tot,l]);tot+=l}
const at=d=>{let i=0;while(i<seg.length-1&&d>seg[i][0]+seg[i][1])i++;const t=Math.min(1,(d-seg[i][0])/seg[i][1]),a=P[i],b=P[i+1];return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]};
let T,Em,gold,lives,wave,q,sp,nt,hp0,alive,shots;
cv.onpointerdown=e=>{const r=cv.getBoundingClientRect(),cx=Math.floor((e.clientX-r.left)/u),cy=Math.floor((e.clientY-r.top)/u);if(!alive||pc.has(cx+','+cy))return;const t=T.find(t=>t.x==cx&&t.y==cy);if(t){if(gold>=60*t.lv){gold-=60*t.lv;t.lv++}}else if(gold>=50){gold-=50;T.push({x:cx,y:cy,lv:1,cd:0})}};
function die(){alive=0;best('td',wave);reward(wave*10,wave*5);info.textContent='Overrun on wave '+wave}
function step(k){if(!alive)return;
if(q>0){sp-=k;if(sp<=0){Em.push({d:0,hp:hp0,m:hp0,p:P[0]});q--;sp=28}}else if(!Em.length){nt-=k;if(nt<=0){wave++;q=4+wave*2;hp0=8+wave*7;nt=150;sp=0}}
shots=shots.filter(s=>--s[4]>0);
for(let i=Em.length-1;i>=0;i--){const e=Em[i];e.d+=u*.03*(1+wave*.04)*k;if(e.d>=tot){Em.splice(i,1);lives--;if(lives<=0)return die();continue}e.p=at(e.d)}
T.forEach(t=>{t.cd-=k;if(t.cd>0)return;const tx=(t.x+.5)*u,ty=(t.y+.5)*u;let b=null;Em.forEach(e=>{if(Math.hypot(e.p[0]-tx,e.p[1]-ty)<2.4*u&&(!b||e.d>b.d))b=e});
if(b){b.hp-=3+2*t.lv;t.cd=32;shots.push([tx,ty,b.p[0],b.p[1],6]);if(b.hp<=0){Em.splice(Em.indexOf(b),1);gold+=8}}});
info.textContent=`Wave ${wave} · ❤️ ${lives} · 🪙 ${gold} · tap grass to build (50), tap a tower to upgrade`}
function draw(){x.fillStyle='#10162e';x.fillRect(0,0,cv.width,cv.height);x.fillStyle='#232a4d';pc.forEach(s=>{const[a,b]=s.split(',');x.fillRect(a*u,b*u,u,u)});
T.forEach(t=>{x.fillStyle='#00e0c6';x.beginPath();x.arc((t.x+.5)*u,(t.y+.5)*u,u*.38,0,7);x.fill();x.fillStyle='#0b1020';x.font='bold '+u*.5+'px sans-serif';x.textAlign='center';x.fillText(t.lv,(t.x+.5)*u,(t.y+.5)*u+u*.18)});
x.strokeStyle='#ffd166';shots.forEach(s=>{x.beginPath();x.moveTo(s[0],s[1]);x.lineTo(s[2],s[3]);x.stroke()});
Em.forEach(e=>{x.fillStyle='#ff4d6d';x.beginPath();x.arc(e.p[0],e.p[1],u*.28,0,7);x.fill();x.fillStyle='#fff';x.fillRect(e.p[0]-u*.3,e.p[1]-u*.42,Math.max(0,u*.6*e.hp/e.m),3)})}
function reset(){T=[];Em=[];shots=[];gold=100;lives=10;wave=0;q=0;sp=0;nt=90;hp0=0;alive=1}
newBtn(el,reset);reset();return loopf(step,draw)}

window.MORE=(window.MORE||[]).concat([
{id:'shoot',n:'Space Shooter 3D',i:'🛩️',d:'Drag to fly and fire',u:'',run:shooter3d},
{id:'dash',n:'Cube Dash 3D',i:'🟦',d:'Tap to jump the spikes',u:'',run:dash3d},
{id:'tunnel',n:'Tunnel Racer 3D',i:'🌀',d:'Dodge through the tunnel',u:'',run:tunnel3d},
{id:'marble',n:'Marble Maze 3D',i:'🔮',d:'Roll, collect, avoid holes',u:' orbs',run:marble3d},
{id:'td',n:'Tower Defense',i:'🏰',d:'Hold off every wave',u:' waves',run:td}]);
  
