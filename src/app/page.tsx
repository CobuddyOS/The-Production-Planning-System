'use client';

import Image from "next/image";
import Link from "next/link";
import { useSession } from '@/features/auth';

export default function Home() {
  const { session } = useSession();

  return (
    <div className="min-h-screen bg-[url('/bg-img.png')] bg-cover bg-center bg-fixed text-foreground selection:bg-white/10 selection:text-white">
      <div className="relative min-h-screen flex flex-col items-center">
        <div className="absolute inset-0 bg-black/60" />

        {/* Navbar */}
        <nav className="relative z-10 w-[95%] max-w-7xl mx-auto mt-4">
          <div className="neon-glass-card rounded-full px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/cobuddy_logo.png"
                alt="Cobuddy Logo"
                width={300}
                height={300}
                className="h-20 w-auto object-contain"
              />
            </div>

            <div className="flex items-center gap-3">
              {session ? (
                <Link href="/debug/user" className="btn-primary flex items-center gap-2">
                  Profile
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary">
                    Log in
                  </Link>
                  <Link href="/signup" className="btn-primary">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto px-6 py-16">
          <div className="w-full max-w-5xl p-10 md:p-14 text-center space-y-10">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/60 font-montserrat">
                Collaborative OS
              </p>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05] font-orbitron">
                Design together,
                <br />
                faster than ever.
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-montserrat">
                A multi-tenant platform for modern teams to manage assets, workflows, and shared spaces with a futuristic edge.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={session ? "/debug/user" : "/signup"} className="btn-primary px-8 py-4 text-lg w-full sm:w-auto">
                {session ? "Open Dashboard" : "Get Started for Free"}
              </Link>
              <Link href="/login" className="btn-secondary px-8 py-4 text-lg w-full sm:w-auto flex items-center justify-center gap-2">
                Watch Demo
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3 pt-6">
              {[
                { title: "ATLAS", desc: "Global asset registry and bundles." },
                { title: "ORB", desc: "Request bridge for approvals and ops." },
                { title: "NEXUS", desc: "Unified command center for teams." },
              ].map((card) => (
                <div key={card.title} className="neon-glass-card p-5 text-left">
                  <h3 className="text-lg font-bold text-white font-orbitron">{card.title}</h3>
                  <p className="text-sm text-white/70 mt-2 font-montserrat">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="relative z-10 py-8 text-white/50 text-sm font-montserrat">
          © 2026 Cobuddy OS. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
