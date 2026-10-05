'use strict';
/* CHRONOS — artworks data, collection grid, filters, distortion hover, detail view, draggable rail */
(()=>{
  const {$,$$,RM}=CH;
  const MOT={
    rings:()=>[8,16,24,32,40].map(r=>`<circle cx="50" cy="62" r="${r}"/>`).join(''),
    hands:()=>'<circle cx="50" cy="62" r="38"/><circle cx="50" cy="62" r="2"/><path d="M50 62V34M50 62l20 12"/>',
    spiral:()=>`<polyline points="${Array.from({length:140},(_,i)=>`${50+Math.cos(i*.25)*(1+i*.3)},${62+Math.sin(i*.25)*(1+i*.3)}`).join(' ')}"/>`,
    waves:()=>Array.from({length:10},(_,k)=>`<path d="M0 ${25+k*8} q12.5 -12 25 0 t25 0 t25 0 t25 0"/>`).join(''),
    grid:()=>Array.from({length:9},(_,k)=>`<path d="M${15+k*8.75} 22V102M15 ${22+k*10}H85"/>`).join(''),
    orbit:()=>[0,60,120].map(a=>`<ellipse cx="50" cy="62" rx="40" ry="13" transform="rotate(${a} 50 62)"/>`).join('')+'<circle cx="50" cy="62" r="4"/>',
    sand:()=>'<path d="M28 24h44L53 62l19 40H28l19-40z"/><path d="M40 98h20M44 90h12M48 80h4"/>',
    tide:()=>Array.from({length:7},(_,k)=>`<circle cx="50" cy="${40+k*7}" r="${34-k*4}"/>`).join('')};
  const A=[
    {id:'hourglass',t:'Hourglass for Nobody',y:2021,cat:'Sculpture',m:'sand',bg:'radial-gradient(70% 70% at 30% 25%,#e9a25f,#c2561a 55%,#6b1b2b)',med:'Polished steel, sand, light',dim:'210 × 90 × 90 cm',d:'A sculpture that runs on its own schedule. The sand falls upward for exactly one minute every hour, and no one has ever been standing there to see it.'},
    {id:'eclipse',t:'The Slow Eclipse',y:2022,cat:'Light',m:'rings',bg:'conic-gradient(from 210deg at 50% 60%,#44101b,#c2561a,#f3ecdf,#44101b)',med:'LED, mirrored acrylic',dim:'Variable installation',d:'An eclipse stretched across nine hours. Visitors arrive in shadow and leave in an amber glow without noticing the exact moment it changed.'},
    {id:'mornings',t:'Concentric Mornings',y:2019,cat:'Painting',m:'tide',bg:'linear-gradient(160deg,#f3ecdf,#d9b48a 45%,#6b1b2b)',dark:1,med:'Oil and gold leaf on linen',dim:'160 × 200 cm',d:'Forty mornings painted from the same window, layered until the days could no longer be told apart.'},
    {id:'pendulum',t:'Pendulum (Silver)',y:2023,cat:'Sculpture',m:'orbit',bg:'radial-gradient(60% 60% at 70% 30%,#fff,#b8bbc2 45%,#4b4f58)',dark:1,med:'Brushed aluminium, magnet',dim:'300 × 120 cm',d:'A pendulum that swings slightly slower each year. In a century it will stop, and the museum has planned a ceremony.'},
    {id:'minute',t:'A Minute, Unfolded',y:2024,cat:'Digital',m:'hands',bg:'linear-gradient(135deg,#6b1b2b,#44101b 60%,#c2561a)',med:'Real-time generative software',dim:'4K, 60 minutes loop',d:'Sixty seconds rendered as sixty minutes. Each tick contains an entire room of events you were never meant to see.'},
    {id:'smallhours',t:'Orbit of Small Hours',y:2020,cat:'Light',m:'orbit',bg:'radial-gradient(80% 80% at 20% 80%,#c2561a,transparent 60%),#2a1218',med:'Projection, fog, copper wire',dim:'Room-scale',d:'A planetary system of the hours between two and four in the morning, drawn in copper and light.'},
    {id:'cathedral',t:'Sand Cathedral',y:2018,cat:'Sculpture',m:'grid',bg:'linear-gradient(180deg,#e8d5b5,#c9a27a)',dark:1,med:'Compressed sand, resin',dim:'180 × 140 × 140 cm',d:'A cathedral built grain by grain, then left to the weather. Every season it loses one spire.'},
    {id:'tide',t:'Clockwork Tide',y:2025,cat:'Digital',m:'waves',bg:'conic-gradient(from 90deg,#b8bbc2,#6b1b2b,#b8bbc2,#e9a25f,#b8bbc2)',med:'Interactive software, sensors',dim:'Two 6 m screens',d:'The sea as a machine. The tide follows your breathing, speeding up when you hurry and slowing when you stop.'},
    {id:'lastsecond',t:'The Last Second',y:2022,cat:'Painting',m:'spiral',bg:'radial-gradient(circle at 50% 40%,#f3ecdf,#c2561a 40%,#3a0d17)',med:'Acrylic on canvas',dim:'120 × 150 cm',d:'A single second, painted over three years. The spiral is the only thing that stayed still.'},
    {id:'meridian',t:'Meridian',y:2024,cat:'Light',m:'rings',bg:'linear-gradient(200deg,#c2561a,#6b1b2b 55%,#190a0f)',med:'Laser, haze, stone',dim:'Variable installation',d:'A line of light that marks the exact middle of every day, wherever the visitor happens to be standing.'}];
  CH.ARTWORKS=A;
  const card=a=>`<a class="card" href="collection.html#${a.id}" draggable="false" data-id="${a.id}" data-c="${a.cat}" data-cursor="View" data-tilt><div class="art mask${a.dark?' dark':''}"><div class="bgl" style="background:${a.bg}"></div><svg viewBox="0 0 100 125" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${MOT[a.m]()}</svg></div><h3>${a.t}</h3><p>${a.cat}, ${a.y}</p></a>`;
  /* hover distortion via shared SVG displacement filter */
  const fe=$('#warp feDisplacementMap'),ft=$('#warp feTurbulence');let cur=null,val=0,tgt=0,run=false;
  const warp=t=>{val+=(tgt-val)*.12;fe.setAttribute('scale',val.toFixed(1));ft.setAttribute('baseFrequency',`${(.012+Math.sin(t/900)*.004).toFixed(4)} .02`);
    if(tgt===0&&val<.4){cur&&(cur.style.filter='');cur=null;run=false;return}requestAnimationFrame(warp)};
  const bindWarp=el=>{if(RM||!fe)return;el.addEventListener('pointerover',e=>{const a=e.target.closest('.art');if(!a)return;if(cur&&cur!==a)cur.style.filter='';cur=a;a.style.filter='url(#warp)';tgt=36;if(!run){run=true;requestAnimationFrame(warp)}});
    el.addEventListener('pointerout',e=>{if(e.target.closest('.art'))tgt=0})};
  /* draggable rail (home) */
  const rail=$('#rail');
  if(rail){rail.innerHTML=A.slice(0,7).map(card).join('');let d=0,sx=0,sl=0,mv=0;
    rail.addEventListener('pointerdown',e=>{d=1;mv=0;sx=e.clientX;sl=rail.scrollLeft;rail.classList.add('drag')});
    addEventListener('pointermove',e=>{if(!d)return;mv=Math.abs(e.clientX-sx);rail.scrollLeft=sl-(e.clientX-sx)});
    addEventListener('pointerup',()=>{d=0;rail.classList.remove('drag')});
    rail.addEventListener('click',e=>{if(mv>6){e.preventDefault();e.stopPropagation()}},true);
    $$('[data-rail]').forEach(b=>b.onclick=()=>rail.scrollBy({left:b.dataset.rail*Math.min(innerWidth*.4,440),behavior:'smooth'}));
    bindWarp(rail);CH.observe(rail);CH.bindFx(rail)}
  /* collection grid + filters + detail view */
  const grid=$('#grid'),modal=$('.modal');
  if(grid){let idx=0;grid.innerHTML=A.map(card).join('');bindWarp(grid);CH.observe(grid);CH.bindFx(grid);
    $('#filters').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;$$('.chip',$('#filters')).forEach(c=>c.classList.toggle('on',c===b));
      $$('.card',grid).forEach(c=>c.classList.toggle('hide',b.dataset.f!=='All'&&c.dataset.c!==b.dataset.f))});
    const open=i=>{idx=(i+A.length)%A.length;const a=A[idx];
      $('.m-art',modal).innerHTML=`<div class="art${a.dark?' dark':''}"><div class="bgl" style="background:${a.bg}"></div><svg viewBox="0 0 100 125" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${MOT[a.m]()}</svg></div>`;
      $('#m-cat').textContent=a.cat;$('#m-title').textContent=a.t;$('#m-desc').textContent=a.d;$('#m-year').textContent=a.y;$('#m-med').textContent=a.med;$('#m-dim').textContent=a.dim;
      modal.classList.add('open');modal.inert=false;document.body.style.overflow='hidden';history.replaceState(null,'','#'+a.id)};
    const close=()=>{modal.classList.remove('open');modal.inert=true;document.body.style.overflow='';history.replaceState(null,'',location.pathname)};
    grid.addEventListener('click',e=>{const c=e.target.closest('.card');if(c){e.preventDefault();open(A.findIndex(a=>a.id===c.dataset.id))}});
    modal.addEventListener('click',e=>{if(e.target.closest('.mclose'))close();const b=e.target.closest('[data-m]');if(b)open(idx+ +b.dataset.m)});
    addEventListener('keydown',e=>{if(!modal.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowRight')open(idx+1);if(e.key==='ArrowLeft')open(idx-1)});
    const h=location.hash.slice(1),i=A.findIndex(a=>a.id===h);if(i>-1)setTimeout(()=>open(i),900)}
  CH.icons();
})();

/* contact form */
(()=>{const {$,$$}=CH,f=$('#form');if(!f)return;
  $('#interest').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;b.classList.toggle('on');b.setAttribute('aria-pressed',b.classList.contains('on'))});
  f.onsubmit=e=>{e.preventDefault();const d=new FormData(f),er=$('.er',f);
    if(!d.get('n').trim()||!/^\S+@\S+\.\S+$/.test(d.get('e'))||d.get('m').trim().length<10){er.textContent='Please add your name, a valid email and a message of at least 10 characters.';return}
    er.textContent='';f.classList.add('hide');$('#done').classList.add('show');$('.ck').classList.add('go')};
  $('#again').onclick=()=>{f.reset();$$('.chip',f).forEach(c=>{c.classList.remove('on');c.setAttribute('aria-pressed','false')});f.classList.remove('hide');$('#done').classList.remove('show')};
})();
