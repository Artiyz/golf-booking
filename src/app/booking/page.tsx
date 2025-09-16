"use client";

import { useEffect, useState } from "react";
import { format, parseISO, startOfToday } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Service = { id: string; name: string; durationMinutes: number; priceCents: number };
type Bay = { id: string; name: string; type: string; capacity: number };
type Slot = { iso: string; available: boolean };

const contactSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
});
type ContactData = z.infer<typeof contactSchema>;

function timeLabel(iso: string) {
  return format(parseISO(iso), "p");
}

export default function Booking() {
  const [step, setStep] = useState<1|2|3|4>(1);

  const form = useForm<ContactData, any, ContactData>({
    resolver: zodResolver(contactSchema) as any,
  });

  const [services, setServices] = useState<Service[]>([]);
  const [bays, setBays] = useState<Bay[]>([]);
  const [service, setService] = useState<Service | null>(null);
  const [bay, setBay] = useState<Bay | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [avail, setAvail] = useState<{ slots: Slot[] } | null>(null);
  const [slotISO, setSlotISO] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/services").then(r => r.json()).then(setServices);
    fetch("/api/bays").then(r => r.json()).then(setBays);
  }, []);

  useEffect(() => {
    if (!service || !bay || !date) return;
    const d = format(date, "yyyy-MM-dd");
    fetch(`/api/availability?serviceId=${service.id}&bayId=${bay.id}&date=${d}`)
      .then(r => r.json())
      .then(setAvail);
  }, [service, bay, date]);

  function nextFromContact(values: ContactData) {
    if (!values) return;
    setStep(2);
  }

  async function confirm() {
    const values = form.getValues();
    if (!values.fullName || !values.email || !values.phone || !service || !bay || !slotISO) {
      alert("Missing fields");
      return;
    }
    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        serviceId: service.id,
        bayId: bay.id,
        slotISO,
      }),
    });
    const j = await res.json();
    if (!res.ok) {
      alert(j.error || "Booking failed");
      return;
    }
    alert(`Booked! Code: ${j.code}`);
    setStep(1);
    form.reset();
    setService(null);
    setBay(null);
    setDate(undefined);
    setSlotISO(null);
    setAvail(null);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Steps step={step} setStep={setStep} />

      {step === 1 && (
        <section className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="text-lg font-semibold">Contact</h2>
          <form className="space-y-4" onSubmit={form.handleSubmit(nextFromContact)} noValidate>
            <div>
              <label className="block text-sm font-medium mb-1">Full name</label>
              <input className="input" {...form.register("fullName")} placeholder="Jane Doe" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input className="input" {...form.register("email")} placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input className="input" {...form.register("phone")} placeholder="555-123-4567" />
              </div>
            </div>
            <div className="pt-2">
              <button className="btn" type="submit">Continue</button>
            </div>
          </form>
        </section>
      )}

      {step === 2 && (
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-medium mb-2">Select a service</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setService(s); setBay(null); }}
                  className={`card ${service?.id === s.id ? "ring-2 ring-blue-600" : ""}`}
                >
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm">{s.durationMinutes} minutes</div>
                  <div className="text-sm">${(s.priceCents / 100).toFixed(2)}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-medium mb-2">Pick a bay</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bays.map(b => (
                <button
                  key={b.id}
                  disabled={!service}
                  onClick={() => setBay(b)}
                  className={`card ${bay?.id === b.id ? "ring-2 ring-blue-600" : ""} ${service ? "" : "opacity-50 cursor-not-allowed"}`}
                  title={service ? "" : "Choose a service first"}
                >
                  <div className="font-semibold">{b.name}</div>
                  <div className="text-sm">{b.type === "PRIME" ? "Prime" : "Standard"}</div>
                  <div className="text-sm">Capacity {b.capacity}</div>
                </button>
              ))}
            </div>
            {service && bay && (
              <div className="mt-4 flex gap-3">
                <button className="btn" onClick={() => setStep(3)}>View availability</button>
                <button className="btn-secondary" onClick={() => setBay(null)}>Change service</button>
              </div>
            )}
          </div>
        </section>
      )}

      {step === 3 && service && bay && (
        <section className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="mb-2 text-sm text-gray-600">Service: <b>{service.name}</b> • Bay: <b>{bay.name}</b></div>
            <DayPicker
              mode="single"
              selected={date}
              onSelect={setDate}
              fromDate={startOfToday()}
              disabled={{ before: startOfToday() }}
            />
          </div>

          {date && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-medium mb-3">Available times</h3>
              <div className="flex flex-wrap gap-2">
                {(avail?.slots ?? []).map((s) => (
                  <button
                    key={s.iso}
                    disabled={!s.available}
                    onClick={() => { setSlotISO(s.iso); setStep(4); }}
                    className={`chip ${s.available ? "" : "opacity-50 cursor-not-allowed"}`}
                    title={s.available ? "" : "Unavailable"}
                  >
                    {timeLabel(s.iso)}
                  </button>
                ))}
                {Array.isArray(avail?.slots) && avail!.slots.length === 0 && (
                  <p className="text-sm text-gray-600">No times available.</p>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {step === 4 && service && bay && slotISO && (
        <section className="mt-6 bg-white p-6 rounded-2xl shadow space-y-2">
          <h3 className="font-medium">Confirm your booking</h3>
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
  );
}

function Steps({ step, setStep }: { step: 1|2|3|4; setStep: (s: 1|2|3|4) => void }) {
  const steps = ["Contact", "Service & Bay", "Availability", "Confirmation"];
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => {
        const n = (i+1) as 1|2|3|4;
        const active = n === step;
        const done = n < step;
        const base = "flex items-center gap-2 px-3 py-2 rounded-t-xl border border-b-0 text-sm";
        const color = active
          ? "bg-white text-blue-700 border-blue-300"
          : done
          ? "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
          : "bg-gray-50 text-gray-500";
        return (
          <div key={label} className={`${base} ${color}`} onClick={() => { if (done) setStep(n); }}>
            <span>{n}.</span><span className="hidden sm:inline">{label}</span>
          </div>
        );
      })}
      <div className="flex-1 border-b" />
    </div>
  );
}
