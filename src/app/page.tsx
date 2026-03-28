'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NIOChat from '@/components/public/NIOChat';

export default function ExoGalaxyLanding() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  // Starfield logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const layers = [
      Array.from({ length: 320 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * .5 + 0.15, a: Math.random() * .25 + .08, tw: Math.random() * Math.PI * 2, speed: Math.random() * .0002 + .00008, drift: Math.random() * .0004 - .0002 })),
      Array.from({ length: 180 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * .7 + 0.25, a: Math.random() * .35 + .15, tw: Math.random() * Math.PI * 2, speed: Math.random() * .0005 + .0002, drift: Math.random() * .0008 - .0004 })),
      Array.from({ length: 60 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.4, a: Math.random() * .5 + .25, tw: Math.random() * Math.PI * 2, speed: Math.random() * .0008 + .0004, drift: Math.random() * .0012 - .0006 }))
    ];

    const dust = Array.from({ length: 28 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * .8 + 0.2, a: Math.random() * .12 + .03, tw: Math.random() * Math.PI * 2, speed: Math.random() * .0003 + .0001, drift: Math.random() * .0006 - .0003 }));

    let animationFrameId: number;
    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#000005");
      bg.addColorStop(0.35, "#010008");
      bg.addColorStop(0.7, "#000a04");
      bg.addColorStop(1, "#000502");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      layers.forEach(layer => {
        layer.forEach(s => {
          s.tw += .008; s.y += s.speed; if (s.y > 1) s.y -= 1; s.x += s.drift; if (s.x > 1) s.x -= 1; if (s.x < 0) s.x += 1;
          const fl = s.a * (.65 + .35 * Math.sin(s.tw));
          ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${fl})`; ctx.fill();
        });
      });

      dust.forEach(s => {
        s.tw += .006; s.y += s.speed; if (s.y > 1) s.y -= 1; s.x += s.drift; if (s.x > 1) s.x -= 1; if (s.x < 0) s.x += 1;
        const fl = s.a * (.5 + .5 * Math.sin(s.tw));
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(0,255,136,${fl})`; ctx.fill();
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Scroll visibility logic
  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY;
      setScrollY(sy);
      
      const sections = ['hero', 'commercial', 'about', 'the-system', 'publicaxis', 'pricing', 'signup'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && sy >= el.offsetTop - 200) setActiveSection(id);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-black text-white font-orbitron selection:bg-[#00ff88]/20 selection:text-[#00ff88] overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-[200] h-[70px] flex items-center justify-between px-6 md:px-12 transition-all duration-300 backdrop-blur-xl border-b border-white/[0.08] ${scrollY > 50 ? 'bg-black/92' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Image src="/exogalaxy/cobuddy-logo-nav.png" alt="COBUDDY OS" width={126} height={126} className="h-[42px] w-auto mix-blend-screen drop-shadow-[0_0_8px_rgba(0,255,136,0.45)] group-hover:drop-shadow-[0_0_16px_rgba(0,255,136,0.8)]" />
        </div>

        <div className="hidden md:flex items-center gap-9">
          {['HOME', 'ABOUT', 'OUL', 'SYSTEM', 'AXIS', 'PRICING'].map((item) => (
            <Link 
              key={item} 
              href={item === 'OUL' ? '/oul' : item.toLowerCase() === 'home' ? '#hero' : item.toLowerCase() === 'system' ? '#the-system' : `#${item.toLowerCase()}`}
              className={`text-[9px] tracking-[3px] font-semibold uppercase hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:bg-[#00ff88] after:transition-all after:duration-300 ${activeSection === (item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase()) ? 'text-white after:w-full' : 'text-white/60 after:w-0'}`}
            >
              {item}
            </Link>
          ))}
          <Link href="/signup" className="ml-2 bg-[#00ff88] text-black text-[9px] tracking-[3px] font-extrabold px-[22px] py-[10px] rounded-[2px] shadow-[0_0_18px_rgba(0,255,136,0.35)] hover:shadow-[0_0_32px_rgba(0,255,136,0.6)] hover:-translate-y-px transition-all uppercase">
            SIGN UP
          </Link>
          <Link href="/login" className="text-[9px] tracking-[3px] font-semibold uppercase text-[#00ff88] hover:text-white transition-colors">LOGIN</Link>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="relative min-h-screen flex items-center px-[8vw] z-10">
        <Image src="/exogalaxy/cobuddy-logo-hero.png" alt="" width={980} height={600} className="absolute right-0 top-1/2 -translate-y-1/2 w-[clamp(500px,65vw,980px)] opacity-[0.97] mix-blend-screen z-[1] select-none pointer-events-none" />
        <div className="relative z-[3] max-w-[500px] text-left">
          <div className="text-[#00ff88] text-[8px] tracking-[6px] drop-shadow-[0_0_12px_rgba(0,255,136,0.5)] mb-6 animate-section-fade-up">THE EXOGALAXY — PRODUCTION PLANNING SYSTEM</div>
          <p className="text-[clamp(9px,1.2vw,12px)] tracking-[3px] text-white/55 font-bold leading-[2.2] mb-10 animate-section-fade-up [animation-delay:200ms]">
            <strong className="text-white font-black">Visualize it. Construct it. Execute it.</strong><br/>
            Before the truck is even loaded.
          </p>
          <div className="flex gap-4 flex-wrap animate-section-fade-up [animation-delay:300ms]">
            <Link href="/boot" className="bg-[#00ff88] text-black text-[10px] tracking-[3px] font-extrabold px-9 py-4 rounded-[2px] shadow-[0_0_24px_rgba(0,255,136,0.4)] hover:shadow-[0_0_44px_rgba(0,255,136,0.65)] hover:-translate-y-0.5 transition-all">ENTER THE EXOGALAXY</Link>
            <Link href="/signup" className="border border-white/18 text-white/70 text-[10px] tracking-[3px] font-bold px-9 py-4 rounded-[2px] hover:border-[#00ff88] hover:text-white transition-all uppercase">JOIN WAITLIST</Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[7px] tracking-[4px] text-white/20 animate-bounce">↓ SCROLL TO EXPLORE</div>
      </section>

      {/* Commercial Section */}
      <section id="commercial" className="relative py-[120px] px-10 flex flex-col items-center text-center bg-[#050505]/82">
        <div className="text-[#00ff88] text-[8px] tracking-[6px] mb-4 drop-shadow-[0_0_10px_rgba(0,255,136,0.4)]">COBUDDY OS IN ACTION</div>
        <h2 className="text-[clamp(22px,4vw,48px)] font-black tracking-[4px] leading-tight mb-5">See The System</h2>
        <div className="w-[60px] h-0.5 bg-[#00ff88] mb-8 shadow-[0_0_10px_#00ff88]" />
        <p className="text-[10px] tracking-[2px] text-white/50 leading-[2] max-w-[580px] animate-section-fade-up [animation-delay:300ms]">Watch what happens when production planning meets spatial intelligence. This is not a form. This is not a spreadsheet. This is a new operating system for the event industry.</p>
        <div className="relative w-full max-w-[960px] mt-12 rounded-sm overflow-hidden border border-[#00ff88]/15 shadow-[0_0_60px_rgba(0,255,136,0.08)] bg-black aspect-video flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-[#00ff88]/40">
             <div className="text-6xl">▶</div>
             <div className="text-[9px] tracking-[4px]">COMMERCIAL COMING SOON</div>
          </div>
        </div>
      </section>

      {/* System Sections... */}
      <section id="about" className="relative py-[120px] px-10 grid md:grid-cols-2 gap-20 items-center max-w-[1200px] mx-auto min-h-[600px]">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-[340px] h-[340px] rounded-full border border-dashed border-[#00ff88]/20 animate-spin-slow" />
          <Image src="/exogalaxy/nio-hero.jpeg" alt="NIO" width={440} height={440} className="relative z-[1] w-[clamp(240px,34vw,440px)] rounded-xl filter drop-shadow-[0_0_30px_rgba(0,255,136,0.2)] animate-floating-slow" />
        </div>
        <div>
          <div className="text-[#00ff88] text-[8px] tracking-[6px] mb-4">WHAT IS COBUDDY OS</div>
          <h2 className="text-[clamp(22px,4vw,48px)] font-black tracking-[4px] leading-tight mb-5">The World's First Visual Spatial Production Planning System</h2>
          <div className="w-[60px] h-0.5 bg-[#00ff88] mb-8 shadow-[0_0_10px_#00ff88]" />
          <p className="text-[10px] tracking-[2px] text-white/50 leading-[2] max-w-[580px]">Built for AV professionals, event producers, and the entire live experience industry. Cobuddy OS lets you design, staff, and blueprint your entire production before a single cable is touched.</p>
          <div className="grid grid-cols-2 gap-4 mt-8 animate-section-fade-up [animation-delay:400ms]">
            {[ 
              { icon: '🛰️', title: 'VISUALIZE', desc: 'Drag and drop equipment onto a spatial canvas in real time' }, 
              { icon: '⚙️', title: 'CONSTRUCT', desc: 'Assign staff, build road cases, configure tech tables' }, 
              { icon: '📋', title: 'EXECUTE', desc: 'Generate production blueprints with one click' }, 
              { icon: '🌍', title: 'SCALE', desc: 'Built for AV, events, catering, rentals and more' } 
            ].map(p => (
              <div key={p.title} className="p-5 border border-white/[.06] rounded-[4px] bg-white/[.02] hover:border-[#00ff88]/25 hover:bg-[#00ff88]/[0.03] transition-all">
                <div className="text-[22px] mb-2.5">{p.icon}</div>
                <div className="text-[9px] tracking-[3px] font-extrabold mb-2">{p.title}</div>
                <div className="text-[8px] tracking-[1px] text-white/40 leading-relaxed font-sans">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUL Section */}
      <section id="oul" className="relative py-[120px] px-10 bg-[#050505]/82 flex flex-col items-center text-center">
        <div className="text-[#00ff88] text-[8px] tracking-[6px] mb-4 drop-shadow-[0_0_10px_rgba(0,255,136,0.4)] animate-section-fade-up">OUL — OCCUPATIONAL UTILITY LOCATOR</div>
        <h2 className="text-[clamp(22px,4vw,48px)] font-black tracking-[4px] leading-tight mb-5 animate-section-fade-up [animation-delay:100ms]">Find Your Production Partner</h2>
        <div className="w-[60px] h-0.5 bg-[#00ff88] mb-8 shadow-[0_0_10px_#00ff88] animate-section-fade-up [animation-delay:200ms]" />
        <p className="text-[10px] tracking-[2px] text-white/50 leading-[2] max-w-[580px] mb-12 animate-section-fade-up [animation-delay:300ms]">Search by location, event type, and capacity. Discover verified AV companies, event producers, and vendors in your area. The industry directory built for how production actually works.</p>
        <div className="animate-section-fade-up [animation-delay:400ms]">
          <Link href="/oul" className="bg-[#00ff88] text-black text-[10px] tracking-[3px] font-extrabold px-9 py-4 rounded-[2px] shadow-[0_0_24px_rgba(0,255,136,0.4)] hover:shadow-[0_0_44px_rgba(0,255,136,0.65)] hover:-translate-y-0.5 transition-all uppercase">EXPLORE OUL DIRECTORY</Link>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="relative py-[120px] px-10 bg-[#050505]/82 flex flex-col items-center text-center">
        <div className="text-[#00ff88] text-[8px] tracking-[6px] mb-4 drop-shadow-[0_0_10px_rgba(0,255,136,0.4)] animate-section-fade-up">INSIDE THE SYSTEM</div>
        <h2 className="text-[clamp(22px,4vw,48px)] font-black tracking-[4px] leading-tight mb-5 animate-section-fade-up [animation-delay:100ms]">The ExoGalaxy</h2>
        <div className="w-[60px] h-0.5 bg-[#00ff88] mb-8 shadow-[0_0_10px_#00ff88] animate-section-fade-up [animation-delay:200ms]" />
        <p className="text-[10px] tracking-[2px] text-white/50 leading-[2] max-w-[580px] mb-12 animate-section-fade-up [animation-delay:300ms]">A glimpse into the planets. Each system built with purpose. Each interaction designed for the production professional.</p>
        
        <div className="grid md:grid-cols-3 gap-4 max-w-[1100px] w-full animate-section-fade-up [animation-delay:400ms]">
          <div className="md:col-span-2 relative aspect-[16/10] border border-white/10 rounded-sm overflow-hidden bg-black group">
            <Image src="/exogalaxy/landing-visual-3.png" alt="Exogalaxy Planets" fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 to-transparent">
              <div className="text-white/70 text-[7px] tracking-[3px] uppercase">THE EXOGALAXY — ALL PLANETS</div>
            </div>
          </div>
          <div className="relative aspect-[16/10] border border-white/10 rounded-sm overflow-hidden bg-black group">
            <Image src="/exogalaxy/landing-visual-1.png" alt="Orbital Map" fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 to-transparent">
              <div className="text-white/70 text-[7px] tracking-[3px] uppercase">ORBITAL MAP — RA & THE PLANETS</div>
            </div>
          </div>
          {[
            { icon: '🏗️', label: 'ATLAS — INVENTORY · COMING SOON' },
            { icon: '🕰️', label: 'CUE — CALENDAR · COMING SOON' },
            { icon: '🪐', label: 'NEXUS — DASHBOARD · COMING SOON' }
          ].map(c => (
            <div key={c.label} className="relative aspect-[16/10] border border-white/10 rounded-sm overflow-hidden bg-[#0a0a0a] flex flex-col items-center justify-center gap-2 group hover:border-[#00ff88]/30 transition-colors">
              <div className="absolute inset-0 bg-radial-[circle_at_center,_rgba(0,255,136,0.04)_0%,_transparent_70%] pointer-events-none" />
              <div className="text-4xl opacity-20 group-hover:opacity-40 transition-opacity">{c.icon}</div>
              <div className="text-[7px] tracking-[3px] text-white/25 uppercase">{c.label}</div>
            </div>
          ))}
        </div>
      </section>


      {/* NIO Feature */}
      <section id="nio-feature" className="relative py-[120px] px-10 flex flex-col items-center text-center bg-black">
        <div className="text-[#00ff88] text-[8px] tracking-[6px] mb-4 animate-section-fade-up">MEET NIO</div>
        <h2 className="text-[clamp(22px,4vw,48px)] font-black tracking-[4px] mb-5 animate-section-fade-up [animation-delay:100ms]">Network Intelligence Operator</h2>
        <div className="w-[60px] h-0.5 bg-[#00ff88] mb-8 shadow-[0_0_10px_#00ff88] animate-section-fade-up [animation-delay:200ms]" />
        <p className="text-[10px] tracking-[2px] text-white/50 leading-[2] max-w-[580px] animate-section-fade-up [animation-delay:300ms]">NIO is the intelligence layer of Cobuddy OS. Guide. Calculator. Validator. System Enforcer. Calm, precise, always protecting order.</p>
        <div className="grid md:grid-cols-2 gap-10 max-w-[1100px] w-full mt-16 items-center animate-section-fade-up [animation-delay:400ms]">
          <Image src="/exogalaxy/nio-solo-1.PNG" alt="NIO" width={550} height={550} className="w-full mix-blend-multiply drop-shadow-[0_0_40px_rgba(0,255,136,0.2)]" />
          <Image src="/exogalaxy/brand-section.jpg" alt="Brand" width={550} height={550} className="w-full rounded-md border border-[#00ff88]/12 shadow-[0_20px_60px_rgba(0,0,0,0.7)]" />
        </div>
      </section>

      {/* Public Axis */}
      <section id="publicaxis" className="relative py-[120px] px-10 flex flex-col items-center text-center">
        <div className="text-[#00ff88] text-[8px] tracking-[6px] mb-4 animate-section-fade-up">AXIS — LIVE PREVIEW</div>
        <h2 className="text-[clamp(22px,4vw,48px)] font-black tracking-[4px] mb-5 animate-section-fade-up [animation-delay:100ms]">Design Your Event. Right Now.</h2>
        <div className="w-[60px] h-0.5 bg-[#00ff88] mb-8 shadow-[0_0_10px_#00ff88] animate-section-fade-up [animation-delay:200ms]" />
        <p className="text-[10px] tracking-[2px] text-white/50 leading-[2] max-w-[580px] mb-12 animate-section-fade-up [animation-delay:300ms]">No account needed. Drop into the public design canvas and start building your production layout in real time.</p>
        <div className="relative w-full max-w-[1000px] aspect-video border border-[#00ff88]/15 bg-[#0a0a0a] rounded-[4px] overflow-hidden flex flex-col items-center justify-center cursor-pointer group shadow-[0_0_80px_rgba(0,255,136,0.06)] animate-section-fade-up [animation-delay:400ms]" onClick={() => window.location.href = '/axis/production'}>
          <Image src="/exogalaxy/axis-placeholder.PNG" alt="Axis" fill className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,.04)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 pointer-events-none" />
          <div className="relative z-10 text-[11px] font-extrabold tracking-[4px] text-white/30 mb-2">PUBLIC AXIS CANVAS</div>
          <div className="relative z-10 text-[8px] font-bold tracking-[3px] text-[#00ff88]/35 mb-5">INTERACTIVE DESIGN RUNTIME</div>
          <button className="relative z-10 bg-[#00ff88] text-black text-[9px] font-black tracking-[3px] px-7 py-3 rounded-sm shadow-[0_0_20px_rgba(0,255,136,0.35)] hover:shadow-[0_0_36px_rgba(0,255,136,0.6)] transition-all uppercase">ENTER AXIS →</button>
        </div>
      </section>

      {/* Pricing / Orbits */}
      <section id="pricing" className="py-[120px] bg-[#050505]/82 flex flex-col items-center text-center">
        <div className="text-[#00ff88] text-[8px] tracking-[6px] mb-4 animate-section-fade-up">SUBSCRIPTION PLANS</div>
        <h2 className="text-[clamp(22px,4vw,48px)] font-black tracking-[4px] mb-5 animate-section-fade-up [animation-delay:100ms]">Powered by Orbits</h2>
        <div className="w-[60px] h-0.5 bg-[#00ff88] mb-8 shadow-[0_0_10px_#00ff88] animate-section-fade-up [animation-delay:200ms]" />
        <p className="text-[10px] tracking-[2px] text-white/50 leading-[2] max-w-[580px] mb-12 animate-section-fade-up [animation-delay:300ms]">Cobuddy OS runs on Orbits — our platform currency built for the production economy. Subscription tiers launching with the full platform.</p>
        <div className="relative w-full max-w-[700px] border border-[#00ff88]/15 rounded-[4px] p-16 bg-radial-[ellipse_at_center,_rgba(0,255,136,0.03)_0%,_transparent_70%] overflow-hidden animate-section-fade-up [animation-delay:400ms]">
          <div className="absolute top-4 right-4 text-[7px] tracking-[3px] px-3 py-1.5 border border-[#ffaa00]/30 text-[#ffaa00] rounded-[2px] bg-[#ffaa00]/[0.06]">COMING SOON</div>
          <div className="text-[clamp(28px,5vw,56px)] font-black tracking-[6px] text-[#00ff88] drop-shadow-[0_0_20px_rgba(0,255,136,0.5)] mb-4">
            <span className="text-[14px] align-super mr-1 opacity-70">◎</span>ORBITS
          </div>
          <p className="text-[9px] tracking-[3px] text-white/45 leading-[2] mb-8">Full pricing tiers, Orbits currency details, and enterprise plans will be revealed at launch. Join the waitlist to get early access pricing.</p>
          <button className="bg-[#00ff88] text-black text-[9px] font-black tracking-[3px] px-8 py-4 shadow-[0_0_20px_rgba(0,255,136,0.35)] hover:shadow-[0_0_36px_rgba(0,255,136,0.6)] hover:-translate-y-px transition-all uppercase" onClick={(e) => { e.preventDefault(); document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' }); }}>GET EARLY ACCESS PRICING</button>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-[120px] flex flex-col items-center text-center">
        <div className="text-[#00ff88] text-[8px] tracking-[6px] mb-4 animate-section-fade-up">EARLY FEEDBACK</div>
        <h2 className="text-[clamp(22px,4vw,48px)] font-black tracking-[4px] mb-5 animate-section-fade-up [animation-delay:100ms]">What The Industry Is Saying</h2>
        <div className="w-[60px] h-0.5 bg-[#00ff88] mb-8 shadow-[0_0_10px_#00ff88] animate-section-fade-up [animation-delay:200ms]" />
        <div className="grid md:grid-cols-3 gap-5 max-w-[1100px] w-full mt-12 animate-section-fade-up [animation-delay:300ms]">
          {[
            { quote: '"This is what we\'ve been missing for 20 years. A real pre-production system that thinks like we do."', name: 'AV PROFESSIONAL', role: 'LIVE EVENTS INDUSTRY — COMING SOON' },
            { quote: '"The blueprint generation alone saves hours per event. This changes how we quote, plan, and execute."', name: 'EVENT PRODUCER', role: 'CORPORATE EVENTS — COMING SOON' },
            { quote: '"I\'ve never seen a platform that understands the production floor like this. NIO is something else."', name: 'TECHNICAL DIRECTOR', role: 'TOURING & PRODUCTION — COMING SOON' }
          ].map(t => (
            <div key={t.name} className="p-8 border border-white/[.06] rounded-[4px] bg-white/[.02] text-left hover:border-[#00ff88]/18 transition-colors group">
              <div className="text-[#00ff88] text-[12px] tracking-[2px] mb-3">★★★★★</div>
              <p className="text-[9px] tracking-[1px] leading-[2.2] text-white/60 mb-6 italic font-sans">{t.quote}</p>
              <div className="text-[8px] font-extrabold tracking-[3px] mb-1">{t.name}</div>
              <div className="text-[7px] tracking-[2px] text-white/35 uppercase">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist Signup */}
      <section id="signup" className="py-[120px] bg-[#050505]/82 flex flex-col items-center text-center">
        <div className="text-[#00ff88] text-[8px] tracking-[6px] mb-4 animate-section-fade-up">EARLY ACCESS</div>
        <h2 className="text-[clamp(22px,4vw,48px)] font-black tracking-[4px] mb-5 animate-section-fade-up [animation-delay:100ms]">Join The Waitlist</h2>
        <div className="w-[60px] h-0.5 bg-[#00ff88] mb-8 shadow-[0_0_10px_#00ff88] animate-section-fade-up [animation-delay:200ms]" />
        <p className="text-[10px] tracking-[2px] text-white/50 leading-[2] max-w-[580px] mb-12 animate-section-fade-up [animation-delay:300ms]">Be first in when Cobuddy OS launches. Early access members get priority onboarding and founding member pricing.</p>
        <form className="w-full max-w-[560px] flex flex-col gap-3.5 animate-section-fade-up [animation-delay:400ms]" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-3.5">
            <input className="bg-white/[.04] border border-white/10 rounded-sm p-4 text-[9px] tracking-[2px] outline-none focus:border-[#00ff88]/40 text-white placeholder:text-white/25" placeholder="FIRST NAME" />
            <input className="bg-white/[.04] border border-white/10 rounded-sm p-4 text-[9px] tracking-[2px] outline-none focus:border-[#00ff88]/40 text-white placeholder:text-white/25" placeholder="LAST NAME" />
          </div>
          <input className="bg-white/[.04] border border-white/10 rounded-sm p-4 text-[9px] tracking-[2px] outline-none focus:border-[#00ff88]/40 text-white placeholder:text-white/25" placeholder="BUSINESS EMAIL" />
          <input className="bg-white/[.04] border border-white/10 rounded-sm p-4 text-[9px] tracking-[2px] outline-none focus:border-[#00ff88]/40 text-white placeholder:text-white/25" placeholder="BUSINESS NAME" />
          <select className="bg-white/[.04] border border-white/10 rounded-sm p-4 text-[9px] tracking-[2px] outline-none focus:border-[#00ff88]/40 text-white/70 cursor-pointer appearance-none">
            <option value="" disabled selected>BUSINESS TYPE</option>
            <option value="av">AV PRODUCTION</option>
            <option value="event">EVENT PLANNING</option>
            <option value="catering">CATERING</option>
            <option value="rental">PARTY RENTALS</option>
            <option value="venue">VENUE</option>
            <option value="other">OTHER</option>
          </select>
          <input className="bg-white/[.04] border border-white/10 rounded-sm p-4 text-[9px] tracking-[2px] outline-none focus:border-[#00ff88]/40 text-white placeholder:text-white/25" placeholder="CITY / STATE" />
          <button className="bg-[#00ff88] text-black text-[10px] font-black tracking-[4px] py-4 rounded-sm shadow-[0_0_24px_rgba(0,255,136,0.35)] hover:shadow-[0_0_44px_rgba(0,255,136,0.6)] hover:-translate-y-px transition-all uppercase mt-1.5">SECURE MY SPOT →</button>
          <div className="text-[7px] tracking-[2px] text-white/25 mt-2">No spam. No credit card. Just your spot in line.</div>
        </form>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-[120px] flex flex-col items-center text-center">
        <div className="text-[#00ff88] text-[8px] tracking-[6px] mb-4 animate-section-fade-up">GET IN TOUCH</div>
        <h2 className="text-[clamp(22px,4vw,48px)] font-black tracking-[4px] mb-5 animate-section-fade-up [animation-delay:100ms]">Contact Cobuddy</h2>
        <div className="w-[60px] h-0.5 bg-[#00ff88] mb-8 shadow-[0_0_10px_#00ff88] animate-section-fade-up [animation-delay:200ms]" />
        <p className="text-[10px] tracking-[2px] text-white/50 leading-[2] max-w-[580px] mb-12 animate-section-fade-up [animation-delay:300ms]">Questions, partnerships, press inquiries — we want to hear from you.</p>
        <div className="animate-section-fade-up [animation-delay:400ms]">
          <a href="mailto:hello@cobuddyos.com" className="font-orbitron text-[9px] tracking-[3px] font-bold text-white/50 border border-white/10 px-8 py-5 rounded-sm hover:border-[#00ff88] hover:text-white transition-all uppercase">✉ HELLO@COBUDDYOS.COM</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-black z-10">
        <div className="flex items-center text-[13px] font-black tracking-[4px]">
          COBUDDY <span className="text-[#00ff88] drop-shadow-[0_0_8px_#00ff88] ml-1.5">OS</span>
        </div>
        <div className="flex gap-6">
          {['Home', 'About', 'OUL', 'System', 'Axis', 'Pricing'].map(f => (
            <Link key={f} href={f === 'OUL' ? '/oul' : '#'} className="text-[7px] text-white/30 hover:text-[#00ff88] transition-colors uppercase tracking-[2px]">{f}</Link>
          ))}
        </div>
        <div className="text-white/20 text-[7px] tracking-[2px]">© 2026 COBUDDY LLC — PATENT PENDING</div>
      </footer>

      <NIOChat />
    </div>
  );
}
