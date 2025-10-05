"use client";

import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-16">
      <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-black/5 shadow-sm">
        <div className="grid gap-10 p-6 md:grid-cols-3 md:p-8">
          <nav className="space-y-2">
            <h3 className="text-sm font-semibold text-[color:var(--g700, #1f2937)]">Home</h3>
            <ul className="space-y-2 text-[color:var(--g700, #1f2937)]">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/bays" className="hover:underline">Golf Bays</Link></li>
              <li><Link href="/booking" className="hover:underline">Booking</Link></li>
              <li><Link href="/food-and-drink" className="hover:underline">Food &amp; Drink</Link></li>
            </ul>
          </nav>

          <div className="space-y-2 text-[color:var(--g700, #1f2937)]">
            <h3 className="text-sm font-semibold">Contact Us</h3>
            <p className="text-sm leading-6">
              Address: 1385 Woodroffe Ave,<br />
              Ottawa, ON K2G 1V8
            </p>
            <p className="text-sm">Phone: (613) 727-4723</p>
            <p className="text-sm">Email: <a className="hover:underline" href="mailto:info@celticvirtualgolf.ca">info@celticvirtualgolf.ca</a></p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[color:var(--g700, #1f2937)]">Sign Up For Offers + Updates</h3>
            <p className="text-sm text-[color:var(--g700, #1f2937)]">
              Become a member and get bay offers, savings, and updates on what’s new at Celtic Virtual Golf.
            </p>
            <Link
              href="/join"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 bg-[color:var(--g600,#2f6f3b)] text-white hover:brightness-110 transition"
            >
              Join Us Now →
            </Link>
          </div>
        </div>

        <div className="border-t border-black/10 px-6 py-4 md:px-8 flex items-center justify-between">
          <p className="text-xs text-[color:var(--g700, #1f2937)]">
            © 2025 Celtic Virtual Golf. All Rights Reserved
          </p>
          <div className="flex items-center gap-3">
            <a aria-label="Facebook" href="#" className="p-1.5 rounded-lg ring-1 ring-black/10 hover:bg-black/5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2h-3a5 5 0 0 0-5 5v3H6v4h3v8z"/></svg>
            </a>
            <a aria-label="Instagram" href="#" className="p-1.5 rounded-lg ring-1 ring-black/10 hover:bg-black/5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.5A2.5 2.5 0 1 0 12 15a2.5 2.5 0 0 0 0-5.5zM18 6.5a1 1 0 1 1 0 2.001 1 1 0 0 1 0-2.001z"/></svg>
            </a>
            <a aria-label="YouTube" href="#" className="p-1.5 rounded-lg ring-1 ring-black/10 hover:bg-black/5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.5a4 4 0 0 0-2.8-2.8C18.5 4 12 4 12 4s-6.5 0-8.2.7A4 4 0 0 0 1 7.5 41.6 41.6 0 0 0 1 12a41.6 41.6 0 0 0 .8 4.5 4 4 0 0 0 2.8 2.8C5.5 20 12 20 12 20s6.5 0 8.2-.7a4 4 0 0 0 2.8-2.8A41.6 41.6 0 0 0 23 12a41.6 41.6 0 0 0 0-4.5zM10 15.5v-7l6 3.5-6 3.5z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
