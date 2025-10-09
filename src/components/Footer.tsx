import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="rounded-3xl p-6 md:p-8 shadow-2xl ring-1 ring-black/5 bg-[linear-gradient(135deg,#ecfdf5_0%,#eef2ff_100%)]">
          <div className="grid md:grid-cols-3 gap-8">
            <nav className="space-y-3">
              <ul className="space-y-2">
                <li><Link href="/" className="hover:underline">Home</Link></li>
                <li><Link href="/about" className="hover:underline">About Us</Link></li>
                <li><Link href="/golf-bays" className="hover:underline">Golf Bays</Link></li>
                <li><Link href="/booking" className="hover:underline">Booking</Link></li>
                <li><Link href="/food-drink" className="hover:underline">Food &amp; Drink</Link></li>
              </ul>
            </nav>

            <div className="space-y-2 text-sm">
              <div className="font-medium">Contact Us</div>
              <div>Address: 1385 Woodroffe Ave,<br/>Ottawa, ON K2G 1V8</div>
              <div>Phone: (613) 727-4723</div>
              <div>Email: <a href="mailto:info@celticvirtualgolf.ca" className="underline">info@celticvirtualgolf.ca</a></div>
            </div>

            <div className="space-y-3">
              <div className="font-medium">Sign Up For Offers + Updates</div>
              <p className="text-sm opacity-80">
                Become a member for bay offers, food &amp; drink savings, and news.
              </p>
              <Link href="/join" className="btn">Join Us Now →</Link>
            </div>
          </div>

          <hr className="my-6 border-black/10" />

          <div className="flex items-center justify-between text-sm opacity-80">
            <div>© 2025 Celtic Virtual Golf. All Rights Reserved</div>
            <div className="flex items-center gap-3">
              <a aria-label="Facebook" href="#" className="h-8 w-8 grid place-items-center rounded-full ring-1 ring-black/10 hover:ring-black/20">f</a>
              <a aria-label="Instagram" href="#" className="h-8 w-8 grid place-items-center rounded-full ring-1 ring-black/10 hover:ring-black/20">◎</a>
              <a aria-label="YouTube" href="#" className="h-8 w-8 grid place-items-center rounded-full ring-1 ring-black/10 hover:ring-black/20">▶</a>
              <a aria-label="LinkedIn" href="#" className="h-8 w-8 grid place-items-center rounded-full ring-1 ring-black/10 hover:ring-black/20">in</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}