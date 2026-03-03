'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';

interface PingResult {
    ok: boolean;
    tenant_slug?: string;
    tenant_id?: string;
    role?: string;
    user_id?: string;
    error?: string;
}

interface PingState {
    status: 'idle' | 'loading' | 'done';
    httpStatus: number | null;
    result: PingResult | null;
}

export default function DebugPingPage() {
    const [ping, setPing] = useState<PingState>({ status: 'idle', httpStatus: null, result: null });
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUserEmail(session?.user?.email ?? null);
        });
    }, []);

    const runPing = async () => {
        setPing({ status: 'loading', httpStatus: null, result: null });

        const { data: { session } } = await supabase.auth.getSession();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
        }

        try {
            const res = await fetch('/api/admin/ping', { headers });
            const result = await res.json();
            setPing({ status: 'done', httpStatus: res.status, result });
        } catch (err) {
            setPing({
                status: 'done',
                httpStatus: null,
                result: { ok: false, error: 'Network error or server crash' },
            });
        }
    };

    const statusColor = () => {
        if (ping.httpStatus === 200) return 'bg-green-50 border-green-100 text-green-700';
        if (ping.httpStatus === 401) return 'bg-orange-50 border-orange-100 text-orange-700';
        if (ping.httpStatus === 403) return 'bg-red-50 border-red-100 text-red-700';
        return 'bg-gray-50 border-gray-100 text-gray-700';
    };

    const statusLabel = () => {
        if (ping.httpStatus === 200) return '✅ 200 OK — Access Granted';
        if (ping.httpStatus === 401) return '🔒 401 Unauthorized — Not logged in';
        if (ping.httpStatus === 403) return '🚫 403 Forbidden — Tenant or role mismatch';
        return '⏳ Pending...';
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12 font-[family-name:var(--font-outfit)]">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center transition-transform group-hover:scale-105">
                            <Image src="/logo.png" alt="Logo" width={24} height={24} />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Cobuddy</span>
                    </Link>
                    <div className="flex gap-4">
                        <Link href="/debug/user" className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-black transition-colors">User →</Link>
                        <Link href="/debug/tenant" className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-black transition-colors">Tenant →</Link>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 space-y-8">

                    {/* Title */}
                    <div className="flex items-center gap-6 pb-8 border-b border-gray-50">
                        <div className="w-20 h-20 bg-black text-white rounded-[1.5rem] flex items-center justify-center text-3xl">
                            🛡️
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight">Admin Ping Test</h1>
                            <p className="text-gray-500 font-medium">
                                Tests the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">GET /api/admin/ping</code> guard
                            </p>
                        </div>
                    </div>

                    {/* Current session info */}
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Logged in as</p>
                        <p className="text-base font-semibold">
                            {userEmail ? (
                                <span className="text-green-600">{userEmail}</span>
                            ) : (
                                <span className="text-orange-500">Not authenticated</span>
                            )}
                        </p>
                    </div>

                    {/* Test cases explainer */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Acceptance Tests</p>
                        <div className="space-y-2 text-sm font-medium text-gray-600">
                            <div className="flex items-start gap-2">
                                <span className="mt-0.5">1️⃣</span>
                                <span>Login as Tenant A → visit Tenant B subdomain → expect <code className="bg-red-50 text-red-600 px-1 rounded text-xs">403</code></span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="mt-0.5">2️⃣</span>
                                <span>Logout → hit this page → expect <code className="bg-orange-50 text-orange-600 px-1 rounded text-xs">401</code></span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="mt-0.5">3️⃣</span>
                                <span>Correct tenant + role <code className="bg-green-50 text-green-600 px-1 rounded text-xs">owner/admin</code> → expect <code className="bg-green-50 text-green-600 px-1 rounded text-xs">200</code></span>
                            </div>
                        </div>
                    </div>

                    {/* Ping button */}
                    <button
                        onClick={runPing}
                        disabled={ping.status === 'loading'}
                        className="w-full py-4 bg-black text-white rounded-2xl font-bold text-base tracking-tight hover:bg-gray-900 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {ping.status === 'loading' ? 'Pinging...' : 'Run Ping Test →'}
                    </button>

                    {/* Result */}
                    {ping.status === 'done' && ping.result && (
                        <div className="space-y-4">
                            <div className={`border rounded-2xl px-5 py-3 font-bold text-sm ${statusColor()}`}>
                                {statusLabel()}
                            </div>

                            {ping.result.ok ? (
                                <div className="grid gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Role</p>
                                        <span className="inline-block bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-lg text-sm font-bold font-mono">
                                            {ping.result.role}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tenant Slug</p>
                                        <code className="text-sm bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 font-mono">{ping.result.tenant_slug}</code>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tenant ID</p>
                                        <code className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100 block font-mono">{ping.result.tenant_id}</code>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">User ID</p>
                                        <code className="text-sm bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 block font-mono">{ping.result.user_id}</code>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                                    <p className="text-red-600 text-sm font-semibold">{ping.result.error}</p>
                                </div>
                            )}

                            <div className="pt-2 border-t border-gray-50">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Raw Response</p>
                                <pre className="text-xs bg-gray-900 text-gray-300 p-5 rounded-2xl overflow-auto leading-relaxed font-mono">
                                    {JSON.stringify({ httpStatus: ping.httpStatus, ...ping.result }, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
