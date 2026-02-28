'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function Home() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white flex flex-col items-center">
      {/* Navbar */}
      <nav className="glass-nav px-6 py-4 flex items-center justify-between w-[95%] max-w-7xl mx-auto border-1 rounded-full mt-4 top-4">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Cobuddy Logo"
            width={40}
            height={40}
          />
          <span className="text-xl font-bold tracking-tight">Cobuddy</span>
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
              <Link href="/auth/login" className="btn-secondary">
                Log in
              </Link>
              <Link href="/auth/signup" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-10 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-gradient leading-[1.1]">
            Design together, <br />
            faster than ever.
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            The multi-tenant design system for modern businesses. Get your business listed and design your invoices with ease.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href={session ? "/debug/user" : "/auth/signup"} className="btn-primary px-8 py-4 text-lg w-full sm:w-auto">
              {session ? "Open Dashboard" : "Get Started for Free"}
            </Link>
            <Link href="/auth/login" className="btn-secondary px-8 py-4 text-lg w-full sm:w-auto flex items-center gap-2">
              Watch Demo
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-8 text-gray-400 text-sm">
        © 2026 Cobuddy OS. All rights reserved.
      </footer>
    </div>
  );
}
