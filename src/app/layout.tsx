'use client'

import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";
import ReactQueryClientProvider from "./providers";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            setTimeout(() => {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, []);

    const isActive = (path: string) => pathname === path;

    return (
        <html lang="en">
            <body className="min-h-screen bg-site antialiased">
                <header className="sticky top-0 z-20 bg-[color:var(--g600)] text-white shadow">
                    <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
                        <Link href="/" className="text-lg font-semibold tracking-tight">
                            Celtic Virtual Golf
                        </Link>
                        <div className="flex items-center gap-6 text-[15px]">
                            <div className="relative group">
                                <Link href="/" className={`transition-opacity hover:opacity-70 flex items-center gap-1 ${isActive('/') ? 'font-bold border-b-2 border-white' : ''}`}>
                                    Home
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                                <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="py-2">
                                        <a href="/#about" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">About Us</a>
                                        <a href="/#ready-to-tee" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Ready To Tee Up</a>
                                        <a href="/#explore-bays" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Explore Our Golf Bays</a>
                                        <a href="/#events" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Upcoming Events</a>
                                        <a href="/#souvenirs" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Souvenirs</a>
                                        <a href="/#faq" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">FAQ</a>
                                    </div>
                                </div>
                            </div>
                            <Link href="/golf-bays" className={`transition-opacity hover:opacity-70 ${isActive('/golf-bays') ? 'font-bold border-b-2 border-white' : ''}`}>Golf Bays</Link>
                            <Link href="/food" className={`transition-opacity hover:opacity-70 ${isActive('/food') ? 'font-bold border-b-2 border-white' : ''}`}>Food & Drink</Link>
                            <div className="relative group">
                                <span className={`transition-opacity hover:opacity-70 flex items-center gap-1 cursor-pointer ${isActive('/about') ? 'font-bold border-b-2 border-white' : ''}`}>
                                    About
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="py-2">
                                        <a href="/about#our-story" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Our Story</a>
                                        <a href="/about#meet-team" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Meet the Team</a>
                                        <a href="/about#careers" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Careers</a>
                                    </div>
                                </div>
                            </div>
                            <Link href="/booking" className={`transition-opacity hover:opacity-70 ${isActive('/booking') ? 'font-bold border-b-2 border-white' : ''}`}>Booking</Link>
                            <Link href="/admin" className={`transition-opacity hover:opacity-70 ${isActive('/admin') ? 'font-bold border-b-2 border-white' : ''}`}>Admin</Link>
                            <Link href="/dashboard" className={`transition-opacity hover:opacity-70 ${isActive('/dashboard') ? 'font-bold border-b-2 border-white' : ''}`}>Dashboard</Link>
                        </div>
                    </nav>
                </header>
                <main className="mx-auto max-w-6xl px-4 pt-12 pb-10">
                    <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
                </main>
            </body>
        </html>
    );
}