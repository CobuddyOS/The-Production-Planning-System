'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';

interface TenantData {
    host: string;
    tenant_slug: string;
    tenant_id: string | null;
    tenant_name: string | null;
    authenticated: boolean;
    user_id: string | null;
    status: 'found' | 'not_found';
    debug: {
        auth_error: string | null;
        db_error: string | null;
        has_session: boolean;
        cookies_present: boolean;
    };
}

export default function DebugTenantPage() {
    const [data, setData] = useState<TenantData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTenantData = async () => {
            try {
                // Get the session from the browser — the browser client works fine cross-subdomain
                const { data: { session } } = await supabase.auth.getSession();

                const headers: Record<string, string> = {
                    'Content-Type': 'application/json',
                };

                // If the user is logged in, pass the JWT so the server can authenticate
                // This is needed because cookies don't cross subdomains on localhost
                if (session?.access_token) {
                    headers['Authorization'] = `Bearer ${session.access_token}`;
                    console.log('[DEBUG PAGE] Sending Authorization header with JWT');
                } else {
                    console.warn('[DEBUG PAGE] No session found — request will be unauthenticated');
                }

                const response = await fetch('/api/debug/tenant', { headers });
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching tenant debug data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTenantData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center font-[family-name:var(--font-outfit)]">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl"></div>
                    <div className="w-32 h-4 bg-gray-100 rounded-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12 font-[family-name:var(--font-outfit)]">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center transition-transform group-hover:scale-105">
                            <Image src="/logo.png" alt="Logo" width={24} height={24} />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Cobuddy</span>
                    </Link>
                    <Link
                        href="/debug/user"
                        className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-black transition-colors"
                    >
                        Debug User →
                    </Link>
                </div>

                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50">
                    <div className="space-y-8">
                        <div className="flex items-center gap-6 pb-8 border-b border-gray-50">
                            <div className="w-20 h-20 bg-black text-white rounded-[1.5rem] flex items-center justify-center text-3xl font-bold">
                                {data?.tenant_name?.[0].toUpperCase() || 'T'}
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold tracking-tight">
                                    Tenant Debug Info
                                </h1>
                                <p className="text-gray-500 font-medium">
                                    {data?.tenant_id ? 'Active Tenant Found' : 'No Tenant Found'} · {data?.authenticated ? (
                                        <span className="text-green-600 font-bold">Authenticated</span>
                                    ) : (
                                        <span className="text-orange-500 font-bold">Unauthenticated</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hostname</p>
                                <p className="text-lg font-semibold">{data?.host}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Detected Slug</p>
                                <div className="flex items-center gap-2">
                                    <code className="text-sm bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 font-mono">
                                        {data?.tenant_slug || '—'}
                                    </code>
                                    {!data?.tenant_slug && (
                                        <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                            Root Domain
                                        </span>
                                    )}
                                </div>
                            </div>

                            {data?.user_id && (
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">User ID (from JWT)</p>
                                    <code className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-lg border border-green-100 block font-mono">
                                        {data.user_id}
                                    </code>
                                </div>
                            )}

                            {data?.tenant_id ? (
                                <>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tenant ID</p>
                                        <code className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100 block font-mono">
                                            {data.tenant_id}
                                        </code>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tenant Name</p>
                                        <p className="text-lg font-semibold text-black">
                                            {data.tenant_name}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="p-6 bg-red-50 border border-red-100 rounded-2xl space-y-3">
                                    <div className="flex items-center gap-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-extrabold uppercase tracking-tight text-sm">Tenant Not Found</span>
                                    </div>
                                    <p className="text-red-500 text-sm font-medium leading-relaxed">
                                        Could not find a tenant with the slug <span className="font-bold underline">&quot;{data?.tenant_slug || 'N/A'}&quot;</span> in the database.
                                        {!data?.authenticated && ' You are not authenticated — if your RLS requires auth, this is the cause.'}
                                    </p>
                                    {data?.debug?.db_error && (
                                        <code className="text-xs text-red-400 bg-red-100 px-2 py-1 rounded block font-mono">{data.debug.db_error}</code>
                                    )}
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-50">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Raw Response</p>
                                <pre className="text-xs bg-gray-900 text-gray-300 p-6 rounded-2xl overflow-auto leading-relaxed shadow-inner font-mono">
                                    {JSON.stringify(data, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
