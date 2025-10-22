import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";

const cardBase = "rounded-3xl shadow-xl ring-1 ring-black/5 overflow-hidden";

export default function GolfBaysPage() {
  return (
    <main className="-mt-16 min-h-screen text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-0">
        <section className="full-bleed">
          <div className="hero relative">
            {/* background image */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('/golf/images/Friends-Competing.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <div className="absolute inset-0 bg-black/35" />

            <div className="relative min-h-[62vh] sm:min-h-[66vh] lg:min-h-[70vh]">
              <div className="mx-auto max-w-6xl lg:max-w-7xl px-4 sm:px-6 h-full">
                <div className="h-full flex items-center sm:items-start">
                  <div
                    className="
                                w-full sm:w-auto
                                sm:mt-[14vh] lg:mt-[22vh]
                                sm:ml-auto
                                max-w-md sm:max-w-xl lg:max-w-2xl
                              "
                  >
                    <div
                      className={`${cardBase} bg-white/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 text-sm lg:text-base shadow-2xl lg:shadow-xl`}
                    >
                      <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--g600)]/90">
                        Golf Bays
                      </span>
                      <h1 className="mt-2 mb-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[color:var(--g600)]">
                        Explore Our Bays
                      </h1>
                      <p className="mt-2 mb-4 text-[14px] lg:text-[15.5px] leading-6 lg:leading-7 text-slate-700">
                        Celtic Virtual Golf features 6 well-designed golf bays —
                        2 premium bays for larger groups and 4 standard bays for
                        everyday play — offered at fair and affordable rates.
                        Each bay provides ample space, comfortable seating, and
                        a clear view.
                      </p>
                      <p className="mt-2 mb-4 text-[13px] text-slate-600">
                        Premium bays: up to 10 guests. Standard bays: up to 4
                        guests.
                      </p>

                      <div className="mt-6 flex gap-3">
                        <Link href="/dashboard" className="btn">
                          Book Now
                        </Link>
                        <Link href="/signup" className="btn-secondary">
                          Become a Member
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bays list */}
        <div className="flex justify-center my-8">
          <div className="heading-wrap">
            <div className="heading-bar" />
            <h2 className="heading-text">Our Bays</h2>
          </div>
        </div>

        <section className="mx-auto max-w-7xl px-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Premium 1 */}
            <div className="rttu-card p-6 flex flex-col h-[420px]">
              <a href="#" className="rttu-card-img">
                <span className="rttu-card-img-inner">
                  <img
                    src="/golf/images/Corporate-Team-Building-Event.jpg"
                    alt="Premium Bay 1"
                  />
                </span>
              </a>
              <h4 className="rttu-card-title mt-4">
                Premium Bay — The Fairway Suite
              </h4>
              <p className="rttu-card-text mt-2">
                Spacious bay for up to 10 guests, premium simulator, lounge
                seating and widescreen projection. Price from $120/hr.
              </p>
              <ul className="mt-3 text-sm text-slate-600 list-disc list-inside">
                <li>Capacity: up to 10</li>
                <li>Ideal for parties and corporate events</li>
              </ul>
            </div>

            {/* Premium 2 */}
            <div className="rttu-card p-6 flex flex-col h-[420px]">
              <a href="#" className="rttu-card-img">
                <span className="rttu-card-img-inner">
                  <img src="/golf/images/bay-3.jpg" alt="Premium Bay 2" />
                </span>
              </a>
              <h4 className="rttu-card-title mt-4">
                Premium Bay — Championship Loft
              </h4>
              <p className="rttu-card-text mt-2">
                High-capacity bay with extra space, premium audio and dedicated
                service options. Price from $130/hr.
              </p>
              <ul className="mt-3 text-sm text-slate-600 list-disc list-inside">
                <li>Capacity: up to 10</li>
                <li>Perfect for group lessons and events</li>
              </ul>
            </div>

            {/* Standard 1 */}
            <div className="rttu-card p-6 flex flex-col h-[420px]">
              <a href="#" className="rttu-card-img">
                <span className="rttu-card-img-inner">
                  <img
                    src="/golf/images/State-of-the-Art-Sensor-Close-Up.jpg"
                    alt="Standard Bay"
                  />
                </span>
              </a>
              <h4 className="rttu-card-title mt-4">
                Standard Bay — The Practice Bay A
              </h4>
              <p className="rttu-card-text mt-2">
                Comfortable bay for regular play and practice with full
                simulator controls. Price from $60/hr.
              </p>
              <ul className="mt-3 text-sm text-slate-600 list-disc list-inside">
                <li>Capacity: up to 4</li>
                <li>Great for casual rounds and coaching</li>
              </ul>
            </div>

            {/* Standard 2 */}
            <div className="rttu-card p-6 flex flex-col h-[420px]">
              <a href="#" className="rttu-card-img">
                <span className="rttu-card-img-inner">
                  <img src="/golf/images/bay-5.jpg" alt="Standard Bay" />
                </span>
              </a>
              <h4 className="rttu-card-title mt-4">
                Standard Bay — The Practice Bay B
              </h4>
              <p className="rttu-card-text mt-2">
                Reliable simulator bay for practice and quick play. Price from
                $60/hr.
              </p>
              <ul className="mt-3 text-sm text-slate-600 list-disc list-inside">
                <li>Capacity: up to 4</li>
                <li>Casual play and skills practice</li>
              </ul>
            </div>

            {/* Standard 3 */}
            <div className="rttu-card p-6 flex flex-col h-[420px]">
              <a href="#" className="rttu-card-img">
                <span className="rttu-card-img-inner">
                  <img src="/golf/images/bay-6.jpg" alt="Standard Bay" />
                </span>
              </a>
              <h4 className="rttu-card-title mt-4">
                Standard Bay — The Practice Bay C
              </h4>
              <p className="rttu-card-text mt-2">
                Cozy bay with adjustable settings and club tracking. Price from
                $60/hr.
              </p>
              <ul className="mt-3 text-sm text-slate-600 list-disc list-inside">
                <li>Capacity: up to 4</li>
                <li>Club tracking and progress metrics</li>
              </ul>
            </div>

            {/* Standard 4 */}
            <div className="rttu-card p-6 flex flex-col h-[420px]">
              <a href="#" className="rttu-card-img">
                <span className="rttu-card-img-inner">
                  <img src="/golf/images/bay-1.jpg" alt="Standard Bay" />
                </span>
              </a>
              <h4 className="rttu-card-title mt-4">
                Standard Bay — The Practice Bay D
              </h4>
              <p className="rttu-card-text mt-2">
                Versatile bay suited for short games, putting practice and
                casual play. Price from $60/hr.
              </p>
              <ul className="mt-3 text-sm text-slate-600 list-disc list-inside">
                <li>Capacity: up to 4</li>
                <li>Perfect for lessons and quick sessions</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="flex justify-center my-4">
          <div className="heading-wrap">
            <div className="heading-bar" />
            <h2 className="heading-text">Reserve &amp; Pricing</h2>
          </div>
        </div>

        <section className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="rttu-card p-8 flex flex-col h-full items-center text-center">
            <h4 className="rttu-card-title mt-4">Reserve a Bay</h4>
            <p className="rttu-card-text mt-4 px-8">
              Book your bay online and enjoy flexible hourly rates and group
              packages. Premium bays include extra capacity and added amenities
              for a more comfortable experience.
            </p>
            <div className="mt-6">
              <Link href="/dashboard" className="btn">
                Reserve Bay
              </Link>
            </div>
          </div>

          <div className="rttu-card p-8 flex flex-col h-full items-center text-center">
            <h4 className="rttu-card-title mt-4">New Member Perks</h4>
            <p className="rttu-card-text mt-4 px-8">
              Sign up as a new member to unlock exclusive benefits: discounted
              rates, early access to promotions, and priority booking. Make
              every visit more rewarding.
            </p>
            <div className="mt-6">
              <Link href="/signup" className="btn">
                Become Member
              </Link>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
