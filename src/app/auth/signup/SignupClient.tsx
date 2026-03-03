'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface TenantInfo {
    id: string;
    name: string;
}

export default function SignupClient({ tenantUrl }: { tenantUrl: string }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null);
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            // 1. Check existing session
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push('/debug/user');
                return;
            }

            // 2. Extract slug from subdomain (logic adapted from proxy.ts)
            const hostname = window.location.hostname;
            const parts = hostname.split('.');
            let slug = '';

            // Basic logic: Get the first part of the hostname
            if (parts.length > 2 || (parts.length === 2 && !hostname.includes('localhost'))) {
                slug = parts[0];
            } else if (hostname.includes('localhost') && parts.length === 2) {
                // Support for developer-friendly tenant.localhost
                slug = parts[0];
            }

            if (!slug) {
                console.warn('No tenant slug found in subdomain');
                // Optional: if generic signup is allowed, don't redirect
                // For now, we'll allow generic if on main domain, otherwise redirect
                // router.push('/404'); 
                return;
            }

            // 3. Fetch tenant info via RPC
            const { data, error: rpcError } = await supabase
                .rpc('get_public_tenant_info', { lookup_slug: slug });

            if (rpcError || !data) {
                console.error('Failed to fetch tenant info:', rpcError);
                // Redirect to 404 if slug is specified but invalid
                router.push('/404');
                return;
            }

            // 4. Store tenant info
            setTenantInfo({
                id: data.id,
                name: data.name
            });
        };

        initializeAuth();
    }, [router]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    tenant_id: tenantInfo?.id,
                },
                emailRedirectTo: `${tenantUrl}/`,
            },
        });

        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
            // Optional: redirect to login or show success message
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
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            {tenantInfo ? `Join ${tenantInfo.name} Workspace` : 'Create an account'}
                        </h1>
                        <p className="text-gray-500 font-medium">
                            {tenantInfo
                                ? `Enter your details to join your team on Cobuddy`
                                : 'Start your collaborative journey with Cobuddy'}
                        </p>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-2xl shadow-gray-100">
                    {success ? (
                        <div className="text-center space-y-4 py-8">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold">Check your email</h2>
                            <p className="text-gray-500 text-sm">We've sent a confirmation link to {email}.</p>
                            <Link href="/auth/login" className="btn-primary inline-block w-full py-3 mt-4">
                                Go to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSignup} className="space-y-5">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">First name</label>
                                    <input
                                        type="text"
                                        placeholder="Jane"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Last name</label>
                                    <input
                                        type="text"
                                        placeholder="Doe"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Email address</label>
                                <input
                                    type="email"
                                    placeholder="jane@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                                <input
                                    type="password"
                                    placeholder="Min. 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-4 text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating account...' : 'Create account'}
                            </button>
                        </form>
                    )}

                    {!success && (
                        <>
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-100"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">or sign up with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors font-semibold text-xs">
                                    Google
                                </button>
                                <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors font-semibold text-xs">
                                    GitHub
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Link */}
                <p className="text-center text-sm font-medium text-gray-500">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-black font-bold hover:underline decoration-2 underline-offset-4 tracking-tight">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
