'use strict';
/* CHRONOS — core: helpers, live clock, menu, page transitions, dust particles */
const CH=window.CH={};
CH.$=(s,r=document)=>r.querySelector(s);CH.$$=(s,r=document)=>[...r.querySelectorAll(s)];
CH.RM=matchMedia('(prefers-reduced-motion: reduce)').matches;CH.clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
CH.mouse={x:0,y:0,px:innerWidth/2,py:innerHeight/2};
addEventListener('pointermove',e=>{const m=CH.mouse;m.px=e.clientX;m.py=e.clientY;m.x=e.clientX/innerWidth*2-1;m.y=-(e.clientY/innerHeight*2-1)});
(()=>{
  const {$,RM}=CH,pad=n=>String(n).padStart(2,'0');
  CH.icons=()=>window.lucide&&window.lucide.createIcons();CH.icons();
  const live=$('#live'),tick=()=>{const d=new Date();live.textContent=`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`};tick();setInterval(tick,1000);
  const menu=$('#menu'),mbtn=$('.mbtn');
  CH.menu=o=>{menu.classList.toggle('open',o);menu.inert=!o;mbtn.setAttribute('aria-expanded',o);$('span',mbtn).textContent=o?'Close':'Menu';document.body.classList.toggle('menu-open',o);document.body.style.overflow=o?'hidden':''};
  mbtn.onclick=()=>CH.menu(!menu.classList.contains('open'));addEventListener('keydown',e=>{if(e.key==='Escape')CH.menu(false)});
  const seg=p=>p.split('/').pop()||'index.html',wipe=$('.wipe');
  document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||e.metaKey||e.ctrlKey||e.shiftKey||a.target)return;
    if(!/^[\w-]+\.html(#.*)?$/.test(a.getAttribute('href')))return;e.preventDefault();
    if(seg(a.pathname)===seg(location.pathname)){if(!a.hash)CH.menu(false);return}
    wipe.classList.add('leave');setTimeout(()=>location.href=a.href,RM?0:800)});
  addEventListener('pageshow',e=>{if(e.persisted)wipe.classList.remove('leave')});
  /* mouse-responsive dust */
  const c=$('.dust'),x=c.getContext('2d'),COL=['107,27,43','194,86,26','140,144,152'];let w,h,P=[];
  const rs=()=>{const d=Math.min(devicePixelRatio,1.5);w=c.width=innerWidth*d;h=c.height=innerHeight*d;
    P=Array.from({length:innerWidth<700?40:90},()=>({x:Math.random()*w,y:Math.random()*h,r:(Math.random()*2.2+.6)*d,vx:(Math.random()-.5)*.25*d,vy:(Math.random()-.5)*.25*d,c:COL[Math.random()*3|0],a:Math.random()*.4+.15}))};
  const draw=()=>{x.clearRect(0,0,w,h);const d=w/innerWidth,mx=CH.mouse.px*d,my=CH.mouse.py*d;
    for(const p of P){const dx=p.x-mx,dy=p.y-my,k=Math.hypot(dx,dy)||1;if(k<150*d){const f=(1-k/(150*d))*1.8;p.x+=dx/k*f;p.y+=dy/k*f}
      p.x=(p.x+p.vx+w)%w;p.y=(p.y+p.vy+h)%h;x.fillStyle=`rgba(${p.c},${p.a})`;x.beginPath();x.arc(p.x,p.y,p.r,0,6.283);x.fill()}
    if(!RM)requestAnimationFrame(draw)};
  rs();draw();addEventListener('resize',()=>{rs();RM&&draw()});
})();
