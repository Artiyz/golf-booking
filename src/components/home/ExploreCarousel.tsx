'use client'
import React, { useState } from 'react'
import Image from 'next/image'

type Slide = { src: string; alt: string }

export default function ExploreCarousel({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0)
  const prev = () => setI((i - 1 + slides.length) % slides.length)
  const next = () => setI((i + 1) % slides.length)

  return (
    <div className="w-full">
      <div className="relative mx-auto max-w-3xl">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow">
          <Image src={slides[i].src} alt={slides[i].alt} fill sizes="(max-width:768px) 100vw, 800px" className="object-cover" priority />
        </div>
        <button onClick={prev} aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-lg leading-none shadow hover:bg-white">‹</button>
        <button onClick={next} aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-lg leading-none shadow hover:bg-white">›</button>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} aria-label={`Go to slide ${idx + 1}`} className={`h-2 w-2 rounded-full ${i === idx ? 'bg-emerald-700' : 'bg-emerald-200'}`}></button>
        ))}
      </div>
    </div>
  )
}
