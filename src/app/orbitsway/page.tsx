'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const PLANETS = [
  { i: 0, route: '/axis/production', tip: 'ORB — Platform Command Center', label: 'ORB', desc: 'Operational Resource Base', image: '/exogalaxy/orbitsway-orb.PNG', size: 148, hasOrbRing: true },
  { i: 1, route: '/login', tip: 'NIO — Network Intelligence Operator', label: 'NIO', desc: 'Network Intelligence Operator', image: '/exogalaxy/orbitsway-NIO.PNG', size: 138 },
  { i: 2, route: '/login', tip: 'NEXUS — Tenant Cockpit', label: 'NEXUS', desc: 'Native Executive Utility System', image: '/exogalaxy/orbitsway-nexus 2.PNG', size: 160, moons: '● ● ● ● ●' },
  { i: 3, route: '/oul', tip: 'OUL — Company Discovery Directory', label: 'OUL', desc: 'Occupational Utility Locator', image: '/exogalaxy/Orbitsway-oul.PNG', size: 132, hasOulFloaty: true },
  { i: 4, route: '/cue', tip: 'CUE — Calendar Gateway', label: 'CUE', desc: 'Calendar Under Execution', image: '/exogalaxy/orbitsway-cue.PNG', size: 126 },
  { i: 5, route: '/axis/production', tip: 'ATLAS — Asset Hub & Inventory', label: 'ATLAS', desc: 'Approved Technology & Labor Asset System', image: '/exogalaxy/orbitsway-atlas.PNG', size: 138 },
  { i: 6, route: '/axis/production', tip: 'AXIS — Visual Design Runtime', label: 'AXIS', desc: 'Advanced Execution Integration System', image: '/exogalaxy/orbitsway-axis.PNG', size: 138 },
  { i: 7, route: '/axis/production', tip: 'LIBRA — Logistics & Blueprint Bridge', label: 'LIBRA', desc: 'Logistics Interpretation Bridge Routing Apparatus', image: '/exogalaxy/orbitsway-libra.JPEG', size: 148, hasLibraRing: true, hasProprint: true },
];

export default function OrbitsWay() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [classifiedOn, setClassifiedOn] = useState(false);
  const [launched, setLaunched] = useState(false);

  // Carousel state
  const posRef = useRef(3);
  const targetRef = useRef(3);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startTarget = useRef(3);
  const [positions, setPositions] = useState<any[]>([]);
  const [raPositions, setRaPositions] = useState<any[]>([]);
  const [floatyPos, setFloatyPos] = useState({ x: 0, y: 0 });
  const [proprintPos, setProprintPos] = useState({ x: 0, y: 0, zIndex: 0 });
  const [nioBubblePos, setNioBubblePos] = useState({ x: 0, y: 0 });

  // Canvas Starfield
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

    const stars = Array.from({ length: 700 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.2,
      a: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.00008 + 0.00003,
      tw: Math.random() * Math.PI * 2
    }));

    const band = Array.from({ length: 350 }, () => {
      const t = Math.random();
      return {
        x: t + (Math.random() - 0.5) * 0.30,
        y: 0.15 + t * 0.70 + (Math.random() - 0.5) * 0.20,
        r: Math.random() * 1.8 + 0.3,
        a: Math.random() * 0.35 + 0.05,
        hue: Math.random() > 0.6 ? 200 : 280
      };
    });

    let animationFrameId: number;
    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#000005");
      bg.addColorStop(0.3, "#01000a");
      bg.addColorStop(0.6, "#000508");
      bg.addColorStop(1, "#000002");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const mw = ctx.createLinearGradient(0, H * 0.1, W, H * 0.9);
      mw.addColorStop(0, "rgba(60,40,120,0)");
      mw.addColorStop(0.3, "rgba(80,60,160,.06)");
      mw.addColorStop(0.5, "rgba(100,80,200,.10)");
      mw.addColorStop(0.7, "rgba(80,60,160,.06)");
      mw.addColorStop(1, "rgba(60,40,120,0)");
      ctx.fillStyle = mw;
      ctx.fillRect(0, 0, W, H);

      band.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},60%,85%,${p.a})`;
        ctx.fill();
      });

      stars.forEach(s => {
        s.tw += 0.015;
        const fl = s.a * (0.7 + 0.3 * Math.sin(s.tw));
        s.y += s.speed;
        if (s.y > 1) s.y -= 1;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${fl})`;
        ctx.fill();
        if (s.r > 1.2) {
          ctx.beginPath();
          ctx.arc(s.x * W, s.y * H, s.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,220,255,${fl * 0.12})`;
          ctx.fill();
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Carousel Layout Logic
  const layout = useCallback(() => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    const W = r.width;
    const H = r.height;
    const cx = W / 2;
    const scrollY = H * 0.73;
    const gap = Math.min(176, W * 0.152);
    const N = PLANETS.length;

    posRef.current += (targetRef.current - posRef.current) * 0.095;

    const wrapDelta = (d: number, n: number) => {
      d = ((d % n) + n) % n;
      if (d > n / 2) d -= n;
      return d;
    };

    let lx = cx, ly = scrollY, ox = cx, oy = scrollY;
    let libraZ = 100;

    const newPositions = PLANETS.map((planet) => {
      const d = wrapDelta(planet.i - posRef.current, N);
      const dist = Math.abs(d);
      const x = cx + d * gap;
      const y = scrollY + Math.min(68, dist * 17);
      const s = 1 + Math.max(0, (1 - dist)) * 0.80;
      const z = 1000 - Math.round(dist * 200);

      if (planet.label === 'LIBRA') { lx = x; ly = y; libraZ = z; }
      if (planet.label === 'OUL') { ox = x; oy = y; }

      return { x, y, s, z };
    });

    setPositions(newPositions);

    const radii = [90, 120, 150];
    const offsets = [0, Math.PI * 0.65, Math.PI * 1.35];
    const speeds = [3200, 4100, 3600];
    const time = performance.now();

    const newRaMoons = [0, 1, 2].map((i) => {
      const ct = time / speeds[i] + offsets[i];
      return { x: Math.cos(ct) * radii[i], y: Math.sin(ct) * radii[i] };
    });
    setRaPositions(newRaMoons);

    const proprintTime = time / 2200;
    setProprintPos({
      x: lx + Math.cos(proprintTime) * 115,
      y: ly + Math.sin(proprintTime) * 115,
      zIndex: libraZ - 1
    });

    const oulTime = time / 1800;
    setFloatyPos({ x: ox + Math.cos(oulTime) * 72, y: oy + Math.sin(oulTime) * 72 });

    if (!launched) {
      // Position NIO bubble even lower to be clearly central-bottom and avoid logo
      const bubbleTop = H * 0.55;
      setNioBubblePos({ x: cx, y: bubbleTop });
    }

    requestAnimationFrame(layout);
  }, [launched]);

  useEffect(() => {
    const frameId = requestAnimationFrame(layout);
    return () => cancelAnimationFrame(frameId);
  }, [layout]);

  const handleWheel = (e: React.WheelEvent) => {
    const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    targetRef.current += dx * 0.006;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startTarget.current = targetRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    targetRef.current = startTarget.current - (e.clientX - startX.current) * 0.008;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    targetRef.current = Math.round(targetRef.current);
  };

  const handleNioLaunch = () => {
    if (launched) return;
    setLaunched(true);
    setTimeout(() => { router.push('/'); }, 2200);
  };

  return (
    <div className="fixed inset-0 bg-black text-white font-orbitron overflow-hidden select-none" ref={containerRef}>
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      {/* Header Banner */}
      <div className="fixed top-0 left-0 w-full z-10 flex justify-center pt-0 pointer-events-none h-[210px] bg-gradient-to-b from-black/80 via-black/30 to-transparent">
        <Image src="/exogalaxy/orbitsway-os.PNG" alt="COBUDDY OS" width={1000} height={360} className="h-[360px] w-auto -translate-y-12 scale-x-[0.78] origin-top mix-blend-lighten opacity-[0.98] brightness-[1.06] contrast-[1.18] drop-shadow-[0_0_8px_rgba(0,255,136,0.22)]" />
      </div>

      {/* RA sun central module */}
      <div
        id="raSun"
        className="absolute left-[9%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-[104px] h-[104px] rounded-full z-[15] cursor-pointer border border-white/10 flex flex-col items-center justify-center bg-black animate-ra-breath overflow-visible"
        onClick={() => setClassifiedOn(!classifiedOn)}
      >
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <Image src="/exogalaxy/Orbitsway-ra.PNG" alt="RA Sun" fill className="object-cover" />
        </div>
        <div className="relative z-[2] text-[#ffe090] text-[16px] tracking-[4px] font-black drop-shadow-[0_0_14px_rgba(255,190,80,0.8)]">RA</div>
        <div className="relative z-[2] text-[#ffcc70] text-[6px] opacity-70 mt-[3px] tracking-[2px]">Recorded Archives</div>

        <div className={`transition-opacity duration-400 ${!classifiedOn ? 'opacity-0' : 'opacity-100'}`}>
          {raPositions.map((pos, i) => (
            <div key={i} className="absolute left-1/2 top-1/2 rounded-full border border-[#57c8ff]/30 shadow-[0_0_12px_rgba(87,200,255,0.18)]"
              style={{
                width: i === 1 ? '64px' : i === 2 ? '58px' : '60px', height: i === 1 ? '64px' : i === 2 ? '58px' : '60px',
                transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`
              }}
            >
              <Image src={`/exogalaxy/orbitsway-${['zuz', 'nova', 'aph'][i]}.PNG`} alt="Moon" fill className="object-cover rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Carousel */}
      <div className="fixed inset-0 z-20 cursor-grab active:cursor-grabbing" onWheel={handleWheel} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
        {positions.length > 0 && PLANETS.map((planet, i) => (
          <div key={i} className="absolute rounded-full border border-white/10 flex flex-col items-center justify-center text-center overflow-hidden transition-shadow duration-150 bg-black cursor-pointer hover:shadow-[0_0_55px_rgba(0,255,136,0.38)]"
            style={{ width: `${planet.size}px`, height: `${planet.size}px`, left: `${positions[i].x}px`, top: `${positions[i].y}px`, zIndex: positions[i].z, transform: `translate(-50%, -50%) scale(${positions[i].s})` }}
            onClick={(e) => { e.stopPropagation(); router.push(planet.route); }}
            onMouseEnter={() => setTooltip(planet.tip)} onMouseLeave={() => setTooltip(null)}
          >
            <Image src={planet.image} alt={planet.label} fill className="object-cover opacity-80" />
            <div className="relative z-[4] font-black text-[15px] tracking-[2px] text-white drop-shadow-[0_0_12px_rgba(0,0,0,0.95)]">{planet.label}</div>
            <div className="relative z-[4] text-[7px] max-w-[130px] leading-relaxed mt-1 text-white/90 drop-shadow-[0_0_6px_rgba(0,0,0,0.95)]">{planet.desc}</div>
            {planet.hasOrbRing && <div className="absolute -inset-3 rounded-full border border-dashed border-[#00ff88]/30 animate-ring-pulse pointer-events-none z-[5]" />}
          </div>
        ))}

        {/* Proprint Moon & Floaty */}
        <div className="absolute w-[76px] h-[76px] rounded-full border border-white/10 shadow-[0_0_16px_rgba(0,255,136,0.12)] flex items-center justify-center text-center overflow-hidden cursor-pointer"
          style={{ left: `${proprintPos.x}px`, top: `${proprintPos.y}px`, zIndex: proprintPos.zIndex }}
          onClick={(e) => { e.stopPropagation(); router.push('/visitor/login?next=past-events'); }}
        >
          <Image src="/exogalaxy/orbitsway-proprint.PNG" alt="PROPRINT" fill className="object-cover" />
          <div className="relative z-10 text-[8px] font-black tracking-wider">PROPRINT</div>
        </div>
        <div className="absolute text-[20px] drop-shadow-[0_0_8px_rgba(0,200,80,0.3)] pointer-events-none" style={{ left: `${floatyPos.x}px`, top: `${floatyPos.y}px`, zIndex: 1000 }}>🦉</div>

        {/* NIO Entrance Bubble */}
        <div className={`absolute z-[60] cursor-pointer -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 animate-orbit-bubble-hover ${launched ? 'animate-orbit-bubble-launch' : ''}`}
          style={{ left: `${nioBubblePos.x}px`, top: `${nioBubblePos.y}px` }} onClick={handleNioLaunch}
        >
          <Image src="/exogalaxy/nio-help-bot.png" alt="NIO" width={220} height={220} className="mix-blend-multiply drop-shadow-[0_0_20px_rgba(0,255,136,0.35)]" />
          <div className="absolute left-1/2 top-full -translate-x-1/2 mt-2 text-[9px] tracking-[2px] text-[#00ff88] drop-shadow-[0_0_10px_rgba(0,255,136,0.55)] whitespace-nowrap">[TAP TO ENTER EXOGALAXY]</div>
        </div>
      </div>

      <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 bg-black/80 border border-[#00ff88]/20 text-[#00ff88] text-[9px] tracking-[2px] px-4 py-1.5 rounded-sm pointer-events-none z-[100] transition-opacity duration-200 ${tooltip ? 'opacity-100' : 'opacity-0'}`}>{tooltip}</div>
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 text-white/15 text-[7px] tracking-[3px] pointer-events-none z-50">← SCROLL TO EXPLORE ORBITSWAY →</div>

    </div>
  );
}
