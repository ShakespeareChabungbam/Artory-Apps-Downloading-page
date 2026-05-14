(()=>{
'use strict';
const isMobile=window.innerWidth<=900;

/* TYPEWRITER */
const phrases=['deserves a beautiful stage.','begins with a single frame.','finds you at the right time.','lives inside Artory Movies.'];
const typed=document.getElementById('typed-text');let pi=0,ci=0,del=false;
function tw(){const c=phrases[pi];if(!del){typed.textContent=c.substring(0,ci+1);ci++;if(ci===c.length){del=true;setTimeout(tw,2200);return}setTimeout(tw,50+Math.random()*30)}else{typed.textContent=c.substring(0,ci-1);ci--;if(ci===0){del=false;pi=(pi+1)%phrases.length;setTimeout(tw,400);return}setTimeout(tw,22)}}
setTimeout(tw,600);

/* PROGRESS BAR */
const pb=document.getElementById('progress-bar');

/* NAV */
const nav=document.getElementById('nav');

/* CUSTOM CURSOR (desktop only) */
const dot=document.getElementById('cursor-dot'),ring=document.getElementById('cursor-ring');
let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;
if(!isMobile){
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
  (function cl(){cx+=(mx-cx)*.12;cy+=(my-cy)*.12;ring.style.left=cx+'px';ring.style.top=cy+'px';requestAnimationFrame(cl)})();
  document.querySelectorAll('a,button,.btn,[data-tilt]').forEach(el=>{el.addEventListener('mouseenter',()=>{ring.style.width='52px';ring.style.height='52px';ring.style.borderColor='rgba(229,9,20,.5)'});el.addEventListener('mouseleave',()=>{ring.style.width='36px';ring.style.height='36px';ring.style.borderColor='rgba(229,9,20,.3)'})});
}

/* 3D PARTICLE SYSTEM */
const cv=document.getElementById('particle-canvas'),c=cv.getContext('2d');let W,H;
function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight}rs();window.addEventListener('resize',rs);
class P{constructor(){this.reset()}reset(){this.x=Math.random()*W;this.y=Math.random()*H;this.z=Math.random()*1200+400;this.vx=(Math.random()-.5)*.2;this.vy=(Math.random()-.5)*.2;this.vz=-Math.random()*.5-.1;this.life=1;this.ml=300+Math.random()*400;this.age=0;const v=Math.random();this.r=v>.6?229:v>.3?59:139;this.g=this.r===229?9:this.r===59?130:92;this.b=this.r===229?20:this.r===59?246:246}
update(){this.x+=this.vx;this.y+=this.vy;this.z+=this.vz;this.age++;this.life=1-this.age/this.ml;if(!isMobile){const s=800/this.z,sx=this.x*s+(W/2)*(1-s),sy=this.y*s+(H/2)*(1-s),dx=mx-sx,dy=my-sy,d=Math.sqrt(dx*dx+dy*dy);if(d<180){const f=.0002*(180-d);this.vx+=dx*f;this.vy+=dy*f}}if(this.z<1||this.age>=this.ml||this.x<-50||this.x>W+50)this.reset()}
draw(){const s=800/this.z,sx=this.x*s+(W/2)*(1-s),sy=this.y*s+(H/2)*(1-s),r=Math.max(.4,(2*s)*this.life),a=this.life*(isMobile?.12:.2);c.beginPath();c.arc(sx,sy,r,0,Math.PI*2);c.fillStyle=`rgba(${this.r},${this.g},${this.b},${a})`;c.fill()}}
const pCount=isMobile?40:80;
const pts=Array.from({length:pCount},()=>new P);
function drawLines(){for(let i=0;i<pts.length;i++){const p=pts[i],s1=800/p.z,x1=p.x*s1+(W/2)*(1-s1),y1=p.y*s1+(H/2)*(1-s1);for(let j=i+1;j<pts.length;j++){const q=pts[j],s2=800/q.z,x2=q.x*s2+(W/2)*(1-s2),y2=q.y*s2+(H/2)*(1-s2),d=Math.hypot(x1-x2,y1-y2);if(d<100){const a=.06*(1-d/100)*Math.min(p.life,q.life);c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.strokeStyle=`rgba(229,9,20,${a})`;c.lineWidth=.5;c.stroke()}}}}
function anim(){c.clearRect(0,0,W,H);pts.forEach(p=>{p.update();p.draw()});drawLines();requestAnimationFrame(anim)}anim();

/* 3D TILT (desktop) */
if(!isMobile){
  document.querySelectorAll('[data-tilt]').forEach(el=>{
    el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(700px) rotateX(${y*-12}deg) rotateY(${x*12}deg) translateZ(10px) scale3d(1.03,1.03,1.03)`});
    el.addEventListener('mouseleave',()=>{el.style.transform='perspective(700px) rotateX(0) rotateY(0) translateZ(0) scale3d(1,1,1)'});
  });
}

/* MOUSE PARALLAX SHAPES (desktop) */
if(!isMobile){
  const shapes=document.querySelectorAll('[data-speed]');
  document.addEventListener('mousemove',e=>{const cx=e.clientX/W-.5,cy=e.clientY/H-.5;shapes.forEach(s=>{const sp=parseFloat(s.dataset.speed)||.04;s.style.transform=`translate3d(${cx*sp*500}px,${cy*sp*500}px,0)`})});
}

/* ==============================
   HEAVY 3D SCROLL PARALLAX ENGINE
   ============================== */
const heroContent=document.getElementById('hero-content');
const heroVisual=document.getElementById('hero-visual');
const sections=document.querySelectorAll('.section');
const featMedias=document.querySelectorAll('.feat-media');
const featTexts=document.querySelectorAll('.feat-text');
const stepCards=document.querySelectorAll('.step-card');
const statCards=document.querySelectorAll('.stat');
const galleryCards=document.querySelectorAll('.gallery-card');
const dlCards=document.querySelectorAll('.dl-card');
const marquee=document.querySelector('.marquee-strip');
const ctaBanner=document.querySelector('.cta-banner');

// Smooth lerp values
let scrollY_smooth=0;

function getProgress(el){
  const r=el.getBoundingClientRect();
  const vh=innerHeight;
  return Math.max(0,Math.min(1,(vh-r.top)/(vh+r.height)));
}

function scrollParallax(){
  const sy=window.scrollY;
  scrollY_smooth+=(sy-scrollY_smooth)*.1;

  // Progress bar
  const h=document.documentElement;
  pb.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';

  // Nav
  nav.classList.toggle('scrolled',sy>40);

  // Hero parallax - content moves up, phone moves up slower
  if(heroContent){
    const hf=Math.min(sy/600,1);
    heroContent.style.transform=`translateY(${sy*.25}px) scale(${1-hf*.05})`;
    heroContent.style.opacity=1-hf*.8;
  }
  if(heroVisual){
    const hf=Math.min(sy/600,1);
    heroVisual.style.transform=`translateY(${sy*.12}px) rotateY(${hf*-8}deg) rotateX(${hf*5}deg)`;
  }

  // Grid floor
  const gf=document.querySelector('.hero-grid');
  if(gf)gf.style.transform=`translateY(${sy*.15}px)`;

  // Marquee speed shift
  if(marquee){
    const mp=getProgress(marquee);
    const shift=(mp-.5)*60;
    marquee.style.transform=`translateX(${shift}px)`;
  }

  // Feature rows - parallax offset between image & text
  featMedias.forEach((fm,i)=>{
    const p=getProgress(fm);
    const offset=(p-.5)*80;
    const rotY=i%2===0?(p-.5)*6:(p-.5)*-6;
    fm.style.transform=`perspective(800px) translateY(${offset*.4}px) rotateY(${rotY}deg) translateZ(${(p-.5)*20}px)`;
  });
  featTexts.forEach((ft,i)=>{
    const p=getProgress(ft);
    const offset=(p-.5)*-40;
    ft.style.transform=`translateY(${offset}px) translateX(${(p-.5)*(i%2===0?15:-15)}px)`;
    ft.style.opacity=.3+p*.7;
  });

  // Step cards - stagger 3D rotation
  stepCards.forEach((sc,i)=>{
    const p=getProgress(sc);
    const rotX=(1-p)*20;
    const rotY=(i-1)*5*(1-p);
    sc.style.transform=`perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${p*15}px) scale(${.9+p*.1})`;
    sc.style.opacity=.2+p*.8;
  });

  // Stat cards - scale + rotate from bottom
  statCards.forEach((sc,i)=>{
    const p=getProgress(sc);
    const rotX=(1-p)*15;
    const delay=i*.06;
    const pp=Math.max(0,Math.min(1,(p-delay)/(1-delay)));
    sc.style.transform=`perspective(700px) rotateX(${(1-pp)*15}deg) translateY(${(1-pp)*30}px) scale(${.92+pp*.08})`;
    sc.style.opacity=pp;
  });

  // Gallery cards - parallax Z depth stagger
  galleryCards.forEach((gc,i)=>{
    const p=getProgress(gc);
    const zShift=(1-p)*-40;
    const rotY=(i-1)*4*(1-p);
    gc.style.transform=`perspective(900px) translateZ(${zShift}px) rotateY(${rotY}deg) scale(${.94+p*.06})`;
    gc.style.opacity=.3+p*.7;
  });

  // Download cards - float up with rotation
  dlCards.forEach((dc,i)=>{
    const p=getProgress(dc);
    const rotY=(i===0?1:-1)*(1-p)*8;
    const ty=(1-p)*50;
    dc.style.transform=`perspective(800px) rotateY(${rotY}deg) translateY(${ty}px) translateZ(${(p-.3)*20}px)`;
    dc.style.opacity=.3+p*.7;
  });

  // CTA banner - subtle depth
  if(ctaBanner){
    const p=getProgress(ctaBanner);
    ctaBanner.style.transform=`perspective(800px) rotateX(${(1-p)*3}deg)`;
  }

  requestAnimationFrame(scrollParallax);
}
requestAnimationFrame(scrollParallax);

/* SCROLL REVEAL */
const obs=new IntersectionObserver(entries=>{entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*80);obs.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -20px 0px'});
document.querySelectorAll('.anim-up').forEach(el=>obs.observe(el));

/* MOBILE: float animation on cards */
if(isMobile){
  document.querySelectorAll('.gallery-card,.stat,.step-card').forEach((el,i)=>{
    el.style.animationDelay=(i*.3)+'s';
    el.classList.add('m-float');
  });
}

/* ANIMATED COUNTERS */
const cobs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){const el=e.target,t=parseInt(el.dataset.count),dur=1600,st=performance.now();function tick(n){const p=Math.min((n-st)/dur,1),ease=1-Math.pow(1-p,4);el.textContent=Math.floor(ease*t).toLocaleString();if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick);cobs.unobserve(el)}})},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(c=>cobs.observe(c));

/* SMOOTH ANCHORS */
document.querySelectorAll('a[href^="#"]').forEach(l=>{l.addEventListener('click',e=>{e.preventDefault();const t=document.querySelector(l.getAttribute('href'));if(t)t.scrollIntoView({behavior:'smooth'})})});

/* BUTTON RIPPLE */
const rc=document.createElement('style');rc.textContent='@keyframes rp{to{transform:scale(4);opacity:0}}';document.head.appendChild(rc);
document.querySelectorAll('.btn,.dl-btn,.nav-cta').forEach(b=>{b.addEventListener('click',function(e){const r=this.getBoundingClientRect(),sz=Math.max(r.width,r.height),s=document.createElement('span');s.style.cssText=`position:absolute;border-radius:50%;pointer-events:none;width:${sz}px;height:${sz}px;left:${e.clientX-r.left-sz/2}px;top:${e.clientY-r.top-sz/2}px;background:rgba(255,255,255,.25);transform:scale(0);animation:rp .5s ease-out`;this.style.position='relative';this.style.overflow='hidden';this.appendChild(s);s.addEventListener('animationend',()=>s.remove())})});

/* FAQ ACCORDION */
document.querySelectorAll('.faq').forEach(f=>{f.addEventListener('toggle',()=>{document.querySelectorAll('.faq').forEach(o=>{if(o!==f&&o.open)o.open=false})})});

/* GYROSCOPE TILT ON MOBILE */
if(isMobile&&window.DeviceOrientationEvent){
  const phone=document.querySelector('.phone-3d');
  window.addEventListener('deviceorientation',e=>{
    if(e.gamma===null)return;
    const tiltX=Math.max(-15,Math.min(15,e.gamma))*.4;
    const tiltY=Math.max(-15,Math.min(15,e.beta-45))*.3;
    if(phone)phone.style.transform=`perspective(700px) rotateY(${tiltX}deg) rotateX(${-tiltY}deg)`;
    document.querySelectorAll('.shape').forEach(s=>{
      s.style.transform=`translate3d(${tiltX*2}px,${tiltY*2}px,0)`;
    });
  },{passive:true});
}
})();
