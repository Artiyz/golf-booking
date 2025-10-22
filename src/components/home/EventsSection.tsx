import Link from "next/link";

export default function EventsSection() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-14">
            <div className="mx-auto w-full max-w-6xl bg-section-a section-card p-8 sm:p-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="rttu-eyebrow">What's Happening</span>
                    <h2 className="rttu-title">Upcoming Events</h2>
                    <p className="mt-4 text-slate-700 max-w-2xl mx-auto text-[15.5px] leading-relaxed">
                        Join us for virtual golf leagues, social nights, and exclusive member events at our state-of-the-art simulators!
                    </p>
                </div>

                {/* Timeline Events */}
                <div className="max-w-4xl mx-auto">
                    {/* Event 1: Monday Night League */}
                    <div className="flex gap-6 mb-8">
                        {/* Date Badge - Left */}
                        <div className="flex-shrink-0 w-24 text-center">
                            <div className="inline-block bg-white rounded-2xl shadow-lg p-4 border-2" style={{ borderColor: 'var(--g600)' }}>
                                <div className="text-xs font-bold uppercase" style={{ color: 'var(--g500)' }}>EVERY</div>
                                <div className="text-3xl font-extrabold mt-1" style={{ color: 'var(--g600)' }}>MON</div>
                            </div>
                        </div>

                        {/* Event Content - Right */}
                        <div className="flex-1 rttu-card">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ background: 'rgba(62, 145, 84, 0.1)', color: '#047857' }}>
                                League Play
                            </span>
                            <h3 className="rttu-card-title text-xl mb-2">Monday Night League</h3>
                            <p className="rttu-card-text mb-4">
                                Join our competitive weekly league! Compete across all 6 bays with rotating courses and real-time leaderboards.
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                                <span>⏰ 6:00 PM - 9:00 PM</span>
                                <span>•</span>
                                <span>Standard Bays (4 guests max)</span>
                            </div>
                            <Link href="#" className="btn">
                                Join League
                            </Link>
                        </div>
                    </div>

                    {/* Event 2: Corporate Team Building */}
                    <div className="flex gap-6 mb-8">
                        {/* Date Badge - Left */}
                        <div className="flex-shrink-0 w-24 text-center">
                            <div className="inline-block bg-white rounded-2xl shadow-lg p-4 border-2" style={{ borderColor: 'var(--g600)' }}>
                                <div className="text-xs font-bold uppercase" style={{ color: 'var(--g500)' }}>NOV</div>
                                <div className="text-3xl font-extrabold mt-1" style={{ color: 'var(--g600)' }}>22</div>
                            </div>
                        </div>

                        {/* Event Content - Right */}
                        <div className="flex-1 rttu-card">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ background: 'rgba(62, 145, 84, 0.1)', color: '#047857' }}>
                                Group Event
                            </span>
                            <h3 className="rttu-card-title text-xl mb-2">Corporate Team Building Night</h3>
                            <p className="rttu-card-text mb-4">
                                Perfect for companies! Book our premium bays for team building with food & drink packages and fun challenges.
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                                <span>⏰ 5:00 PM - 9:00 PM</span>
                                <span>•</span>
                                <span>Premium Bays (up to 10 guests)</span>
                            </div>
                            <Link href="#" className="btn">
                                Book Your Group
                            </Link>
                        </div>
                    </div>

                    {/* Event 3: Friday Happy Hour */}
                    <div className="flex gap-6 mb-8">
                        {/* Date Badge - Left */}
                        <div className="flex-shrink-0 w-24 text-center">
                            <div className="inline-block bg-white rounded-2xl shadow-lg p-4 border-2" style={{ borderColor: 'var(--g600)' }}>
                                <div className="text-xs font-bold uppercase" style={{ color: 'var(--g500)' }}>EVERY</div>
                                <div className="text-3xl font-extrabold mt-1" style={{ color: 'var(--g600)' }}>FRI</div>
                            </div>
                        </div>

                        {/* Event Content - Right */}
                        <div className="flex-1 rttu-card">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ background: 'rgba(62, 145, 84, 0.1)', color: '#047857' }}>
                                Social Night
                            </span>
                            <h3 className="rttu-card-title text-xl mb-2">Friday Happy Hour</h3>
                            <p className="rttu-card-text mb-4">
                                Drop in any Friday for discounted bay rates and special food & drink menu! All 6 bays available for walk-ins.
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                                <span>⏰ 5:00 PM - 11:00 PM</span>
                                <span>•</span>
                                <span>All Bays - Special Pricing</span>
                            </div>
                            <Link href="#" className="btn">
                                See Rates
                            </Link>
                        </div>
                    </div>
                </div>

                {/* View All Button */}
                <div className="text-center mt-10">
                    <Link href="#" className="btn">
                        View Full Calendar →
                    </Link>
                </div>
            </div>
        </section>
    );
}