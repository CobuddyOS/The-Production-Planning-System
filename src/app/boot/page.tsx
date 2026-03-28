'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function BootPage() {
  const router = useRouter();
  const [bootStep, setBootStep] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [introStarted, setIntroStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const bootLines = [
    "INITIALIZING COBUDDY OS...",
    "Loading Atlas Module...",
    "Loading Axis Runtime...",
    "Connecting Libra Engine...",
    "Starting Nexus Control...",
    "Neo Intelligence Online...",
    "SYSTEM READY"
  ];

  useEffect(() => {
    // Sequential boot lines
    bootLines.forEach((_, i) => {
      setTimeout(() => {
        setBootStep(i + 1);
      }, i * 700);
    });

    // Transit to Video after boot lines
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, bootLines.length * 700 + 500);

    return () => clearTimeout(timer);
  }, []);

  const handleVideoEnded = () => {
    router.push('/orbitsway');
  };

  const handleVideoError = () => {
    setShowVideo(false);
    setUseFallback(true);
    startFallbackIntro();
  };

  const startFallbackIntro = () => {
    setIntroStarted(true);
    // After CSS animations end (around 8s total), redirect
    setTimeout(() => {
      router.push('/orbitsway');
    }, 8500);
  };

  return (
    <main className="fixed inset-0 bg-black text-[#00ff88] font-orbitron overflow-hidden z-[9999]">
      {/* Boot Screen */}
      {!showVideo && !useFallback && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[700px] text-[18px] leading-[32px] z-10">
          {bootLines.map((line, i) => (
            <span
              key={i}
              className={`block transition-opacity duration-300 ${bootStep > i ? 'opacity-100' : 'opacity-0'}`}
            >
              {line}
            </span>
          ))}
        </div>
      )}

      {/* Video Intro */}
      {showVideo && (
        <div className="fixed inset-0 flex items-center justify-center z-20 animate-fade-in bg-black">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            className="w-full h-full object-cover"
          >
            <source src="/exogalaxy/logo-intro.MP4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* Fallback Intro */}
      {useFallback && (
        <div className={`fixed inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${introStarted ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex gap-[10px] text-[70px] tracking-[12px]">
            {['C', 'O', 'B', 'U', 'D', 'D', 'Y'].map((char, i) => (
              <span
                key={i}
                className="opacity-0 animate-boot-drop"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                {char}
              </span>
            ))}
          </div>

          <div className={`absolute top-[30%] left-[-200px] text-[30px] opacity-0 ${introStarted ? 'animate-boot-fly-in' : ''}`}>
            NIO
          </div>

          <div className={`absolute h-1 bg-[#00ff88] top-[60%] left-1/2 -translate-x-1/2 transition-all duration-1500 ${introStarted ? 'w-[420px]' : 'w-0'}`} />

          <svg className="mt-8" width="200" height="100" viewBox="0 0 200 100">
            <path
              d="M20 60 C10 20, 80 20, 70 60 S140 100,160 60"
              stroke="#00ff88"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className={`[stroke-dasharray:300] [stroke-dashoffset:300] ${introStarted ? 'animate-boot-draw-path' : ''}`}
            />
          </svg>

          <div className={`absolute w-3 h-3 rounded-full bg-[#00ff88] top-[60%] left-1/2 opacity-0 ${introStarted ? 'animate-boot-pulse-move' : ''}`} />

          <div className="absolute bottom-0 w-full h-[40%] bg-gradient-to-b from-[#111] to-black -z-10" />
        </div>
      )}

    </main>
  );
}
