'use strict';
/* CHRONOS — loader, text splitting, reveals, counters, scroll-linked effects, horizontal archive */
(()=>{
  const {$,$$,RM,clamp}=CH;
  $$('[data-split]').forEach(el=>{const t=el.textContent.trim(),ch=el.dataset.split==='chars';let i=0;el.setAttribute('aria-label',t);
    el.innerHTML=t.split(' ').map(w=>`<span class="w" aria-hidden="true">${ch?[...w].map(c=>`<span class="ch${c==='.'?' dot':''}" style="--i:${i++}">${c}</span>`).join(''):`<span class="ch" style="--i:${i++}">${w}</span>`}&nbsp;</span>`).join('')});
  const sw=$$('[data-scrub]').map(p=>{p.innerHTML=p.textContent.trim().split(' ').map(w=>`<span class="sw">${w} </span>`).join('');return{p,w:$$('.sw',p)}});
  const easeCount=(el,from,to,ms,fmt)=>{const t0=performance.now(),f=t=>{const p=RM?1:clamp((t-t0)/ms);el.textContent=fmt(Math.round(from+(to-from)*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
  let io=null;const queue=[];
  const obs=r=>$$('[data-reveal],[data-split],.mask,[data-count],[data-year]',r).forEach(el=>io.observe(el));
  CH.observe=(r=document)=>io?obs(r):queue.push(r);
  function start(){
    io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;t.classList.add('in');io.unobserve(t);
      if(t.dataset.count)easeCount(t,0,+t.dataset.count,2000,v=>v);if(t.dataset.year){const y=+t.dataset.year;easeCount(t,y-80,y,1800,v=>v)}}),{threshold:.12});
    queue.splice(0).forEach(obs);obs(document)}
  const ld=$('.loader'),wipe=$('.wipe'),ss=(()=>{try{return sessionStorage}catch(e){return{}}})();
  const go=()=>{document.body.classList.add('ready');wipe.classList.remove('cover');start()};
  if(ss.chronos||RM||!ld){ld&&ld.remove();ss.chronos=1;requestAnimationFrame(go)}
  else{let v=0;const n=$('.pct',ld),hm=$('.hm',ld),hh=$('.hh',ld),t=setInterval(()=>{v=Math.min(100,v+Math.ceil(Math.random()*7));n.textContent=String(v).padStart(3,'0');hm.style.transform=`rotate(${v*14.4}deg)`;hh.style.transform=`rotate(${v*1.2}deg)`;
    if(v>=100){clearInterval(t);ss.chronos=1;setTimeout(()=>{ld.classList.add('done');go();setTimeout(()=>ld.remove(),1500)},450)}},60)}
  const par=$$('[data-speed]'),hz=$('.hzw'),tk=$('.htrack'),bar=$('.hprog i');
  CH.sizeHz=()=>{if(!hz)return;if(innerWidth>=900)hz.style.height=tk.scrollWidth-innerWidth+innerHeight+'px';else{hz.style.height='';tk.style.transform=''}};
  function onScroll(){const vh=innerHeight;
    sw.forEach(({p,w})=>{const r=p.getBoundingClientRect(),pr=clamp((vh*.8-r.top)/(vh*.4+r.height*.6));w.forEach((s,i)=>s.style.opacity=.14+.86*clamp(pr*w.length*1.15-i))});
    if(!RM)par.forEach(el=>{const r=el.parentElement.getBoundingClientRect();el.style.transform=`translate3d(0,${(r.top+r.height/2-vh/2)*-el.dataset.speed}px,0)`});
    if(hz&&innerWidth>=900){const r=hz.getBoundingClientRect(),p=clamp(-r.top/(hz.offsetHeight-vh));tk.style.transform=`translateX(${-p*(tk.scrollWidth-innerWidth)}px)`;bar&&(bar.style.transform=`scaleX(${p})`)}}
  let tick=0;addEventListener('scroll',()=>{if(!tick){tick=1;requestAnimationFrame(()=>{tick=0;onScroll()})}},{passive:true});
  addEventListener('resize',()=>{CH.sizeHz();onScroll()});CH.sizeHz();onScroll();document.fonts&&document.fonts.ready.then(()=>{CH.sizeHz();onScroll()});
})();
