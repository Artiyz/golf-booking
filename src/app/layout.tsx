"use client";

import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";
import ReactQueryClientProvider from "./providers";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [homeOpen, setHomeOpen] = useState(false);
    const [aboutOpen, setAboutOpen] = useState(false);
    const [homeHover, setHomeHover] = useState(false);
    const [golfBaysHover, setGolfBaysHover] = useState(false);
    const [foodHover, setFoodHover] = useState(false);
    const [aboutHover, setAboutHover] = useState(false);
    const [bookingHover, setBookingHover] = useState(false);
    const [dashboardHover, setDashboardHover] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const hoverTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});

    const handleMouseEnter = (key: string, setter: (val: boolean) => void) => {
        if (hoverTimeouts.current[key]) {
            clearTimeout(hoverTimeouts.current[key]);
        }
        hoverTimeouts.current[key] = setTimeout(() => setter(true), 50);
    };

    const handleMouseLeave = (key: string, setter: (val: boolean) => void) => {
        if (hoverTimeouts.current[key]) {
            clearTimeout(hoverTimeouts.current[key]);
        }
        hoverTimeouts.current[key] = setTimeout(() => setter(false), 50);
    };

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
                <head>
                <style>{`
    @keyframes bounce-icon {
      0%, 100% { transform: scale(1) translateY(0); }
      25% { transform: scale(1.15) translateY(-8px); }
      50% { transform: scale(0.95) translateY(-4px); }
      75% { transform: scale(1.05) translateY(-2px); }
    }
    .home-icon-enter {
      animation: bounce-icon 0.8s ease-out;
    }
    
    /* Fancy dropdown menu styles */
    @keyframes dropdown-appear {
      0% {
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    .dropdown-menu {
      animation: dropdown-appear 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      background: linear-gradient(135deg, #ffffff 0%, #f8fffe 100%);
      border: 1.5px solid rgba(47, 122, 69, 0.12);
      backdrop-filter: blur(8px);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    
    .dropdown-item {
      position: relative;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #334155;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      letter-spacing: -0.01em;
    }
    
    .dropdown-item:hover {
      background: linear-gradient(90deg, rgba(47, 122, 69, 0.08) 0%, rgba(47, 122, 69, 0.04) 100%);
      color: #2f7a45;
      padding-left: 1.25rem;
      font-weight: 600;
    }
    
    .dropdown-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 0;
      background: linear-gradient(180deg, #2f7a45 0%, #3e9154 100%);
      border-radius: 0 2px 2px 0;
      transition: height 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .dropdown-item:hover::before {
      height: 60%;
    }
    
    .dropdown-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, rgba(47, 122, 69, 0.1) 50%, transparent 100%);
      margin: 0.5rem 0;
    }
  `}</style>
                </head>
            <body className="min-h-screen bg-site antialiased">
                <header className="sticky top-0 z-20 bg-[color:var(--g600)] text-white shadow-md shadow-black/10 backdrop-blur-sm border-b border-white/10">
                    <nav
                        ref={navRef}
                        className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between"
                    >
                        <Link href="/" className="text-lg font-semibold tracking-tight">
                            Celtic Virtual Golf
                        </Link>

                        <div className="flex items-center gap-3 text-[15px]">
                            {/* Home + sections */}
                            <div className="relative">
                                <span className={`${navItemFx} ${isActive("/") ? activeFx : ""}`}>
                                    <Link
                                        href="/"
                                        className={`${linkFx} pr-0 inline-flex items-center justify-center w-[60px]`}
                                        onMouseEnter={() => handleMouseEnter('home', setHomeHover)}
                                        onMouseLeave={() => handleMouseLeave('home', setHomeHover)}
                                    >
                                        {(isActive("/") || homeHover) ? (
                                            <img
                                                key={homeHover ? "hover" : "active"}
                                                src="/golf/icons/Property 1=home.svg"
                                                alt="Home"
                                                className="w-5 h-5 home-icon-enter"
                                            />
                                        ) : (
                                            "Home"
                                        )}
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
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </span>

                                {homeOpen && (
                                    <div className="absolute left-0 top-full mt-2 w-52 rounded-2xl dropdown-menu shadow-2xl overflow-hidden">
                                        <div className="py-2.5 px-1">
                                            <a href="/#about" className="dropdown-item block px-4 py-2.5 rounded-lg">
                                                About Us
                                            </a>
                                            <a href="/#ready-to-tee" className="dropdown-item block px-4 py-2.5 rounded-lg">
                                                Ready To Tee Up
                                            </a>
                                            <div className="dropdown-divider"></div>
                                            <a href="/#explore-bays" className="dropdown-item block px-4 py-2.5 rounded-lg">
                                                Explore Our Golf Bays
                                            </a>
                                            <a href="/#events" className="dropdown-item block px-4 py-2.5 rounded-lg">
                                                Upcoming Events
                                            </a>
                                            <div className="dropdown-divider"></div>
                                            <a href="/#souvenirs" className="dropdown-item block px-4 py-2.5 rounded-lg">
                                                Souvenirs
                                            </a>
                                            <a href="/#faq" className="dropdown-item block px-4 py-2.5 rounded-lg">
                                                FAQ
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Golf Bays */}
                            <Link
                                href="/golf-bays"
                                className={`${linkFx} inline-flex items-center justify-center w-[85px] ${isActive("/golf-bays") ? "font-semibold" : ""}`}
                                onMouseEnter={() => handleMouseEnter('golfBays', setGolfBaysHover)}
                                onMouseLeave={() => handleMouseLeave('golfBays', setGolfBaysHover)}
                            >
                                <span className={navItemFx}>
                                    {(isActive("/golf-bays") || golfBaysHover) ? (
                                        <img
                                            key={golfBaysHover ? "hover" : "active"}
                                            src="/golf/icons/Property 1=golf-1.svg"
                                            alt="Golf Bays"
                                            className="w-5 h-5 home-icon-enter"
                                        />
                                    ) : (
                                        "Golf Bays"
                                    )}
                                </span>
                            </Link>

                            {/* Food & Drink */}
                            <Link
                                href="/food"
                                className={`${linkFx} inline-flex items-center justify-center w-[105px] ${isActive("/food") ? "font-semibold" : ""}`}
                                onMouseEnter={() => handleMouseEnter('food', setFoodHover)}
                                onMouseLeave={() => handleMouseLeave('food', setFoodHover)}
                            >
                                <span className={navItemFx}>
                                    {(isActive("/food") || foodHover) ? (
                                        <img
                                            key={foodHover ? "hover" : "active"}
                                            src="/golf/icons/Property 1=drink.svg"
                                            alt="Food & Drink"
                                            className="w-5 h-5 home-icon-enter"
                                        />
                                    ) : (
                                        "Food & Drink"
                                    )}
                                </span>
                            </Link>

                            {/* About Us */}
                            <div className="relative">
                                <span className={`${navItemFx} ${isActive("/about") ? activeFx : ""}`}>
                                    <Link
                                        href="/about"
                                        className={`${linkFx} pr-0 inline-flex items-center justify-center w-[75px]`}
                                        onMouseEnter={() => handleMouseEnter('about', setAboutHover)}
                                        onMouseLeave={() => handleMouseLeave('about', setAboutHover)}
                                    >
                                        {(isActive("/about") || aboutHover) ? (
                                            <img
                                                key={aboutHover ? "hover" : "active"}
                                                src="/golf/icons/Property 1=aboutus.svg"
                                                alt="About Us"
                                                className="w-5 h-5 home-icon-enter"
                                            />
                                        ) : (
                                            "About Us"
                                        )}
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
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </span>

                                {aboutOpen && (
                                    <div className="absolute left-0 top-full mt-2 w-52 rounded-2xl dropdown-menu shadow-2xl overflow-hidden">
                                        <div className="py-2.5 px-1">
                                            <a href="/about#our-story" className="dropdown-item block px-4 py-2.5 rounded-lg">
                                                Our Story
                                            </a>
                                            <a href="/about#meet-team" className="dropdown-item block px-4 py-2.5 rounded-lg">
                                                Meet the Team
                                            </a>
                                            <a href="/about#careers" className="dropdown-item block px-4 py-2.5 rounded-lg">
                                                Careers
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Booking */}
                            <Link
                                href="/booking"
                                className={`${linkFx} inline-flex items-center justify-center w-[70px] ${isActive("/booking") ? "font-semibold" : ""}`}
                                onMouseEnter={() => handleMouseEnter('booking', setBookingHover)}
                                onMouseLeave={() => handleMouseLeave('booking', setBookingHover)}
                            >
                                <span className={navItemFx}>
                                    {(isActive("/booking") || bookingHover) ? (
                                        <img
                                            key={bookingHover ? "hover" : "active"}
                                            src="/golf/icons/Property 1=booking.svg"
                                            alt="Booking"
                                            className="w-5 h-5 home-icon-enter"
                                        />
                                    ) : (
                                        "Booking"
                                    )}
                                </span>
                            </Link>

                            {/* Dashboard */}
                            <Link
                                href="/dashboard"
                                className={`${linkFx} inline-flex items-center justify-center w-[90px] ${isActive("/dashboard") ? "font-semibold" : ""}`}
                                onMouseEnter={() => handleMouseEnter('dashboard', setDashboardHover)}
                                onMouseLeave={() => handleMouseLeave('dashboard', setDashboardHover)}
                            >
                                <span className={navItemFx}>
                                    {(isActive("/dashboard") || dashboardHover) ? (
                                        <img
                                            key={dashboardHover ? "hover" : "active"}
                                            src="/golf/icons/Property 1=dashboard.svg"
                                            alt="Dashboard"
                                            className="w-5 h-5 home-icon-enter"
                                        />
                                    ) : (
                                        "Dashboard"
                                    )}
                                </span>
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
