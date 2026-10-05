'use strict';
/* CHRONOS — Three.js scenes: hero sculpture, dimensions world, experience playground */
(()=>{
  const {$,$$,RM,clamp}=CH;if(!window.THREE)return;const T=THREE;
  const env=r=>{const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,256);
    [[0,'#fff7e8'],[.42,'#e3d3b8'],[.56,'#6b1b2b'],[.78,'#c2561a'],[1,'#1d1114']].forEach(([o,k])=>g.addColorStop(o,k));x.fillStyle=g;x.fillRect(0,0,512,256);
    x.fillStyle='#fff';for(let i=0;i<5;i++)x.fillRect(30+i*100,28,46,64);
    const t=new T.CanvasTexture(c);t.mapping=T.EquirectangularReflectionMapping;const p=new T.PMREMGenerator(r),e=p.fromEquirectangular(t).texture;p.dispose();return e};
  const mat=(c,m=1,r=.22)=>new T.MeshStandardMaterial({color:c,metalness:m,roughness:r}),SILVER=0xdfe2e8,WINE=0x7a1f2e,ORANGE=0xc2561a;
  function stage(cv,cam,fov=45){
    const r=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,1.5));r.toneMapping=T.ACESFilmicToneMapping;
    const s=new T.Scene(),c=new T.PerspectiveCamera(fov,1,.1,200),amb=new T.AmbientLight(0xffffff,.45),key=new T.PointLight(0xff9a50,2.4,60);
    c.position.set(...cam);s.environment=env(r);s.add(amb,key);
    const size=()=>{const w=cv.clientWidth||innerWidth,h=cv.clientHeight||innerHeight;r.setSize(w,h,false);c.aspect=w/h;c.updateProjectionMatrix()};size();addEventListener('resize',size);
    const o={r,s,c,amb,key,vis:true};new IntersectionObserver(e=>o.vis=e[0].isIntersecting).observe(cv);return o}
  const SC={
    sculpture(cv){const S=stage(cv,[0,0,7.5]),g=new T.Group();S.s.add(g);
      const knot=new T.Mesh(new T.TorusKnotGeometry(1.25,.34,240,36,2,3),mat(SILVER,1,.16));g.add(knot);
      const rings=[[2.2,WINE],[2.9,ORANGE],[3.5,SILVER]].map(([r,c],i)=>{const m=new T.Mesh(new T.TorusGeometry(r,.035+i*.01,16,160),mat(c,.9,.25));m.rotation.set(i*1.1,i*.7,0);g.add(m);return m});
      const moon=new T.Mesh(new T.SphereGeometry(.2,32,32),mat(ORANGE,.6,.3));g.add(moon);
      let rx=0,ry=0,vx=0,vy=0,drag=0,px=0,py=0;
      cv.addEventListener('pointerdown',e=>{drag=1;px=e.clientX;py=e.clientY;cv.setPointerCapture(e.pointerId)});
      cv.addEventListener('pointermove',e=>{if(!drag)return;vy+=(e.clientX-px)*.0007;vx+=(e.clientY-py)*.0007;px=e.clientX;py=e.clientY});cv.addEventListener('pointerup',()=>drag=0);
      return{S,tick(t){const m=CH.mouse;vx*=.95;vy*=.95;ry+=vy+.003;rx+=vx;g.rotation.y+=(ry+m.x*.5-g.rotation.y)*.06;g.rotation.x+=(rx+m.y*.3-g.rotation.x)*.06;
        knot.rotation.z=t*.2;rings.forEach((r,i)=>r.rotation.z=t*(.3+i*.15));moon.position.set(Math.cos(t*.8)*3.9,Math.sin(t*.8)*1.2,Math.sin(t*.8)*3.9);S.key.position.set(m.x*6,m.y*4,4)}}},
    dimensions(cv){const S=stage(cv,[0,0,12],50);S.s.fog=new T.Fog(0xf3ecdf,16,70);
      const G=[new T.IcosahedronGeometry(1),new T.OctahedronGeometry(1.1),new T.TorusGeometry(.8,.26,16,48),new T.SphereGeometry(.9,32,32),new T.BoxGeometry(1.4,1.4,1.4)],M=[mat(SILVER),mat(WINE,.8,.3),mat(ORANGE,.7,.3)];
      const os=Array.from({length:48},(_,i)=>{const m=new T.Mesh(G[i%5],M[i%3]);m.position.set((Math.random()-.5)*20,(Math.random()-.5)*11,8-Math.random()*70);m.scale.setScalar(.5+Math.random()*1.3);m.userData={s:Math.random()*.6+.2,p:Math.random()*6};S.s.add(m);return m});
      const modes={day:{k:0xff9a50,a:.5,f:0xf3ecdf},ember:{k:0xffb15e,a:.35,f:0xe8c9a0},night:{k:0xff7a45,a:.12,f:0x190a0f}};
      $$('[data-light]').forEach(b=>b.onclick=()=>{const m=modes[b.dataset.light];document.body.dataset.light=b.dataset.light;S.key.color.setHex(m.k);S.amb.intensity=m.a;S.s.fog.color.setHex(m.f);$$('[data-light]').forEach(x=>x.classList.toggle('on',x===b))});
      return{S,tick(t){const m=CH.mouse,p=clamp(scrollY/((document.documentElement.scrollHeight-innerHeight)||1));
        S.c.position.set(Math.sin(p*7)*2.5+m.x*.8,m.y*.6,12-p*64);S.c.rotation.z=Math.sin(p*5)*.05;S.key.position.set(S.c.position.x+m.x*7,m.y*5,S.c.position.z-4);
        os.forEach(o=>{o.rotation.x=t*o.userData.s;o.rotation.y=t*o.userData.s*.7;o.position.y+=Math.sin(t+o.userData.p)*.003})}}},
    playground(cv){const S=stage(cv,[0,0,15],50),grp=new T.Group();S.s.add(grp);
      const G=[new T.IcosahedronGeometry(.5),new T.TorusGeometry(.4,.14,12,32),new T.SphereGeometry(.42,24,24),new T.BoxGeometry(.6,.6,.6)],M=[mat(SILVER),mat(WINE,.8,.3),mat(ORANGE,.7,.3)],N=72;
      const os=Array.from({length:N},(_,i)=>{const m=new T.Mesh(G[i%4],M[i%3]);m.position.set((Math.random()-.5)*14,(Math.random()-.5)*9,(Math.random()-.5)*6);grp.add(m);return{m,t:new T.Vector3(),o:new T.Vector3(),s:Math.random()*.02+.005}});
      const F={sphere:i=>{const k=i+.5,a=Math.acos(1-2*k/N),b=Math.PI*(1+Math.sqrt(5))*k;return[Math.cos(b)*Math.sin(a)*5,Math.sin(b)*Math.sin(a)*5,Math.cos(a)*5]},grid:i=>[(i%9-4)*1.8,(Math.floor(i/9)-3.5)*1.4,0],spiral:i=>{const a=i*.5,r=.6+i*.1;return[Math.cos(a)*r,(i-N/2)*.15,Math.sin(a)*r]}};
      let speed=1;const fl=$('.flash'),set=n=>{os.forEach((o,i)=>o.t.set(...F[n](i)));$$('[data-form]').forEach(b=>b.classList.toggle('on',b.dataset.form===n));if(fl){fl.classList.remove('go');void fl.offsetWidth;fl.classList.add('go')}};set('sphere');
      $$('[data-form]').forEach(b=>b.onclick=()=>set(b.dataset.form));const fw=$('#flow');fw&&fw.addEventListener('input',()=>speed=+fw.value);
      const pulse=()=>os.forEach(o=>o.o.add(new T.Vector3((Math.random()-.5)*7,(Math.random()-.5)*7,(Math.random()-.5)*7)));
      $('#pulse')&&($('#pulse').onclick=pulse);$('.play').addEventListener('click',e=>{if(!e.target.closest('.ctrl'))pulse()});
      const v=new T.Vector3(),mw=new T.Vector3();
      return{S,tick(){const m=CH.mouse;mw.set(m.x*S.c.aspect*7.5,m.y*7.5,0);grp.rotation.y+=.004*speed;grp.rotation.x=m.y*.15;S.key.position.set(m.x*8,m.y*6,6);
        os.forEach(o=>{o.m.position.lerp(o.t,.05);o.m.getWorldPosition(v);const dx=v.x-mw.x,dy=v.y-mw.y,d=Math.hypot(dx,dy);if(d<3.2){o.o.x+=dx/(d||1)*(3.2-d)*.08;o.o.y+=dy/(d||1)*(3.2-d)*.08}
          o.o.multiplyScalar(.93);o.m.position.add(o.o);o.m.rotation.x+=o.s*speed;o.m.rotation.y+=o.s*speed*1.3})}}}};
  const live=$$('canvas[data-scene]').map(cv=>{const k=SC[cv.dataset.scene];if(!k)return;try{return k(cv)}catch(e){return}}).filter(Boolean);
  const draw=t=>live.forEach(s=>{if(!s.S.vis&&!RM)return;s.tick(t);s.S.r.render(s.S.s,s.S.c)});
  if(RM){draw(0);addEventListener('resize',()=>draw(0))}else{const clk=new T.Clock();(function f(){draw(clk.getElapsedTime());requestAnimationFrame(f)})()}
})();
