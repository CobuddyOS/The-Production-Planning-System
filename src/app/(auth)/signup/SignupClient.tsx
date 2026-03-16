'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTenantInit, useSignup } from '@/features/auth';

export default function SignupClient({ tenantUrl }: { tenantUrl: string }) {
    const { tenantInfo } = useTenantInit();
    const { formData, setField, loading, error, success, handleSubmit } = useSignup({ tenantInfo, tenantUrl });

    return (
        <div className="min-h-screen bg-[url('/bg-img.png')] bg-cover bg-center bg-fixed text-foreground selection:bg-white/10 selection:text-white flex items-center justify-center p-6 font-montserrat relative">
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 w-full max-w-md space-y-8">
                {/* Header */}
                <div className="flex flex-col items-center text-center">
                    <Link href="/" className="transition-transform scale-110 ">
                        <Image
                            src="/cobuddy_logo.png"
                            alt="Cobuddy Logo"
                            width={300}
                            height={300}
                            className="h-35 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                        />
                    </Link>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-extrabold tracking-tight font-orbitron text-white">
                            {tenantInfo ? `Join ${tenantInfo.name} Workspace` : 'Create an account'}
                        </h1>
                        <p className="text-white/70 font-orbitron text-sm">
                            {tenantInfo
                                ? 'Enter your details to join your team on Cobuddy'
                                : 'Start your collaborative journey with Cobuddy'}
                        </p>
                    </div>
                </div>

                {/* Form Container */}
                <div className="neon-glass-form neon-form rounded-[2rem] p-8">
                    {success ? (
                        <div className="text-center space-y-4 py-8">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white">Check your email</h2>
                            <p className="text-white/60 text-sm">We&apos;ve sent a confirmation link to {formData.email}.</p>
                            <Link href="/login" className="btn-primary inline-block w-full py-3 mt-4">
                                Go to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-200 text-sm rounded-xl font-medium">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-white/80 ml-1">First name</label>
                                    <input
                                        type="text"
                                        placeholder="Jane"
                                        value={formData.firstName}
                                        onChange={(e) => setField('firstName', e.target.value)}
                                        className="w-full px-5 py-3 rounded-2xl border border-white/10 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition-all text-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-white/80 ml-1">Last name</label>
                                    <input
                                        type="text"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={(e) => setField('lastName', e.target.value)}
                                        className="w-full px-5 py-3 rounded-2xl border border-white/10 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition-all text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-white/80 ml-1">Email address</label>
                                <input
                                    type="email"
                                    placeholder="jane@example.com"
                                    value={formData.email}
                                    onChange={(e) => setField('email', e.target.value)}
                                    className="w-full px-5 py-3 rounded-2xl border border-white/10 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition-all text-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-white/80 ml-1">Password</label>
                                <input
                                    type="password"
                                    placeholder="Min. 8 characters"
                                    value={formData.password}
                                    onChange={(e) => setField('password', e.target.value)}
                                    className="w-full px-5 py-3 rounded-2xl border border-white/10 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition-all text-sm"
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

                </div>

                {/* Footer Link */}
                <p className="text-center text-sm font-medium text-white/60">
                    Already have an account?{" "}
                    <Link href="/login" className="text-white font-bold hover:underline decoration-2 underline-offset-4 tracking-tight">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
