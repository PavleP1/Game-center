function loopf(step,draw){let id,last=0;const f=n=>{const k=Math.min(2,(n-(last||n))/16.7);last=n;step(k);draw();id=requestAnimationFrame(f)};id=requestAnimationFrame(f);return()=>cancelAnimationFrame(id)}

/* ---------- Memory Match ---------- */
function memory(el){const E=['🍕','🚀','🎲','🐙','🎸','🔥','🍀','👑'];let c,open,lock,mv,left;const info=div('info'),bd=div('b4');el.append(info,bd);
function draw(){bd.innerHTML='';c.forEach((k,i)=>{const t=div('t');t.textContent=k.s?k.e:'?';if(k.s==2)t.style.background='#0a6e63';else if(k.s)t.style.background='#4a3aa8';t.onclick=()=>flip(i);bd.append(t)});info.textContent=`Moves ${mv} · Best ${S.best.mem||'-'}`}
function flip(i){if(lock||c[i].s)return;c[i].s=1;open.push(i);draw();if(open.length<2)return;mv++;const[a,b]=open;open=[];if(c[a].e==c[b].e){c[a].s=c[b].s=2;draw();if(!--left){if(!S.best.mem||mv<S.best.mem){S.best.mem=mv;save()}reward(Math.max(10,60-mv*2),Math.max(5,30-mv));info.textContent='Cleared in '+mv+' moves!'}}else{lock=1;setTimeout(()=>{c[a].s=c[b].s=0;lock=0;draw()},700)}}
function reset(){c=[...E,...E].sort(()=>Math.random()-.5).map(e=>({e,s:0}));open=[];lock=0;mv=0;left=8;draw()}
newBtn(el,reset);reset()}

/* ---------- Sky Flyer ---------- */
function flyer(el){const W=Math.min(innerWidth-28,360),H=Math.round(W*1.4),cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d'),info=div('info');el.append(info,cv);let y,v,p,sc,st;const bx=W*.25,G=H*.27;
function reset(){y=H/2;v=0;p=[];sc=0;st=0;info.textContent='Tap to fly · Best '+(S.best.fly||0)}
cv.onpointerdown=()=>{if(st<2){st=1;v=-6.2}};
function die(){st=2;best('fly',sc);if(sc)reward(sc*6,sc*3);info.textContent='Crashed · Score '+sc}
function step(k){if(st!=1)return;v+=.32*k;y+=v*k;if(!p.length||p[p.length-1].x<W-190)p.push({x:W,g:H*.25+Math.random()*H*.5,s:0});p.forEach(o=>{o.x-=2.4*k;if(!o.s&&o.x+26<bx){o.s=1;sc++;info.textContent='Score '+sc+' · Best '+Math.max(sc,S.best.fly||0)}if(Math.abs(o.x-bx)<38&&Math.abs(y-o.g)>G/2-12)die()});p=p.filter(o=>o.x>-40);if(y<0||y>H)die()}
function draw(){x.fillStyle='#10162e';x.fillRect(0,0,W,H);x.fillStyle='#00e0c6';p.forEach(o=>{x.fillRect(o.x-26,0,52,o.g-G/2);x.fillRect(o.x-26,o.g+G/2,52,H)});x.fillStyle='#ffd166';x.beginPath();x.arc(bx,y,12,0,7);x.fill()}
newBtn(el,reset);reset();return loopf(step,draw)}

/* ---------- Brick Breaker ---------- */
function bricks(el){const W=Math.min(innerWidth-28,360),H=Math.round(W*1.45),cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d'),info=div('info'),pw=W*.22,R=7;el.append(info,cv);let px,bx,by,vx,vy,B,sc,lv,lives,run;
const txt=()=>info.textContent=`Score ${sc} · Lives ${lives} · Level ${lv}`;
function build(){B=[];for(let r=0;r<5;r++)for(let c=0;c<7;c++)B.push({x:c*W/7+2,y:50+r*22,w:W/7-4,h:18,r})}
function serve(){bx=px;by=H-50;const s=3.2+lv*.4;vx=s*(Math.random()<.5?-.6:.6);vy=-s;run=0}
function reset(){px=W/2;sc=0;lv=1;lives=3;build();serve();txt()}
const mv=e=>{px=Math.max(pw/2,Math.min(W-pw/2,e.clientX-cv.getBoundingClientRect().left))};cv.onpointermove=mv;cv.onpointerdown=e=>{mv(e);if(run==0)run=1};
function step(k){if(run<1){if(run==0)bx=px;return}bx+=vx*k;by+=vy*k;if(bx<R||bx>W-R)vx=-vx;if(by<R)vy=Math.abs(vy);
if(vy>0&&by>H-30-R&&by<H-20&&Math.abs(bx-px)<pw/2+R){vy=-Math.abs(vy);vx=(bx-px)/(pw/2)*4.5}
for(let i=0;i<B.length;i++){const b=B[i];if(bx>b.x-R&&bx<b.x+b.w+R&&by>b.y-R&&by<b.y+b.h+R){B.splice(i,1);vy=-vy;sc+=10;txt();break}}
if(!B.length){lv++;build();serve();txt()}
if(by>H){lives--;txt();if(lives<=0){run=-1;best('brick',sc);if(sc)reward(sc/3,sc/6);info.textContent='Game over · Score '+sc}else serve()}}
function draw(){x.fillStyle='#10162e';x.fillRect(0,0,W,H);B.forEach(b=>{x.fillStyle=`hsl(${260-b.r*40},70%,60%)`;x.fillRect(b.x,b.y,b.w,b.h)});x.fillStyle='#fff';x.fillRect(px-pw/2,H-30,pw,10);x.beginPath();x.arc(bx,by,R,0,7);x.fill()}
newBtn(el,reset);reset();return loopf(step,draw)}

/* ---------- Connect Four ---------- */
function c4(el){const R=6,C=7;let g,over;const info=div('info'),bd=div('b4');bd.style.gridTemplateColumns='repeat(7,1fr)';bd.style.maxWidth='380px';bd.style.gap='5px';el.append(info,bd);
const drop=(c,p)=>{for(let r=R-1;r>=0;r--)if(!g[r*C+c]){g[r*C+c]=p;return r}return -1};
const four=p=>{for(let r=0;r<R;r++)for(let c=0;c<C;c++)for(const[dr,dc]of[[0,1],[1,0],[1,1],[1,-1]]){let n=0;for(;n<4;n++){const a=r+dr*n,b=c+dc*n;if(a<0||a>=R||b<0||b>=C||g[a*C+b]!=p)break}if(n==4)return 1}return 0};
function bot(){const cols=[...Array(C).keys()].filter(c=>!g[c]);for(const p of['O','X'])for(const c of cols){const r=drop(c,p),w=four(p);g[r*C+c]=0;if(w)return c}return Math.random()<.6&&cols.includes(3)?3:cols[rand(cols.length)]}
function draw(m){bd.innerHTML='';g.forEach((v,i)=>{const t=div('t');t.style.borderRadius='50%';t.style.background=v=='X'?'#00e0c6':v=='O'?'#ff4d6d':'#1b2245';t.onclick=()=>play(i%C);bd.append(t)});info.textContent=m||`You are teal · Wins ${S.best.c4||0}`}
function fin(r){over=1;if(r=='X'){S.best.c4=(S.best.c4||0)+1;reward(40,25)}else r=='O'?reward(5,2):reward(15,8);draw(r=='X'?'You win!':r=='O'?'Bot wins':'Draw')}
function play(c){if(over||g[c])return;drop(c,'X');if(four('X'))return fin('X');if(!g.includes(0))return fin('T');drop(bot(),'O');if(four('O'))return fin('O');if(!g.includes(0))return fin('T');draw()}
function reset(){g=Array(R*C).fill(0);over=0;draw()}
newBtn(el,reset);reset()}

/* ---------- Whack-a-Mole ---------- */
function mole(el){const info=div('info'),bd=div('b3');el.append(info,bd);let cells,sc,end,up,tm;
const show=()=>info.textContent=`Score ${sc} · ${Math.max(0,Math.ceil((end-Date.now())/1e3))}s · Best ${S.best.mole||0}`;
function tick(){cells.forEach(c=>c.textContent='');up=-1;if(Date.now()>=end){best('mole',sc);if(sc)reward(sc*3,sc*2);info.textContent='Time! Score '+sc;return}up=rand(9);cells[up].textContent='🐹';show();tm=setTimeout(tick,Math.max(320,700-sc*10))}
function reset(){clearTimeout(tm);sc=0;end=Date.now()+30000;bd.innerHTML='';cells=[...Array(9)].map((_,i)=>{const c=div('cell');c.style.fontSize='44px';c.onpointerdown=()=>{if(i==up){sc++;up=-1;c.textContent='💥';show()}};bd.append(c);return c});tick()}
newBtn(el,reset);reset();return()=>clearTimeout(tm)}

window.MORE=[
{id:'mem',n:'Memory Match',i:'🧠',d:'Find all the pairs',u:' moves',run:memory},
{id:'fly',n:'Sky Flyer',i:'🐦',d:'Tap to dodge pipes',u:'',run:flyer},
{id:'brick',n:'Brick Breaker',i:'🧱',d:'Smash every level',u:'',run:bricks},
{id:'c4',n:'Connect Four',i:'🔴',d:'Outsmart the bot',u:' wins',run:c4},
{id:'mole',n:'Whack-a-Mole',i:'🐹',d:'30 seconds, go fast',u:'',run:mole}];
