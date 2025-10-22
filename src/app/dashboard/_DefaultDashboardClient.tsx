"use client";

import Image from "next/image";
import Link from "next/link";

export default function DefaultDashboardClient() {
  return (
    <main className="min-h-[calc(100vh-7rem)] flex items-start justify-center pt-10 sm:pt-22">
      <div className="w-full max-w-5xl bg-section-a section-card brightness-105 rounded-3xl shadow-xl ring-1 ring-black/5 overflow-hidden py-26 px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-semibold text-[color:var(--g600)]">
            Select Your Booking Dashboard
          </h1>
          <p className="mt-2 text-[15.5px] leading-8 text-slate-700">
            Select the dashboard you would like to explore.
          </p>

          <div className="mt-19 grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
            {/* GUEST → jump into booking step 2 */}
            <Link
              href="/booking?guest=1"
              className="rttu-card p-6 flex flex-col items-center h-full text-center"
            >
              <div className="w-16 h-16 relative">
                <Image
                  src="/golf/icons/Property 1=add-user.svg"
                  alt="Guest"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="rttu-card-title mt-4">GUEST</div>
            </Link>

            <Link
              href="/dashboard/member"
              className="rttu-card p-6 flex flex-col items-center h-full text-center"
            >
              <div className="w-16 h-16 relative">
                <Image
                  src="/golf/icons/Property 1=add-user.svg"
                  alt="Member"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="rttu-card-title mt-4">MEMBER</div>
            </Link>

            <Link
              href="/admin"
              className="rttu-card p-6 flex flex-col items-center h-full text-center"
            >
              <div className="w-16 h-16 relative">
                <Image
                  src="/golf/icons/Property 1=add-user.svg"
                  alt="Admin"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="rttu-card-title mt-4">ADMIN</div>
            </Link>
          </div>

          <div className="mt-24 text-center text-xs text-zinc-500">
            © {new Date().getFullYear()} Celtic Virtual Golf. All Rights
            Reserved.
          </div>
        </div>
      </div>
    </main>
  );
}
