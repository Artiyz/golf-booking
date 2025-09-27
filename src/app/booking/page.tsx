"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

// Map a service to an image filename (fallback to slugified name)
const svcSlug = (x: { name: string; slug?: string }) => (x.slug ?? x.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""));


const contactSchema = z.object({
  fullName: z.string().min(1, "Please enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone"),
});
type ContactData = z.infer<typeof contactSchema>;

type Service = { id: string; name: string; durationMinutes: number; priceCents: number };
type Bay = { id: string; name: string; type: "PRIME" | "STANDARD"; capacity: number };
type Slot = { iso: string; label: string; available: boolean };

export default function Booking() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const contactResolver = zodResolver(contactSchema) as unknown as Resolver<ContactData>;
  const form = useForm<ContactData>({
    resolver: contactResolver,
    defaultValues: { fullName: "", email: "", phone: "" },
    mode: "onBlur",
  });

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () => (await fetch("/api/services").then(r=>r.json())) as Service[],
  });

  const { data: bays = [] } = useQuery({
    queryKey: ["bays"],
    queryFn: async () => (await fetch("/api/bays").then(r=>r.json())) as Bay[],
  });

  const [service, setService] = useState<Service | null>(null);
  const [bay, setBay] = useState<Bay | null>(null);

  const [date, setDate] = useState<Date>(new Date());
  const dateStr = useMemo(() => format(date, "yyyy-MM-dd"), [date]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotISO, setSlotISO] = useState<string | null>(null);

  useEffect(() => {
    if (!service || !bay || !dateStr) return;
    fetch(`/api/availability?serviceId=${service.id}&bayId=${bay.id}&date=${dateStr}`)
      .then(r=>r.json())
      .then(j=> setSlots(Array.isArray(j.slots) ? j.slots as Slot[] : []));
  }, [service, bay, dateStr]);

  function nextFromContact() {
    if (form.getValues().fullName && form.getValues().email && form.getValues().phone) setStep(2);
  }

  async function confirm() {
    if (!service || !bay || !slotISO) return;
    const { fullName, email, phone } = form.getValues();
    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ fullName, email, phone, serviceId: service.id, bayId: bay.id, startISO: slotISO }),
    });
    if (res.ok) {
      alert("Booked! A confirmation email was sent.");
      setStep(1);
      form.reset();
      setService(null);
      setBay(null);
      setSlots([]);
      setSlotISO(null);
      setDate(new Date());
    } else {
      const j = await res.json().catch(()=>({error:""}));
      alert(j.error || "Could not book. Try another time.");
    }
  }

  const err = form.formState.errors;

  const pickRef = useRef<HTMLDivElement>(null); const selRef = useRef<HTMLDivElement>(null); const [capH,setCapH]=useState<number|null>(null); useEffect(()=>{ if(pickRef.current){ setCapH(pickRef.current.offsetHeight); } }, [date, service, bay, slots.length]); return (
    <div className="mx-auto max-w-3xl">
      <div className="steps-shell">
        <div className="steps-grid">
          {["Contact","Service & Bay","Availability","Confirmation"].map((label, i) => {
            const n = (i+1) as 1|2|3|4;
            const cls = n===step ? "step step-active" : n<step ? "step step-done" : "step step-idle";
            const clickable = n < step;
            return (
              <div key={label} className={cls} onClick={()=> clickable && setStep(n)}>
                <span>{n}.</span><span className="hidden sm:inline">{label}</span>
              </div>
            );
          })}
        </div>

        <div className="form-body">
          {step === 1 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-[color:var(--g600)]">Your details</h2>
              <form className="space-y-4" onSubmit={form.handleSubmit(nextFromContact)} noValidate>
                <div>
                  <label className="block text-sm mb-1">Full name</label>
                  <input
                    placeholder="Jane Doe"
                    aria-invalid={!!err.fullName}
                    className={`input ${err.fullName ? "ring-2 ring-red-500" : ""}`}
                    {...form.register("fullName")}
                  />
                  {err.fullName && <p className="mt-1 text-sm text-red-600">{err.fullName.message as string}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    aria-invalid={!!err.email}
                    className={`input ${err.email ? "ring-2 ring-red-500" : ""}`}
                    {...form.register("email")}
                  />
                  {err.email && <p className="mt-1 text-sm text-red-600">{err.email.message as string}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="555-123-4567"
                    aria-invalid={!!err.phone}
                    className={`input ${err.phone ? "ring-2 ring-red-500" : ""}`}
                    {...form.register("phone")}
                  />
                  {err.phone && <p className="mt-1 text-sm text-red-600">{err.phone.message as string}</p>}
                </div>
                <div className="pt-1">
                  <button className="btn">Continue</button>
                </div>
              </form>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-medium text-[color:var(--g600)]">Select a service</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start items-start items-start">
                  {services.map(s => (
                    <button key={s.id}
                      onClick={() => { setService(s); setBay(null); setSlotISO(null); }}
                      className={`card selectable ${service?.id === s.id ? "is-selected" : ""}`}>
                      <img src={`/services/${svcSlug(s)}.jpg`} onError={(e)=>{e.currentTarget.src="/services/default.jpg"}} alt={s.name} className="h-36 w-full object-cover rounded-xl mb-3" /><div className="font-semibold">{s.name}</div>
                      <div className="text-sm opacity-80">${(s.priceCents/100).toFixed(2)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {service && (
                <div className="space-y-3">
                  <h3 className="font-medium text-[color:var(--g600)]">Choose a bay</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start items-start items-start">
                    {bays.map(b => (
                      <button key={b.id}
                        onClick={() => { setBay(b); setSlotISO(null); }}
                        className={`card selectable ${bay?.id === b.id ? "is-selected" : ""}`}>
                        <div className="font-semibold">{b.name}</div>
                        <div className="text-sm opacity-80">{b.type === "PRIME" ? "Prime" : "Standard"} • Cap {b.capacity}</div>
                      </button>
                    ))}
                  </div>
                  {bay && (
                    <div className="pt-2">
                      <button className="btn" onClick={() => setStep(3)}>View availability</button>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          
{step === 3 && service && bay && (
  <section className="space-y-6">
    <div className="grid md:grid-cols-2 gap-6 items-stretch">
      <div className="panel">
        <h4 className="font-medium text-[color:var(--g600)] mb-2">Pick a date</h4>
        <DayPicker mode="single" selected={date} onSelect={(d)=>d&&setDate(d)} className="w-full" />
      </div>
      <div className="panel">
        <h4 className="font-medium text-[color:var(--g600)] mb-2">Your selection</h4>
        <div className="card selectable is-selected">
          <div className="thumb h-24 rounded-xl overflow-hidden mb-3 bg-gray-100">
            <img src={`/services/${svcSlug(service)}.jpg`} alt={service.name} className="w-full h-full object-cover" />
          </div>
          <div className="font-medium">{service.name}</div>
          <div className="text-sm opacity-80">{service.durationMinutes} minutes{typeof service.priceCents==="number" ? " • $"+(service.priceCents/100).toFixed(2) : ""}</div>
        </div>
{bay && (
  <div className="mt-3">
    <div className="card selectable is-selected">
      <div className="font-semibold">{bay.name}</div>
      <div className="text-sm opacity-80">{bay.type === "PRIME" ? "Prime" : "Standard"} • Cap {bay.capacity}</div>
    </div>
  </div>
)}

      </div>
    </div>

    <div className="panel">
      <h4 className="font-medium text-[color:var(--g600)] mb-2">
        Available times • {format(date, "EEE, MMM d")}
      </h4>
      <div className="time-grid">
        {slots.map(s => (
          <button
            key={s.iso}
            disabled={!s.available}
            onClick={() => { if (s.available) { setSlotISO(s.iso); setStep(4); } }}
            className={"chip w-full justify-center " + (slotISO===s.iso ? "chip-active" : "") + (s.available ? "" : " chip-disabled")}
            title={s.available ? "" : "Unavailable"}
          >
            {s.label}
          </button>
        ))}
        {slots.length === 0 && <p className="text-sm opacity-75">No times available.</p>}
      </div>
    </div>
  </section>
)}
{step === 4 && service && bay && slotISO && (
            <section className="panel self-start h-auto space-y-3">
              <h3 className="font-medium text-[color:var(--g600)]">Confirm your booking</h3>
              <ul className="text-sm">
                <li>Name: {form.getValues().fullName || <i>missing</i>}</li>
                <li>Email: {form.getValues().email || <i>missing</i>}</li>
                <li>Phone: {form.getValues().phone || <i>missing</i>}</li>
                <li>Service: {service.name}</li>
                <li>Bay: {bay.name}</li>
                <li>Time: {format(parseISO(slotISO), "eee, MMM d • p")}</li>
              </ul>
              <div className="flex gap-3">
                <button className="btn" onClick={confirm}>Confirm & Send Email</button>
                <button className="btn-secondary" onClick={() => setStep(3)}>Change time</button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
