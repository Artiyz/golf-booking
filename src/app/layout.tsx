"use client";

import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";
import ReactQueryClientProvider from "./providers";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import React from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [homeOpen, setHomeOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHomeOpen(false);
    setAboutOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!navRef.current?.contains(e.target as Node)) {
        setHomeOpen(false);
        setAboutOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  const isActive = (path: string) => pathname === path;

  // underline animation (applies to the whole item: text + chevron)
  const navItemFx =
    "relative inline-flex items-center after:absolute after:left-0 " +
    "after:-bottom-1 after:h-[2px] after:bg-white after:w-0 " +
    "after:transition-all after:duration-300 hover:after:w-full";

  const activeFx = "font-semibold after:w-full";

  const linkFx = "transition-opacity hover:opacity-90";

  const chevronBtn = "rounded-md ml-1 transition hover:bwhite/10 hover:shadow";

  return (
    <html lang="en">
      <body className="min-h-screen bg-site antialiased">
        <header className="sticky top-0 z-20 bg-[color:var(--g600)] text-white shadow-md shadow-black/10 backdrop-blur-sm border-b border-white/10">
          <nav
            ref={navRef}
            className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between"
          >
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Celtic Virtual Golf
            </Link>

            <div className="flex items-center gap-6 text-[15px]">
              {/* Home + sections (underline spans text + chevron) */}
              <div className="relative">
                <span
                  className={`${navItemFx} ${isActive("/") ? activeFx : ""}`}
                >
                  <Link href="/" className={`${linkFx} pr-0`}>
                    Home
                  </Link>
                  <button
                    aria-label="Open Home sections"
                    className={chevronBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setHomeOpen((v) => !v);
                      setAboutOpen(false);
                    }}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>

                {homeOpen && (
                  <div className="absolute left-0 top-full mt-2 w-56 rounded-xl bg-white text-slate-800 shadow-lg ring-1 ring-black/10 overflow-hidden">
                    <div className="py-2">
                      <a
                        href="/#about"
                        className="block px-4 py-2 text-sm hover:bg-slate-100"
                      >
                        About Us
                      </a>
                      <a
                        href="/#ready-to-tee"
                        className="block px-4 py-2 text-sm hover:bg-slate-100"
                      >
                        Ready To Tee Up
                      </a>
                      <a
                        href="/#explore-bays"
                        className="block px-4 py-2 text-sm hover:bg-slate-100"
                      >
                        Explore Our Golf Bays
                      </a>
                      <a
                        href="/#events"
                        className="block px-4 py-2 text-sm hover:bg-slate-100"
                      >
                        Upcoming Events
                      </a>
                      <a
                        href="/#souvenirs"
                        className="block px-4 py-2 text-sm hover:bg-slate-100"
                      >
                        Souvenirs
                      </a>
                      <a
                        href="/#faq"
                        className="block px-4 py-2 text-sm hover:bg-slate-100"
                      >
                        FAQ
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/golf-bays"
                className={`${navItemFx} ${linkFx} ${
                  isActive("/golf-bays") ? activeFx : ""
                }`}
              >
                Golf Bays
              </Link>

              <Link
                href="/food"
                className={`${navItemFx} ${linkFx} ${
                  isActive("/food") ? activeFx : ""
                }`}
              >
                Food &amp; Drink
              </Link>

              <div className="relative">
                <span
                  className={`${navItemFx} ${
                    isActive("/about") ? activeFx : ""
                  }`}
                >
                  <Link href="/about" className={`${linkFx} pr-0`}>
                    About Us
                  </Link>
                  <button
                    aria-label="Open About menu"
                    className={chevronBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setAboutOpen((v) => !v);
                      setHomeOpen(false);
                    }}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>

                {aboutOpen && (
                  <div className="absolute left-0 top-full mt-2 w-56 rounded-xl bg-white text-slate-800 shadow-lg ring-1 ring-black/10 overflow-hidden">
                    <div className="py-2">
                      <a
                        href="/about#our-story"
                        className="block px-4 py-2 text-sm hover:bg-slate-100"
                      >
                        Our Story
                      </a>
                      <a
                        href="/about#meet-team"
                        className="block px-4 py-2 text-sm hover:bg-slate-100"
                      >
                        Meet the Team
                      </a>
                      <a
                        href="/about#careers"
                        className="block px-4 py-2 text-sm hover:bg-slate-100"
                      >
                        Careers
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/booking"
                className={`${navItemFx} ${linkFx} ${
                  isActive("/booking") ? activeFx : ""
                }`}
              >
                Booking
              </Link>

              <Link
                href="/dashboard"
                className={`${navItemFx} ${linkFx} ${
                  isActive("/dashboard") ? activeFx : ""
                }`}
              >
                Dashboard
              </Link>
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
