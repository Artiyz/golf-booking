import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";
import ReactQueryClientProvider from "./providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface antialiased">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
          <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight">Virtual Virtual Golf</Link>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/">Home</Link>
              <Link href="/booking">Booking</Link>
              <Link href="/admin">Admin Dashboard</Link>
              <Link href="/about">About</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">
          <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
        </main>
      </body>
    </html>
  );
}
