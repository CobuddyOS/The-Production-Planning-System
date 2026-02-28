'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';

export default function DebugUserPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

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
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-black transition-colors"
                    >
                        Sign out
                    </button>
                </div>

                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50">
                    <div className="space-y-8">
                        <div className="flex items-center gap-6 pb-8 border-b border-gray-50">
                            <div className="w-20 h-20 bg-black text-white rounded-[1.5rem] flex items-center justify-center text-3xl font-bold">
                                {user?.email?.[0].toUpperCase() || '?'}
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold tracking-tight">
                                    User Debug Profile
                                </h1>
                                <p className="text-gray-500 font-medium">
                                    {user ? 'Authenticated Session' : 'No Active Session'}
                                </p>
                            </div>
                        </div>

                        {user ? (
                            <div className="grid gap-6">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                                    <p className="text-lg font-semibold">{user.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">User ID</p>
                                    <code className="text-sm bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 block font-mono">
                                        {user.id}
                                    </code>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Sign In</p>
                                    <p className="text-sm font-medium text-gray-600">
                                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-gray-50">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Metadata Payload</p>
                                    <pre className="text-xs bg-gray-900 text-gray-300 p-6 rounded-2xl overflow-auto leading-relaxed shadow-inner">
                                        {JSON.stringify(user.user_metadata, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 space-y-6">
                                <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-bold inline-block border border-orange-100">
                                    Authentication Required
                                </div>
                                <p className="text-gray-500 max-w-sm mx-auto">
                                    No user session was found. Please log in to view the debug information.
                                </p>
                                <Link href="/auth/login" className="btn-primary inline-block px-12">
                                    Go to Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
