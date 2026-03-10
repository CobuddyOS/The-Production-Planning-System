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

        router.push('/nexus');
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
        <div className="min-h-screen bg-white selection:bg-black selection:text-white flex flex-col items-center justify-center p-6 font-[family-name:var(--font-outfit)]">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <Link href="/" className="transition-transform hover:scale-110 active:scale-95">
                        <Image
                            src="/logo.png"
                            alt="Cobuddy Logo"
                            width={64}
                            height={64}
                            className="rounded-2xl shadow-sm"
                        />
                    </Link>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
                        <p className="text-gray-500 font-medium">Log in to your Cobuddy account</p>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-2xl shadow-gray-100">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Email address</label>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <Link href="#" className="text-xs font-bold text-gray-400 hover:text-black transition-colors">
                                    Forgot?
                                </Link>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
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

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-100"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3.5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors font-semibold text-sm">
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3.5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors font-semibold text-sm">
                            GitHub
                        </button>
                    </div>
                </div>

                {/* Footer Link */}
                <p className="text-center text-sm font-medium text-gray-500">
                    New to Cobuddy?{" "}
                    <Link href="/signup" className="text-black font-bold hover:underline decoration-2 underline-offset-4 tracking-tight">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}
