import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";

const imgs = {
  hero: "/golf/images/about-hero.jpg",
  story: "/golf/images/bay-1.jpg",
  // use real files from /public/golf/images
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
  "rounded-xl px-4 py-3 shadow-sm ring-1 ring-emerald-900/10 bg-[linear-gradient(180deg,#fcfffd_0%,#f3fdf7_100%)] text-slate-800 flex flex-col gap-0.5";

function IconBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3l3.2 6.5 7.2 1-5.2 5.1 1.3 7.1L12 19l-6.5 3.7 1.3-7.1L1.6 10.5l7.2-1L12 3z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen text-slate-900">
  <section className="full-bleed -mt-12">
        <div className="relative min-h-[calc(100vh-4rem)]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${imgs.hero})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-black/35" />

          <div className="relative z-10 mx-auto max-w-7xl flex items-center min-h-[calc(100vh-4rem)] mb-24 px-3 justify-center lg:justify-start lg:pl-8">
            <div className={`${cardBase} bg-white/90 p-4 sm:p-6 md:p-8 w-full max-w-md sm:max-w-xl lg:max-w-2xl mx-auto lg:mx-0 text-sm lg:text-base shadow-2xl lg:shadow-xl` }>
              <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--g600)]/90">About Us</span>
              <h1 className="mt-2 mb-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[color:var(--g600)]">Practice meets play</h1>
              <p className="mt-2 mb-4 text-[15.5px] leading-7 text-slate-700">
                A modern simulator studio for grooving your swing, playing world-class
                courses, or hanging with friends—any time, any weather. We’re open
                year-round with bright, comfortable bays and friendly staff so you can
                settle in and have fun right away.
              </p>
              <div className="mt-4 mb-3 flex flex-wrap gap-3">
                <Link href="/dashboard" className="btn">Book a bay</Link>
                <Link href="/signup" className="btn-secondary">Become A Member</Link>
              </div>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={chip}><div className="text-lg font-semibold">5+</div><div className="opacity-70">Years open</div></div>
                <div className={chip}><div className="text-lg font-semibold">4</div><div className="opacity-70">Simulator bays</div></div>
                <div className={chip}><div className="text-lg font-semibold">10k+</div><div className="opacity-70">Happy customers</div></div>
                <div className={chip}><div className="text-lg font-semibold">4.9</div><div className="opacity-70">Avg. rating</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

  <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className={`${cardBase} bg-[linear-gradient(180deg,#f9fefb_0%,#eefcf5_100%)]`}>
            <div className="relative aspect-[16/10] w-full"><Image src={imgs.story} alt="Studio ambiance" fill className="object-cover" /></div>
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-semibold">Our story</h2>
              <div className="mt-3 space-y-3 text-[15.5px] leading-7 text-slate-800">
                <p>We built a space that feels premium yet friendly—where great shots and great company come easy.</p>
                <p>From easy booking to comfy seating and reliable tech, every detail is tuned for flow and fun.</p>
                <p>Whether it’s practice, a lesson, or a night out, you’ll find welcoming vibes and room to play.</p>
              </div>
            </div>
          </div>

          <div className={`${cardBase} p-6 md:p-8 bg-[linear-gradient(180deg,#f7fefb_0%,#eefcf5_100%)]`}>
            <h2 className="text-xl font-semibold">A look inside</h2>
            <p className="mt-3 text-[15.5px] leading-7 text-slate-800">
              Tour-level launch data, comfy seating, and a curated playlist. Bring your clubs or rent from us.
              Bright projectors, accurate tracking, and plenty of space—perfect for practice or a relaxed night out.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl ring-1 ring-black/5 shadow"><Image src={imgs.lookA} alt="Bay view 1" fill className="object-cover" /></div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl ring-1 ring-black/5 shadow"><Image src={imgs.lookB} alt="Bay view 2" fill className="object-cover" /></div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl ring-1 ring-black/5 shadow"><Image src={imgs.lookC} alt="Bay view 3" fill className="object-cover" /></div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl ring-1 ring-black/5 shadow"><Image src={imgs.lookD} alt="Bay view 4" fill className="object-cover" /></div>
            </div>
            <div className="mt-6 flex justify-center">
              <Link href="/golf-bays" className="btn">
                View Bays
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className={`${cardBase} p-6 md:p-8 bg-[linear-gradient(180deg,#f7fff9_0%,#eefcf5_100%)]`}>
          <div className="flex items-center gap-2">
            <IconBadge className="h-5 w-5 text-emerald-700" />
            <h2 className="text-xl font-semibold">Meet the team</h2>
          </div>

          <p className="mt-3 text-sm text-slate-700">Explore our talented team who keep Celtic Virtual Golf running smoothly — from coaching to guest experience and operations.</p>

          <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[
              { name: 'Ava', role: 'Studio Manager' },
              { name: 'Noah', role: 'PGA Coach' },
              { name: 'Mia', role: 'Guest Experience' },
              { name: 'Liam', role: 'Operations' },
              { name: 'Olivia', role: 'Events' },
              { name: 'Lucas', role: 'Technical Lead' },
              { name: 'Zoe', role: 'Hospitality' },
              { name: 'Ethan', role: 'Front of House' },
            ].map((p) => (
              <div key={p.name} className="rttu-card p-4 flex flex-col items-center h-full">
                <div className="w-full max-w-[160px] h-[240px] overflow-hidden rounded-2xl bg-slate-300">
                  <img src={`https://placehold.co/300x450/cccccc/ffffff?text=${encodeURIComponent(p.name)}`} alt={p.name} className="w-full h-full object-cover" />
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

      <SiteFooter />
    </main>
  );
}
