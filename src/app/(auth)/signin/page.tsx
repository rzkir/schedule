"use client"

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import Link from 'next/link';

import { useAuth } from '@/utils/context/AuthContext';

export default function SignInPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
            <div className="w-full container card flex flex-col md:flex-row overflow-hidden bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] shadow-lg">
                {/* Left: Form */}
                <div className="md:w-1/2 w-full flex flex-col justify-center p-8 md:p-12 bg-[var(--card)] text-[var(--card-foreground)]">
                    <div className="mb-8 flex items-center gap-2">
                        <span className="font-bold text-xl text-[var(--primary)]">Schdule With Rizki Ramadhan</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-[var(--primary)]">Welcome Back</h2>
                    <p className="mb-6 text-[var(--muted-foreground)]">Enter your email and password to access your account.</p>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor="email" className="text-[var(--foreground)]">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="sellora@company.com"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                required
                                autoFocus
                                className="bg-[var(--background)] text-[var(--foreground)] border border-[var(--input)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor="password" className="text-[var(--foreground)]">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    required
                                    className="bg-[var(--background)] text-[var(--foreground)] border border-[var(--input)] pr-12 focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] hover: cursor-pointer bg-transparent text-[var(--muted-foreground)]"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.036 3.807 6.035 6.75 9.75 6.75 1.772 0 3.543-.457 5.02-1.223M21.75 12c-.511-.955-1.24-2.073-2.25-3.223m-3.5-2.527A6.75 6.75 0 0 0 12 6.75c-3.715 0-7.714 2.943-9.75 6.75a10.477 10.477 0 0 0 1.73 3.777m3.5 2.527A6.75 6.75 0 0 0 12 17.25c3.715 0 7.714-2.943 9.75-6.75a10.477 10.477 0 0 0-1.73-3.777" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12S5.25 6.75 12 6.75 21.75 12 21.75 12 18.75 17.25 12 17.25 2.25 12 2.25 12Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="remember" checked={remember} onCheckedChange={(checked: boolean) => setRemember(checked)} />
                            <Label htmlFor="remember" className="text-[var(--foreground)]">Remember Me</Label>
                        </div>
                        <Button type="submit" disabled={loading} className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 mb-2 text-[var(--primary-foreground)]">
                            {loading && (
                                <svg className="animate-spin h-5 w-5 mr-2 inline text-[var(--primary-foreground)]" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                            )}
                            Log In
                        </Button>
                    </form>

                    <p className="text-center text-sm text-[var(--muted-foreground)]">
                        Don&apos;t Have an Account?{' '}
                    </p>
                    <div className="mt-8 text-xs flex justify-between text-[var(--muted-foreground)]">
                        <span>Copyright © 2023 Sellora Enterprises LTD.</span>
                        <Link href="#" className="hover:underline text-[var(--primary)]">Privacy Policy</Link>
                    </div>
                </div>
                {/* Right: Illustration/Info */}
                <div className="hidden md:flex md:w-1/2 bg-[var(--primary)] items-center justify-center p-8 relative">
                    <div className="text-[var(--card-foreground)] max-w-xs mx-auto text-center">
                        <h3 className="text-xl font-bold mb-4 text-[var(--primary-foreground)]">Effortlessly manage your team and operations.</h3>
                        <p className="mb-8 text-sm text-[var(--primary-foreground)]">Log in to access your CRM dashboard and manage your team.</p>
                        <div className="rounded-xl overflow-hidden shadow-lg bg-[var(--card)]/10 p-4">
                            {/* Dummy dashboard illustration */}
                            <div className="bg-[var(--card)] rounded-lg p-4 text-xs text-[var(--card-foreground)]">
                                <div className="flex gap-2 mb-2">
                                    <div className="w-1/2">
                                        <div className="font-bold text-lg text-[var(--primary)]">$16,274</div>
                                        <div className="text-[var(--muted-foreground)]">Revenue</div>
                                    </div>
                                    <div className="w-1/2">
                                        <div className="font-bold text-lg text-[var(--primary)]">92.4%</div>
                                        <div className="text-[var(--muted-foreground)]">Growth</div>
                                    </div>
                                </div>
                                <div className="h-16 bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] rounded mb-2" />
                                <div className="flex justify-between text-[var(--muted-foreground)]">
                                    <span>Team</span>
                                    <span>Operations</span>
                                    <span>Sales</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
