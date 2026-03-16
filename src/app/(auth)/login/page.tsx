'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const redirectAfterLogin = useCallback(async () => {
        try {
            const res = await fetch('/api/auth/me', { method: 'GET' });
            const json = (await res.json()) as { ok?: boolean; role?: string };
            if (json?.role === 'cobuddyadmin') {
                router.push('/platform');
                return;
            }
        } catch {
            // fall back to default redirect below
        }

        router.push('/nexus/ballrooms');
    }, [router]);

    useEffect(() => {
        const checkSession = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                await redirectAfterLogin();
            }
        };
        checkSession();
    }, [redirectAfterLogin]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            await redirectAfterLogin();
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen bg-[url('/bg-img.png')] bg-cover bg-center bg-fixed text-foreground selection:bg-white/10 selection:text-white flex items-center justify-center p-6 font-montserrat relative">
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 w-full max-w-md space-y-8">
                {/* Header */}
                <div className="flex flex-col items-center text-center">
                    <Link href="/" className="transition-transform scale-110 active:scale-95">
                        <Image
                            src="/cobuddy_logo.png"
                            alt="Cobuddy Logo"
                            width={300}
                            height={300}
                            className="h-35 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                        />
                    </Link>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-extrabold tracking-tight font-orbitron text-white">Welcome back</h1>
                        <p className="text-white/70 font-orbitron text-sm">Log in to your Cobuddy account</p>
                    </div>
                </div>

                {/* Form Container */}
                <div className="neon-glass-form neon-form rounded-[2rem] p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-200 text-sm rounded-xl font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white/80 ml-1">Email address</label>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-2xl border border-white/10 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-sm font-semibold text-white/80">Password</label>
                                <Link href="#" className="text-xs font-bold text-purple-200 hover:text-white transition-colors">
                                    Forgot?
                                </Link>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-2xl border border-white/10 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 text-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Continue'}
                        </button>
                    </form>

                </div>

                {/* Footer Link */}
                <p className="text-center text-sm font-medium text-white/60">
                    New to Cobuddy?{" "}
                    <Link href="/signup" className="text-white font-bold hover:underline decoration-2 underline-offset-4 tracking-tight">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}
