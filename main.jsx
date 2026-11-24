import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const IMG = {
  hero: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=2200&q=90',
  factory: 'https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=1800&q=85',
  robot: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1500&q=85',
  engineer: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1500&q=85',
  inspection: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=1500&q=85',
  operations: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1800&q=85',
  data: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1500&q=85',
  final: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=2200&q=90'
};

const capabilities = [
  { id:'robotics', label:'AUTONOMOUS ROBOTICS', title:'Let machines do the repeatable.\nLet people do the remarkable.', text:'Flexible robotic systems are redefining production—taking on repetitive, precise, and demanding work while teams focus on higher-value decisions.', image:IMG.robot, tag:'01 / ADAPTIVE AUTOMATION' },
  { id:'vision', label:'AI QUALITY INTELLIGENCE', title:'See defects before\nthey become decisions.', text:'Computer vision inspects products in real time, detects subtle anomalies, and helps bring consistency to quality across every shift.', image:IMG.inspection, tag:'02 / COMPUTER VISION' },
  { id:'maintenance', label:'PREDICTIVE MAINTENANCE', title:'Know the signal.\nBefore the stoppage.', text:'Machine data reveals patterns of wear and performance—giving maintenance teams a chance to act before unexpected downtime arrives.', image:IMG.engineer, tag:'03 / ASSET INTELLIGENCE' },
  { id:'twin', label:'DIGITAL TWINS', title:'Test tomorrow.\nWithout stopping today.', text:'Virtual replicas make it possible to model processes, evaluate changes, and explore outcomes before touching the physical line.', image:IMG.data, tag:'04 / SIMULATION' },
  { id:'data', label:'INDUSTRIAL DATA', title:'Every signal becomes\na smarter next step.', text:'Connect the data already flowing through your facility into a shared operational picture for faster, more confident decisions.', image:IMG.factory, tag:'05 / CONNECTED SYSTEMS' },
  { id:'energy', label:'ENERGY OPTIMIZATION', title:'Make every watt\nwork harder.', text:'AI-supported forecasting and optimization can uncover energy waste, balance loads, and support more efficient industrial operations.', image:IMG.operations, tag:'06 / RESOURCE INTELLIGENCE' }
];

function ThreeHero(){
  const mount = useRef(null);
  useEffect(()=>{
    const el=mount.current; if(!el) return;
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(38,el.clientWidth/el.clientHeight,.1,100);
    camera.position.set(0,0,8.5);
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.8)); renderer.setSize(el.clientWidth,el.clientHeight); renderer.setClearColor(0x000000,0);
    renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.12;
    el.appendChild(renderer.domElement);
    const group=new THREE.Group(); scene.add(group);
    const orb=new THREE.Mesh(new THREE.IcosahedronGeometry(1.38,3),new THREE.MeshPhysicalMaterial({color:0x1c7c4b,metalness:.7,roughness:.19,clearcoat:1,clearcoatRoughness:.1,transmission:.04,thickness:.6}));
    group.add(orb);
    const wire=new THREE.Mesh(new THREE.IcosahedronGeometry(1.48,2),new THREE.MeshBasicMaterial({color:0x8df2b4,wireframe:true,transparent:true,opacity:.16})); group.add(wire);
    const ringMat=new THREE.MeshBasicMaterial({color:0x8fe6a9,transparent:true,opacity:.54});
    const ring1=new THREE.Mesh(new THREE.TorusGeometry(2.02,.012,8,180),ringMat); ring1.rotation.x=1.1; ring1.rotation.y=.35; group.add(ring1);
    const ring2=new THREE.Mesh(new THREE.TorusGeometry(1.78,.008,8,160),new THREE.MeshBasicMaterial({color:0xd1f8dc,transparent:true,opacity:.28})); ring2.rotation.x=.25; ring2.rotation.y=1.3; group.add(ring2);
    const points=[]; for(let i=0;i<260;i++){const p=new THREE.Vector3().randomDirection().multiplyScalar(2.2+Math.random()*2.3);points.push(p.x,p.y,p.z)}
    const particleGeo=new THREE.BufferGeometry(); particleGeo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
    const particle=new THREE.Points(particleGeo,new THREE.PointsMaterial({color:0xb7f8ce,size:.025,transparent:true,opacity:.65})); scene.add(particle);
    scene.add(new THREE.AmbientLight(0x9adbb2,1.5));
    const key=new THREE.PointLight(0xb0ffd0,45,18); key.position.set(2.4,2.4,3); scene.add(key);
    const rim=new THREE.PointLight(0x16834b,38,18); rim.position.set(-3,-1.4,-2); scene.add(rim);
    let frame; let pointer={x:0,y:0}; const move=(e)=>{const r=el.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width-.5);pointer.y=((e.clientY-r.top)/r.height-.5)};
    el.addEventListener('pointermove',move);
    const animate=()=>{frame=requestAnimationFrame(animate); group.rotation.y+=.002; group.rotation.x+=.0008; group.rotation.y+=pointer.x*.0008; group.position.x+=(pointer.x*.28-group.position.x)*.035; group.position.y+=(-pointer.y*.18-group.position.y)*.035; ring1.rotation.z+=.0012; ring2.rotation.x+=.001; particle.rotation.y-=.0003; renderer.render(scene,camera)}; animate();
    const resize=()=>{camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();renderer.setSize(el.clientWidth,el.clientHeight)}; window.addEventListener('resize',resize);
    return ()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',resize);el.removeEventListener('pointermove',move);renderer.dispose();el.innerHTML='';scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose()})};
  },[]);
  return <div className="three-stage" ref={mount} aria-hidden="true"/>;
}

function CountDown(){
  const [time,setTime]=useState({days:'000',hours:'00',minutes:'00',seconds:'00'});
  useEffect(()=>{const target=new Date('2026-12-12T10:00:00+05:30').getTime();const tick=()=>{let diff=Math.max(0,target-Date.now());setTime({days:String(Math.floor(diff/86400000)).padStart(3,'0'),hours:String(Math.floor(diff/3600000)%24).padStart(2,'0'),minutes:String(Math.floor(diff/60000)%60).padStart(2,'0'),seconds:String(Math.floor(diff/1000)%60).padStart(2,'0')})};tick();const timer=setInterval(tick,1000);return()=>clearInterval(timer)},[]);
  return <div className="timer" aria-label="Countdown to webinar"><div><strong>{time.days}</strong><span>DAYS</span></div><i>:</i><div><strong>{time.hours}</strong><span>HOURS</span></div><i>:</i><div><strong>{time.minutes}</strong><span>MIN</span></div><i>:</i><div><strong>{time.seconds}</strong><span>SEC</span></div></div>;
}
function App(){
  const [active,setActive]=useState(0); const [faq,setFaq]=useState(0); const [menu,setMenu]=useState(false); const [formMsg,setFormMsg]=useState('');
  useEffect(()=>{
    const lenis=new Lenis({duration:1.15,smoothWheel:true}); lenis.on('scroll',ScrollTrigger.update); const raf=(t)=>{lenis.raf(t);requestAnimationFrame(raf)};const rafId=requestAnimationFrame(raf);
    gsap.utils.toArray('.reveal').forEach(el=>gsap.fromTo(el,{y:45,opacity:0},{y:0,opacity:1,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none reverse'}}));
    gsap.utils.toArray('.parallax-img').forEach(el=>gsap.fromTo(el,{scale:1.12,yPercent:-3},{scale:1,yPercent:3,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1}}));
    gsap.to('.hero-copy',{y:90,opacity:.25,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
    gsap.to('.story-orbit',{rotation:20,ease:'none',scrollTrigger:{trigger:'.story',start:'top bottom',end:'bottom top',scrub:1}});
    const onScroll=()=>document.body.classList.toggle('scrolled',window.scrollY>35);window.addEventListener('scroll',onScroll);onScroll();
    return()=>{cancelAnimationFrame(rafId);window.removeEventListener('scroll',onScroll);lenis.destroy();ScrollTrigger.getAll().forEach(s=>s.kill())};
  },[]);
  const submit=(e)=>{e.preventDefault();setFormMsg('Thank you — this demo form is ready for backend integration. No data was sent or stored.');};
  const go=(id)=>{setMenu(false);document.getElementById(id)?.scrollIntoView({behavior:'smooth'})};
  return <>
    <div className="progress-track"><span/></div>
    <div className="cursor-glow" aria-hidden="true"/>
    <header className="nav"><a className="brand" href="#top"><span className="brand-mark"><b/><b/><b/></span>GREENCORE<span className="brand-dot">.</span></a><nav className={menu?'nav-links open':'nav-links'}><a onClick={()=>go('vision')}>VISION</a><a onClick={()=>go('capabilities')}>INTELLIGENCE</a><a onClick={()=>go('event')}>THE EVENT</a></nav><button className="nav-cta" onClick={()=>go('event')}>RESERVE YOUR PLACE <span>↗</span></button><button className="menu-toggle" onClick={()=>setMenu(!menu)} aria-label="Toggle menu"><span/><span/></button></header>
    <main id="top">
      <section className="hero">
        <div className="hero-backdrop"><img src={IMG.hero} alt="Industrial manufacturing equipment"/></div><div className="hero-shade"/>
        <div className="hero-copy"><p className="eyebrow reveal"><span className="live-dot"/> INDUSTRY, REIMAGINED / 2026</p><h1><span>THE FUTURE</span><em>IS BUILT</em><span className="outline-word">INTELLIGENTLY.</span></h1><div className="hero-bottom reveal"><p>Where human ingenuity meets<br/>machine intelligence.</p><a className="round-link" href="#vision"><span>↓</span></a><div className="hero-meta">AI FOR MANUFACTURING<br/>DIGITAL EXPERIENCE</div></div></div>
        <ThreeHero/><div className="hero-coordinate">16° / 24° — INDUSTRIAL INTELLIGENCE</div>
      </section>
      <section className="intro section-pad" id="vision"><div className="section-kicker reveal">01 — A NEW INDUSTRIAL ERA</div><div className="intro-heading reveal"><h2>Not a factory<br/>that <span>works harder.</span><br/>A factory that<br/><span>thinks ahead.</span></h2><p>Manufacturing is entering a new chapter. Connected machines, intelligent systems, and human expertise are creating operations that can anticipate, adapt, and improve in real time.</p></div><div className="intro-foot reveal"><span>INTELLIGENCE IS THE NEW INFRASTRUCTURE</span><span>SCROLL TO EXPLORE ↓</span></div></section>
      <section className="story"><div className="story-image parallax-img"><img src={IMG.factory} alt="Industrial manufacturing floor"/><div className="story-overlay"/></div><div className="story-text"><span className="section-kicker">02 — INSIDE THE INTELLIGENT FACTORY</span><h2>INTELLIGENCE.<br/><span>IN EVERY MOTION.</span></h2><p>Every movement produces data. Every signal carries possibility. AI brings those fragments together—turning a production floor into a connected system that learns and responds.</p><div className="story-orbit"><span>AI</span><i/><i/><i/></div><div className="story-note">CONNECTED OPERATIONS / HUMAN-LED PROGRESS</div></div></section>
      <section className="capabilities section-pad" id="capabilities"><div className="section-kicker reveal">03 — SIX CAPABILITIES, ONE SHIFT</div><div className="cap-header reveal"><h2>WHAT IF YOUR<br/><span>OPERATIONS</span><br/>COULD SEE AHEAD?</h2><p>Explore the technologies shaping the next generation of manufacturing—from intelligent automation to resilient, resource-aware production.</p></div><div className="cap-showcase"><div className="cap-tabs" role="tablist">{capabilities.map((c,i)=><button key={c.id} className={active===i?'selected':''} onClick={()=>setActive(i)} role="tab" aria-selected={active===i}><span>{String(i+1).padStart(2,'0')}</span>{c.label}<b>↗</b></button>)}</div><div className="cap-visual" key={capabilities[active].id}><div className="cap-img"><img src={capabilities[active].image} alt={capabilities[active].label}/><div className="image-vignette"/></div><div className="cap-copy"><span className="cap-tag">{capabilities[active].tag}</span><h3>{capabilities[active].title}</h3><p>{capabilities[active].text}</p><div className="cap-index">{String(active+1).padStart(2,'0')} <span>/ 06</span></div></div><div className="cap-corner">GREENC0RE / TECHNOLOGY INDEX</div></div></div></section>
      <section className="operations"><div className="operations-head section-pad"><div className="section-kicker reveal">04 — REAL-WORLD TRANSFORMATION</div><h2 className="reveal">FROM THE FACTORY FLOOR<br/><span>TO THE FUTURE.</span></h2><p className="reveal">Technology matters when it changes what happens on the floor. Explore the human and physical systems behind the intelligent factory.</p></div><div className="ops-gallery"><figure className="ops-large reveal"><img className="parallax-img" src={IMG.operations} alt="Manufacturing operations"/><figcaption><span>01 / OPERATIONS</span>Precision at scale</figcaption></figure><figure className="ops-small reveal"><img className="parallax-img" src={IMG.engineer} alt="Engineer working with industrial equipment"/><figcaption><span>02 / HUMAN EXPERTISE</span>People, empowered</figcaption></figure><figure className="ops-wide reveal"><img className="parallax-img" src={IMG.inspection} alt="Quality inspection process"/><figcaption><span>03 / QUALITY</span>Confidence by design</figcaption></figure></div><div className="ops-footer"><span>THE MACHINE IS ONLY PART OF THE STORY.</span><span>THE PEOPLE MAKE THE DIFFERENCE. ↗</span></div></section>
      <section className="principles section-pad"><div className="section-kicker reveal">05 — A BETTER WAY TO BUILD</div><h2 className="reveal">AUTOMATE WITH PURPOSE.<br/><span>INNOVATE WITH PEOPLE.</span></h2><div className="principle-grid"><div className="principle reveal"><span>01 / RESILIENCE</span><h3>Less uncertainty.<br/>More readiness.</h3><p>Spot the emerging patterns that help teams prepare, respond, and recover faster.</p></div><div className="principle reveal"><span>02 / PRECISION</span><h3>Quality, built<br/>into every step.</h3><p>Bring inspection and process intelligence closer to the moment work happens.</p></div><div className="principle reveal"><span>03 / HUMAN IMPACT</span><h3>Better tools.<br/>Better work.</h3><p>Give people clearer insights, safer workflows, and more time for meaningful decisions.</p></div></div></section>
      <section className="event" id="event"><div className="event-back"><img src={IMG.final} alt="Industrial automation environment"/></div><div className="event-glow"/><div className="event-content section-pad"><div className="section-kicker reveal">06 — THE GREENCORE EXPERIENCE</div><div className="event-title reveal"><span>LIVE DIGITAL SESSION</span><h2>AI FOR<br/><em>MANUFACTURING.</em></h2><p>THE NEXT INDUSTRIAL REVOLUTION<br/>IS ALREADY IN MOTION.</p></div><div className="event-details reveal"><div className="event-info"><div><span>DATE</span><strong>12 DECEMBER 2026</strong></div><div><span>TIME</span><strong>10:00 — 11:30 AM IST</strong></div><div><span>FORMAT</span><strong>LIVE ONLINE SESSION</strong></div><div><span>ACCESS</span><strong>₹499 / ATTENDEE</strong></div></div><CountDown/><a className="event-button" href="#register">REGISTER FOR THE EXPERIENCE <b>↗</b></a><p className="event-note">A forward-looking session on AI applications, operational value, and the road to intelligent manufacturing.</p></div></div></section>
      <section className="agenda section-pad"><div className="section-kicker reveal">07 — WHAT YOU'LL TAKE AWAY</div><h2 className="reveal">A PRACTICAL LOOK<br/>AT <span>WHAT'S NEXT.</span></h2><div className="agenda-list"><div className="agenda-row reveal"><span>10:00 — 10:10</span><h3>Opening / The AI factory moment</h3><p>Why the shift is happening now—and what it means for manufacturing leaders.</p></div><div className="agenda-row reveal"><span>10:10 — 10:35</span><h3>AI on the production floor</h3><p>Robotics, vision systems, predictive maintenance, and practical use cases.</p></div><div className="agenda-row reveal"><span>10:35 — 11:00</span><h3>From pilot to real value</h3><p>Data readiness, adoption, measurement, and the realities of scaling.</p></div><div className="agenda-row reveal"><span>11:00 — 11:30</span><h3>Live discussion / Q&amp;A</h3><p>Questions, insights, and next steps for your intelligent operations journey.</p></div></div></section>
      <section className="register section-pad" id="register"><div className="register-left reveal"><div className="section-kicker">08 — SAVE YOUR SEAT</div><h2>BUILD WHAT<br/><span>COMES NEXT.</span></h2><p>Join a conversation about the ideas, technologies, and decisions shaping the future of manufacturing.</p><div className="register-aside">12.12.2026<br/>10:00 AM IST<br/>LIVE / ONLINE</div></div><form className="register-form reveal" onSubmit={submit}><span className="form-title">RESERVE YOUR PLACE</span><label>FULL NAME<input required placeholder="Your name"/></label><label>EMAIL ADDRESS<input required type="email" placeholder="you@company.com"/></label><label>ORGANIZATION<input placeholder="Company or institution"/></label><label>YOUR INTEREST<select defaultValue="" required><option value="" disabled>Select a focus area</option><option>AI & Automation</option><option>Quality & Inspection</option><option>Predictive Maintenance</option><option>Digital Twins</option><option>Industrial Data</option><option>Energy Optimization</option></select></label><button type="submit" className="form-submit">SUBMIT INTEREST <span>↗</span></button>{formMsg&&<div className="form-message" role="status">{formMsg}</div>}<small>Demo registration only. Connect a backend to collect registrations securely.</small></form></section>
      <section className="closing"><div className="closing-image"><img src={IMG.final} alt="Factory lights at dusk"/></div><div className="closing-copy"><span className="section-kicker">GREENCORE / THE NEXT CHAPTER</span><h2>THE FUTURE<br/>OF INDUSTRY<br/><span>STARTS NOW.</span></h2><a href="#event" className="closing-cta">STEP INTO THE FUTURE <b>↗</b></a></div></section>
    </main>
    <footer className="footer"><a className="brand" href="#top"><span className="brand-mark"><b/><b/><b/></span>GREENCORE<span className="brand-dot">.</span></a><span>INTELLIGENCE IN MOTION.</span><span>© 2026 GREENCORE / CONCEPT EXPERIENCE</span><a href="#top" className="to-top">BACK TO TOP ↑</a></footer>
    <div className="cursor-dot"/>
  </>;
}

function Effects(){useEffect(()=>{const progress=document.querySelector('.progress-track span');const cursor=document.querySelector('.cursor-dot');const glow=document.querySelector('.cursor-glow');const onScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${max>0?window.scrollY/max*100:0}%`};const mouse=(e)=>{if(innerWidth>900){cursor.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;glow.style.transform=`translate(${e.clientX-190}px,${e.clientY-190}px)`}};window.addEventListener('scroll',onScroll);window.addEventListener('mousemove',mouse);return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('mousemove',mouse)}},[]);return null}
createRoot(document.getElementById('root')).render(<><App/><Effects/></>);
