'use strict';
/* CHRONOS — cursor, spotlight, delayed follower, depth parallax, magnetic buttons, 3D tilt */
(()=>{
  const {$,$$,RM}=CH,cd=$('.cd'),cr=$('.cr'),lb=$('span',cr),root=document.documentElement,st={x:innerWidth/2,y:innerHeight/2};st.rx=st.x;st.ry=st.y;
  addEventListener('pointermove',e=>{st.x=e.clientX;st.y=e.clientY;cd.style.transform=`translate(${st.x}px,${st.y}px)`;root.style.setProperty('--x',st.x+'px');root.style.setProperty('--y',st.y+'px');
    const t=e.target,c=t.closest('[data-cursor]');lb.textContent=c?c.dataset.cursor:'';cr.classList.toggle('lab',!!c);cr.classList.toggle('big',!c&&!!t.closest('a,button,input,textarea,.rail,[data-tilt]'))});
  const deps=$$('[data-depth]').map(el=>({el,d:+el.dataset.depth,x:0,y:0})),fol=$$('[data-follow]').map(el=>({el,x:st.x,y:st.y}));
  (function loop(){
    st.rx+=(st.x-st.rx)*.18;st.ry+=(st.y-st.ry)*.18;cr.style.transform=`translate(${st.rx}px,${st.ry}px)`;
    if(!RM){const nx=st.x/innerWidth-.5,ny=st.y/innerHeight-.5;
      deps.forEach(o=>{o.x+=(nx*o.d-o.x)*.06;o.y+=(ny*o.d-o.y)*.06;o.el.style.transform=`translate3d(${o.x}px,${o.y}px,0)`});
      fol.forEach(o=>{o.x+=(st.x-o.x)*.04;o.y+=(st.y-o.y)*.04;o.el.style.transform=`translate(${o.x}px,${o.y}px)`})}
    requestAnimationFrame(loop)})();
  CH.bindFx=(r=document)=>{
    $$('[data-tilt]',r).forEach(el=>{if(el._t||RM)return;el._t=1;
      el.addEventListener('pointermove',e=>{const b=el.getBoundingClientRect(),px=(e.clientX-b.left)/b.width-.5,py=(e.clientY-b.top)/b.height-.5;el.style.transform=`perspective(900px) rotateX(${-py*9}deg) rotateY(${px*9}deg)`});
      el.addEventListener('pointerleave',()=>el.style.transform='')});
    $$('[data-mag]',r).forEach(el=>{if(el._m||RM)return;el._m=1;el.style.transition='transform .35s cubic-bezier(.2,.8,.2,1),color .4s';
      el.addEventListener('pointermove',e=>{const b=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-b.left-b.width/2)*.3}px,${(e.clientY-b.top-b.height/2)*.3}px)`});
      el.addEventListener('pointerleave',()=>el.style.transform='')})};
  CH.bindFx();
})();
