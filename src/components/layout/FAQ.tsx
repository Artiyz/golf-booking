"use client"
import React, { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "Do you take reservations?",
    a: `For those who like to plan ahead — we’ve got you covered! At Celtic Virtual Golf, you can reserve one bay for 1–6 people or two bays for 7–12 people, up to 14 days in advance. You can also pre-order food and beverages for on-site dining or advance delivery. Click below to start planning, check availability, and view pricing.`,
  },
  {
    q: "What are your opening hours?",
    a: `We’re open seven days a week. Hours vary by day and season — check the booking page for the most up-to-date schedule and available time slots.`,
  },
  {
    q: "Can I order food and drinks when I book a bay?",
    a: `Absolutely — you can pre-order food and drinks when reserving your bay, or order on arrival for on-site service. We support both pickup and table service options.`,
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  return (
    <section className="mx-auto max-w-7xl px-4 px-4 pb-12">
      <div className="mx-auto w-full max-w-6xl bg-white rounded-3xl shadow-xl ring-1 ring-black/5 px-12 py-12 overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div className="w-full lg:w-96 flex flex-col gap-6">
            <h3 className="heading-text">Frequently Asked Questions</h3>
            <p className="text-sm leading-relaxed text-slate-700">Need some help with your Celtic Virtual Golf experience or have questions? Click a question to reveal the answer, or send us a message and we’ll get back to you.</p>

            <div>
              <a href="#" className="btn">Send Us Message</a>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col gap-8">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="border-b border-slate-200">
                  <button
                    type="button"
                    aria-expanded={openIndex === i}
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between py-4 text-left text-emerald-900 font-medium"
                  >
                    <span className="flex-1 text-sm leading-relaxed font-normal text-emerald-900">{item.q}</span>
                    <span className={`ml-4 transform transition-transform duration-200 ${openIndex === i ? "rotate-180" : "rotate-0"}`}>
                      <svg className="w-4 h-4 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>

                  <div className={`${openIndex === i ? "block" : "hidden"} py-3`}>
                    <p className="text-sm leading-relaxed text-slate-700 font-normal">{item.a}</p>
                    {i === 0 && openIndex === 0 && (
                        <div className="my-4">
                        <a href="/booking" className="btn">Book Now</a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
