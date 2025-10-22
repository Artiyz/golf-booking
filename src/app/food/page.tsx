import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";
import FAQFood from "@/components/layout/FAQFood";

const cardBase = "rounded-3xl shadow-xl ring-1 ring-black/5 overflow-hidden";

export default function FoodPage() {
  return (
    <main className="-mt-25 min-h-screen text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-0">
        <section className="full-bleed">
          <div className="relative min-h-[60vh]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('/golf/images/food-hero.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-black/35" />

            <div className="relative z-10 mx-auto max-w-7xl flex items-center justify-center lg:justify-start min-h-[60vh] px-3 lg:pl-8">
              <div className="rounded-3xl ring-1 ring-black/5 overflow-hidden bg-white/90 p-4 sm:p-6 md:p-8 w-full max-w-md sm:max-w-xl lg:max-w-2xl mx-auto lg:mx-0 text-sm lg:text-base shadow-2xl lg:shadow-xl">
                <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--g600)]/90">
                  Food &amp; Drink Services
                </span>
                <h1 className="mt-2 mb-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[color:var(--g600)]">
                  It&apos;s Golf, But Not Just Golf
                </h1>
                <p className="mt-2 mb-4 text-[14px] lg:text-[15.5px] leading-6 lg:leading-7 text-slate-700">
                  At Celtic Virtual Golf, great play deserves great dining.
                  Whether you’re enjoying a round with friends or planning ahead
                  for a full day, our food and drink options make every visit
                  easier and tastier.
                </p>
                <p className="mt-2 mb-4 text-[14px] lg:text-[15.5px] leading-6 lg:leading-7 text-slate-700">
                  You can dine in at our lounge, enjoy bay-side service, or
                  pre-order for delivery in advance to any preferred address
                  before your visit.
                </p>
                <div className="mt-6">
                  <Link href="#" className="btn">
                    Pre-Order Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-center mb-4">
          <div className="heading-wrap">
            <div className="heading-bar" />
            <h2 className="heading-text">How it works</h2>
          </div>
        </div>
        <section className="mx-auto max-w-7xl px-4 py-3 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rttu-card p-8 flex flex-col h-full">
            <a href="/food/menu" className="rttu-card-img">
              <span className="rttu-card-img-inner">
                <img
                  src="/golf/images/Food/How it works(food and drinks)/Browse-Menu-Options.jpg"
                  alt="Browse Menu Options"
                />
              </span>
            </a>
            <h4 className="rttu-card-title mt-4">1 - Browse Menu Options</h4>
            <p className="rttu-card-text mt-8">
              Explore our partner restaurants and curated food selections by
              category.
            </p>
          </div>

          <div className="rttu-card p-8 flex flex-col h-full">
            <a className="rttu-card-img">
              <span className="rttu-card-img-inner">
                <img
                  src="/golf/images/Food/How it works(food and drinks)/Delivery-Option.jpg"
                  alt="Choose Delivery Option"
                />
              </span>
            </a>
            <h4 className="rttu-card-title mt-4">
              2 - Choose Your Delivery Option
            </h4>
            <p className="rttu-card-text mt-8">
              Select “Serve in Bay” or “Deliver in Advance” and provide your
              delivery details.
            </p>
          </div>

          <div className="rttu-card p-8 flex flex-col h-full">
            <a href="#" className="rttu-card-img">
              <span className="rttu-card-img-inner">
                <img
                  src="/golf/images/Food/How it works(food and drinks)/Relax-and-Enjoy.jpg"
                  alt="Relax and Enjoy"
                />
              </span>
            </a>
            <h4 className="rttu-card-title mt-4">3 - Relax and Enjoy</h4>
            <p className="rttu-card-text mt-8">
              We’ll handle the rest while you focus on your game.
            </p>
          </div>
        </section>
        <div className="flex justify-center my-6">
          <Link href="#" className="btn">
            Pre-Order Now
          </Link>
        </div>

        <div className="flex justify-center my-6">
          <div className="heading-wrap">
            <div className="heading-bar" />
            <h2 className="heading-text">Explore Some of our Best Food</h2>
          </div>
        </div>

        <section className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "Maple Bacon Burger",
                desc: "Smoked cheddar, maple-bacon jam, hand-cut fries.",
                img: "/golf/images/Food/Maple-Bacon-Burger-with-Smoked-Cheddar.jpg",
              },
              {
                title: "Herb-Roasted Chicken",
                desc: "Free-range supreme, herb jus, creamy mash.",
                img: "/golf/images/Food/Herb-Roasted-Chicken.jpg",
              },
              {
                title: "Wild Mushroom Bowl (V)",
                desc: "Roasted mushrooms, quinoa, seasonal greens.",
                img: "/golf/images/Food/Wild-Mushroom-&-Quinoa-Veggie-Bowl.jpg",
              },
              {
                title: "Signature Cocktail Flight",
                desc: "Seasonal twists, fresh garnishes, bright profiles.",
                img: "/golf/images/Food/Signature-Craft-Cocktail-Selection.jpg",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-3xl ring-1 ring-black/5 shadow-xl bg-white"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white">
                    <h3 className="text-xl font-semibold drop-shadow">
                      {item.title}
                    </h3>
                    <p className="text-sm opacity-90 mt-1">{item.desc}</p>
                  </div>
                </div>
                <div className="p-4 sm:p-5 flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Chef’s pick • Fresh daily
                  </span>
                  <Link href="#" className="btn btn-ghost">
                    Add to Pre-Order
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-15">
            <Link href="/food/menu" className="btn">
              View Full Menu
            </Link>
          </div>
        </section>

        <div className="flex justify-center my-4">
          <div className="heading-wrap">
            <div className="heading-bar" />
            <h2 className="heading-text">Our partners &amp; selections</h2>
          </div>
        </div>
        <section className="mx-auto max-w-7xl px-4 py-3">
          <div
            className={`${cardBase} p-6 md:p-8 bg-[linear-gradient(180deg,#f9fefb_0%,#eefcf5_100%)]`}
          >
            <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              {[
                {
                  name: "Fairway Kitchen",
                  tag: "Daily specials & family promotions",
                  desc: "Classic comfort dishes and casual dining favourites.",
                },
                {
                  name: "Greenhouse Bites",
                  tag: "Grab & Go — Ready in 10 mins",
                  desc: "Fresh salads, wraps, and healthy options.",
                },
                {
                  name: "Slice & Swing Pizza Co.",
                  tag: "Stone-oven pizza specials & combos",
                  desc: "Artisan pizzas made fresh to order.",
                },
                {
                  name: "The Celtic Grill",
                  tag: "Chef’s signature burgers & promos",
                  desc: "Premium burgers, fries, and shareable plates.",
                },
                {
                  name: "Birdie Bar Co.",
                  tag: "Happy Hour 4–9pm",
                  desc: "Handcrafted cocktails and mocktails.",
                },
                {
                  name: "Cool 9 Beverages",
                  tag: "Seasonal cold drinks & promotions",
                  desc: "Juices, smoothies, and soft drinks.",
                },
                {
                  name: "The Brew Loft",
                  tag: "On Tap & Craft Flights",
                  desc: "Local craft beer and premium coffee selections.",
                },
                {
                  name: "9th Hole Café",
                  tag: "Breakfast & Brunch 8–11am",
                  desc: "Breakfast classics, pastries and specialty coffee.",
                },
              ].map((p) => (
                <div
                  key={p.name}
                  className="rttu-card p-4 flex flex-col items-center h-full"
                >
                  <div className="w-[120px] h-[120px] overflow-hidden rounded-full bg-slate-300">
                    <img
                      src={`https://placehold.co/300x300/cccccc/ffffff?text=${encodeURIComponent(
                        p.name
                      )}`}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <div className="font-medium text-slate-900">{p.name}</div>
                    <div className="text-xs text-emerald-700 mt-1">{p.tag}</div>
                    <div className="text-sm text-slate-700 mt-2">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex justify-center my-12 mt-16">
          <div className="heading-wrap">
            <div className="heading-bar" />
            <h2 className="heading-text">Kids Menu</h2>
          </div>
        </div>
        <section className="mx-auto max-w-7xl px-4 py-6">
          <div
            className={`${cardBase} overflow-hidden bg-[linear-gradient(180deg,#f9fefb_0%,#eefcf5_100%)]`}
          >
            <div className="grid md:grid-cols-[3fr_3fr] gap-0">
              <div className="relative h-64 md:h-auto">
                <img
                  src="/golf/images/Kids-Having-Fun.jpg"
                  alt="Kids Menu"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider"
                    style={{ background: "var(--g600)" }}
                  >
                    Family Friendly
                  </span>
                </div>
                <h3
                  className="text-3xl md:text-4xl font-extrabold mb-4"
                  style={{ color: "var(--g600)" }}
                >
                  Kids Are Welcome!
                </h3>
                <p className="text-lg text-slate-700 mb-4 leading-relaxed">
                  Bringing the family? No problem! We offer a special kids menu
                  designed for young golfers aged 12 and under, featuring
                  favorites like mini burgers, chicken tenders, creamy mac &
                  cheese, and personal pizzas.
                </p>
                <p className="text-base text-slate-700 mb-6">
                  All kids meals include a soft drink or juice box, plus a
                  surprise treat. Our simulators are safe and fun for all ages,
                  with junior clubs available!
                </p>

                <div className="bg-white rounded-2xl p-5 mb-6 border-2 border-emerald-200 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-slate-50 to-emerald-50 rounded-xl flex items-center justify-center p-2">
                      <img
                        src="/golf/merch/keychainwithlogo.svg"
                        alt="Free Keychain"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                          Limited Time
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-emerald-700 mb-1">
                        Free Celtic Keychain Gift!
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Order any kids meal and receive a complimentary Celtic
                        Golf metal keychain — a special keepsake for our young
                        golfers!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href="#" className="btn">
                    View Kids Menu
                  </Link>
                  <Link href="#" className="btn-secondary">
                    Book Family Bay
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FAQFood />

        <div className="flex justify-center my-4">
          <div className="heading-wrap">
            <div className="heading-bar" />
            <h2 className="heading-text">Join &amp; Save</h2>
          </div>
        </div>
        <section className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="rttu-card p-8 flex flex-col h-full items-center text-center">
            <h4 className="rttu-card-title mt-4">First time with us?</h4>
            <p className="rttu-card-text mt-4 px-8">
              Sign up now to become a Celtic Virual Golf member to receive
              exclusive perks, early access to new menu items, and members-only
              offers on food and drinks.
            </p>
            <div className="mt-6">
              <Link href="/signup" className="btn">
                Sign Up Now
              </Link>
            </div>
          </div>

          <div className="rttu-card p-8 flex flex-col h-full items-center text-center">
            <h4 className="rttu-card-title mt-4">Hungry already?</h4>
            <p className="rttu-card-text mt-4 px-8">
              Plan ahead and pre-order your favourites for on-site dining or
              advance delivery to your preferred location, and we’ll have
              everything ready when you arrive.
            </p>
            <div className="mt-6">
              <Link href="#" className="btn">
                Pre-Order Now
              </Link>
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
