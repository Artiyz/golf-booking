'use client'
import Image from 'next/image'
import { useState, useMemo } from 'react'

type Slide = {
  title: string
  text: string
  img: string
  cta: { label: string; href: string }
}
export default function ReadyCarousel({ slides }: { slides: Slide[] }) {
  const [i,setI]=useState(0)
  const count = slides.length
  const go = (n:number)=>setI((i+n+count)%count)
  const offset = useMemo(()=>`translateX(-${i*100}%)`,[i])

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <button aria-label="Previous" onClick={()=>go(-1)} className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-lg shadow hover:bg-white">‹</button>
      <button aria-label="Next" onClick={()=>go(1)} className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-lg shadow hover:bg-white">›</button>

      <div className="overflow-hidden rounded-2xl">
        <div className="flex transition-transform duration-500" style={{transform:offset}}>
          {slides.map((s,idx)=>(
            <div key={idx} className="w-full shrink-0 px-4">
              <div className="grid gap-6 rounded-2xl border border-emerald-900/5 bg-white p-4 shadow-md md:grid-cols-2 md:p-6">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                  <Image src={s.img} alt={s.title} fill sizes="(max-width:768px) 100vw, 600px" className="object-cover"/>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-xl font-extrabold text-slate-900">{s.title}</h4>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-700">{s.text}</p>
                  <div className="mt-4">
                    <a href={s.cta.href} className="inline-block rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow transition-all duration-200 hover:translate-y-[-1px] hover:bg-emerald-600 hover:shadow-lg">{s.cta.label}</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {slides.map((_,idx)=>(
          <button key={idx} onClick={()=>setI(idx)} aria-label={`Go to slide ${idx+1}`} className={`h-2 w-2 rounded-full ${i===idx?'bg-emerald-700':'bg-emerald-200'}`}></button>
        ))}
      </div>
    </div>
  )
}
