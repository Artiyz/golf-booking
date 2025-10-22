import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";

const imgs = {
  hero: "/golf/images/about-hero.jpg",
  story: "/golf/images/bay-1.jpg",
  lookA: "/golf/images/bay-3.jpg",
  lookB: "/golf/images/bay-4.jpg",
  lookC: "/golf/images/bay-5.jpg",
  lookD: "/golf/images/bay-6.jpg",
  cta1: "/golf/images/card-book.jpg",
  cta2: "/golf/images/card-food.jpg",
  cta3: "/golf/images/card-member.jpg",
};

const cardBase = "rounded-3xl shadow-xl ring-1 ring-black/5 overflow-hidden";

const chip =
  "rounded-xl px-3 py-2 shadow-sm ring-1 ring-emerald-900/10 bg-[linear-gradient(180deg,#fcfffd_0%,#f3fdf7_100%)] text-slate-800 flex flex-col gap-0.5 text-xs";

function IconBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3l3.2 6.5 7.2 1-5.2 5.1 1.3 7.1L12 19l-6.5 3.7 1.3-7.1L1.6 10.5l7.2-1L12 3z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen text-slate-900">
      <section id="hero" className="full-bleed -mt-17">
        <div className="relative min-h-[60vh]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${imgs.hero})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="relative z-10 mx-auto max-w-6xl flex items-center min-h-[65vh] px-8 justify-start lg:pr-7 pt-8 md:pt-47">
            <div
              className={`${cardBase} bg-white/85 backdrop-blur-[2px] p-4 sm:p-6 md:p-7 w-full max-w-md sm:max-w-xl lg:max-w-2xl mx-auto lg:mx-0 text-sm lg:text-base shadow-2xl lg:shadow-xl`}
            >
              <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--g600)]/90">
                About Us
              </span>
              <h1 className="mt-2 mb-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[color:var(--g600)]">
                Practice meets play
              </h1>
              <p className="mt-2 mb-4 text-[15.5px] leading-7 text-slate-700">
                A modern simulator studio for grooving your swing, playing
                world-class courses, or hanging with friends—any time, any
                weather. We’re open year-round with bright, comfortable bays and
                friendly staff so you can settle in and have fun right away.
              </p>
              <div className="mt-4 mb-3 flex flex-wrap gap-3">
                <Link href="/dashboard" className="btn">
                  Book a bay
                </Link>
                <Link href="/signup" className="btn-secondary">
                  Become A Member
                </Link>
              </div>
              {/* smaller 4 chips */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className={chip}>
                  <div className="text-base font-semibold">5+</div>
                  <div className="opacity-70">Years open</div>
                </div>
                <div className={chip}>
                  <div className="text-base font-semibold">4</div>
                  <div className="opacity-70">Simulator bays</div>
                </div>
                <div className={chip}>
                  <div className="text-base font-semibold">10k+</div>
                  <div className="opacity-70">Happy customers</div>
                </div>
                <div className={chip}>
                  <div className="text-base font-semibold">4.9</div>
                  <div className="opacity-70">Avg. rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section id="our-story" className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div
            className={`${cardBase} bg-[linear-gradient(180deg,#f9fefb_0%,#eefcf5_100%)]`}
          >
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={imgs.story}
                alt="Studio ambiance"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-semibold">Our story</h2>
              <div className="mt-3 space-y-3 text-[15.5px] leading-7 text-slate-800">
                <p>
                  We built a space that feels premium yet friendly—where great
                  shots and great company come easy.
                </p>
                <p>
                  From easy booking to comfy seating and reliable tech, every
                  detail is tuned for flow and fun.
                </p>
                <p>
                  Whether it’s practice, a lesson, or a night out, you’ll find
                  welcoming vibes and room to play.
                </p>
              </div>
            </div>
          </div>

          <div
            className={`${cardBase} p-6 md:p-8 bg-[linear-gradient(180deg,#f7fefb_0%,#eefcf5_100%)]`}
          >
            <h2 className="text-xl font-semibold">A look inside</h2>
            <p className="mt-3 text-[15.5px] leading-7 text-slate-800">
              Tour-level launch data, comfy seating, and a curated playlist.
              Bring your clubs or rent from us. Bright projectors, accurate
              tracking, and plenty of space—perfect for practice or a relaxed
              night out.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl ring-1 ring-black/5 shadow">
                <Image
                  src={imgs.lookA}
                  alt="Bay view 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl ring-1 ring-black/5 shadow">
                <Image
                  src={imgs.lookB}
                  alt="Bay view 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl ring-1 ring-black/5 shadow">
                <Image
                  src={imgs.lookC}
                  alt="Bay view 3"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl ring-1 ring-black/5 shadow">
                <Image
                  src={imgs.lookD}
                  alt="Bay view 4"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <Link href="/golf-bays" className="btn">
                View Bays
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="meet-team" className="mx-auto max-w-7xl px-4 py-14">
        <div
          className={`${cardBase} p-6 md:p-8 bg-[linear-gradient(180deg,#f7fff9_0%,#eefcf5_100%)]`}
        >
          <div className="flex items-center gap-2">
            <IconBadge className="h-5 w-5 text-emerald-700" />
            <h2 className="text-xl font-semibold">Meet the team</h2>
          </div>

          <p className="mt-3 text-sm text-slate-700">
            Explore our talented team who keep Celtic Virtual Golf running
            smoothly — from coaching to guest experience and operations.
          </p>

          <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2">
            <div className="rttu-card p-4 flex flex-col items-center h-full">
              <div className="w-full max-w-[220px] h-[330px] overflow-hidden rounded-2xl bg-slate-300">
                <img
                  src="https://placehold.co/400x600/cccccc/ffffff?text=Ava"
                  alt="Ava"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 text-center w-full">
                <div className="font-bold text-lg text-slate-900">Ava</div>
                <div className="text-sm text-emerald-700 font-semibold">
                  Studio Manager
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  With over 8 years in hospitality management, Ava ensures every
                  guest has an exceptional experience.
                </p>
              </div>
            </div>

            <div className="rttu-card p-4 flex flex-col items-center h-full">
              <div className="w-full max-w-[220px] h-[330px] overflow-hidden rounded-2xl bg-slate-300">
                <img
                  src="https://placehold.co/400x600/cccccc/ffffff?text=Noah"
                  alt="Noah"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 text-center w-full">
                <div className="font-bold text-lg text-slate-900">Noah</div>
                <div className="text-sm text-emerald-700 font-semibold">
                  PGA Coach
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  PGA certified with 15+ years teaching experience. Specializes
                  in simulator technology and data-driven coaching.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[
              { name: "Mia", role: "Guest Experience" },
              { name: "Liam", role: "Operations" },
              { name: "Olivia", role: "Events" },
              { name: "Lucas", role: "Technical Lead" },
              { name: "Zoe", role: "Hospitality" },
              { name: "Ethan", role: "Front of House" },
            ].map((p) => (
              <div
                key={p.name}
                className="rttu-card p-4 flex flex-col items-center h-full"
              >
                <div className="w-full max-w-[160px] h-[240px] overflow-hidden rounded-2xl bg-slate-300">
                  <img
                    src={`https://placehold.co/300x450/cccccc/ffffff?text=${encodeURIComponent(
                      p.name
                    )}`}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4 text-center">
                  <div className="font-medium text-slate-900">{p.name}</div>
                  <div className="text-sm text-slate-700">{p.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAREERS */}
      <section id="careers" className="mx-auto max-w-7xl px-4 py-14">
        <div className={`${cardBase} overflow-hidden bg-white`}>
          <div className="grid md:grid-cols-[1fr_2fr] gap-0">
            <div className="p-6 md:p-8 bg-section-a">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-5 h-5"
                  style={{ color: "var(--g600)" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span
                  className="text-xs uppercase tracking-widest font-bold"
                  style={{ color: "var(--g600)" }}
                >
                  Careers
                </span>
              </div>

              <h2
                className="text-2xl md:text-3xl font-extrabold mb-4"
                style={{ color: "var(--g600)" }}
              >
                Join Our Team
              </h2>

              <p className="text-sm text-slate-700 leading-relaxed mb-6">
                We're building something special at Celtic Virtual Golf—a place
                where passion for the game meets cutting-edge technology and
                genuine hospitality.
              </p>

              <div className="space-y-3">
                {[
                  "Competitive Pay & Benefits",
                  "Flexible Schedule",
                  "Growth Opportunities",
                  "Fun Environment",
                ].map((label) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <div
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                      style={{ background: "rgba(62, 145, 84, 0.15)" }}
                    >
                      <svg
                        className="w-4 h-4"
                        style={{ color: "var(--g600)" }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="font-semibold text-sm text-slate-900">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-5">
                Open Positions
              </h3>

              <div className="space-y-3">
                {[
                  {
                    title: "Golf Instructor / Coach",
                    meta: "Full-time / Part-time",
                    desc: "Teach golfers of all levels using our state-of-the-art simulators. PGA certification preferred but not required.",
                  },
                  {
                    title: "Guest Services Associate",
                    meta: "Full-time",
                    desc: "Be the welcoming face of Celtic Virtual Golf. Handle bookings, greet guests, and ensure exceptional experiences.",
                  },
                  {
                    title: "Food & Beverage Server",
                    meta: "Part-time",
                    desc: "Serve food and drinks to guests in our bays. Previous hospitality experience preferred.",
                  },
                  {
                    title: "Technical Support Specialist",
                    meta: "Part-time",
                    desc: "Maintain and troubleshoot our simulator systems. Tech-savvy with basic IT knowledge required.",
                  },
                ].map((p) => (
                  <div
                    key={p.title}
                    className="bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-[color:var(--g500)] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-base text-slate-900">
                          {p.title}
                        </h4>
                        <p
                          className="text-xs font-semibold"
                          style={{ color: "var(--g600)" }}
                        >
                          {p.meta}
                        </p>
                      </div>
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: "rgba(62, 145, 84, 0.1)",
                          color: "var(--g600)",
                        }}
                      >
                        New
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">{p.desc}</p>
                    <Link
                      href="#"
                      className="text-xs font-semibold"
                      style={{ color: "var(--g600)" }}
                    >
                      Learn More →
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-white rounded-xl border-2 border-dashed border-slate-300">
                <p className="text-xs text-slate-700 mb-3">
                  Don't see the right position? We're always looking for great
                  people!
                </p>
                <Link href="#" className="btn text-sm">
                  Send General Application
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
