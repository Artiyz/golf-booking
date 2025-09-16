"use client";
import { useState } from "react";

export default function Booking() {
  const [step,setStep]=useState(1);
  const labels=["Contact","Service & Bay","Availability","Confirmation"];
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {labels.map((label,i)=>{
          const n=i+1;
          const active=n===step, done=n<step;
          return (
            <div key={label}
              className={`px-3 py-2 rounded-full text-sm ${active ? "bg-blue-600 text-white" : done ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
              <span>{n}.</span><span className="hidden sm:inline ml-1">{label}</span>
            </div>
          );
        })}
      </div>

      <section className="bg-white p-6 rounded-2xl shadow space-y-3">
        <h2 className="text-lg font-semibold">Booking Wizard Placeholder</h2>
        <p>If you see rounded corners and blue buttons, Tailwind is working.</p>
        <button className="btn" onClick={()=>setStep(step===4?1:step+1)}>Next step</button>
      </section>
    </div>
  );
}
