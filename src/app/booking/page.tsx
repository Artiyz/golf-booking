"use client";

import { useMe, type Me as BaseMe, signalAuthChanged } from "@/lib/useMe";
type Me = BaseMe & {
  fullName?: string | null;
  name?: string | null;
  phoneNumber?: string | null;
  tel?: string | null;
};

import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { ConfirmationView } from "./components/ConfirmationView";
import Image from "next/image";

function parseUser(u?: Me | null): {
  first: string;
  last: string;
  phone: string;
} {
  if (!u) return { first: "", last: "", phone: "" };
  const fullGuess =
    u.firstName || u.lastName
      ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()
      : u.fullName || u.name || "";
  const parts = (fullGuess || "").trim().split(/\s+/);
  const first = parts[0] || "";
  const last = parts.slice(1).join(" ");
  const phone = (u as any).phone || u.phoneNumber || u.tel || "";
  return { first, last, phone };
}

function prefillFromMe(
  form: ReturnType<typeof useForm<ContactData>>,
  me?: Me | null
) {
  if (!me) return;
  const p = parseUser(me);
  form.setValue(
    "fullName",
    [p.first, p.last].filter(Boolean).join(" ") || (me?.email ?? "")
  );
  form.setValue("email", me?.email ?? "");
  form.setValue("phone", p.phone || "");
}

const svcSlug = (x: { name: string; slug?: string }) =>
  x.slug ??
  x.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/* Basic contact schema for guest bookings */
const contactSchema = z.object({
  fullName: z.string().min(1, "Please enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone"),
});
type ContactData = z.infer<typeof contactSchema>;

type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  priceCents: number;
  slug?: string;
};
type Bay = {
  id: string;
  name: string;
  type: "PRIME" | "STANDARD";
  capacity: number;
};
type Slot = { iso: string; label: string; available: boolean };

/* Hours of operation (local time). */
const CLOSE_HOUR = 22;

/* ====================== Component ====================== */
export default function Booking() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const { me, authLoading, isAuthed } = useMe();

  const [guestMode, setGuestMode] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("guest") === "1" && !isAuthed) {
      setGuestMode(true);
      setStep(2);
    }
  }, [isAuthed]);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const contactResolver = zodResolver(
    contactSchema
  ) as unknown as Resolver<ContactData>;
  const form = useForm<ContactData>({
    resolver: contactResolver,
    defaultValues: { fullName: "", email: "", phone: "" },
    mode: "onBlur",
  });

  useEffect(() => {
    if (isAuthed && me) prefillFromMe(form, me);
  }, [isAuthed, me, step]);

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () =>
      (await fetch("/api/services").then((r) => r.json())) as Service[],
  });

  const { data: bays = [] } = useQuery({
    queryKey: ["bays"],
    queryFn: async () =>
      (await fetch("/api/bays").then((r) => r.json())) as Bay[],
  });

  const [service, setService] = useState<Service | null>(null);

  const [date, setDate] = useState<Date>(() => {
    const now = new Date();
    return now.getHours() >= CLOSE_HOUR ? addDays(now, 1) : now;
  });
  const dateStr = useMemo(() => format(date, "yyyy-MM-dd"), [date]);

  const [bay, setBay] = useState<Bay | null>(null);
  const [baySlotsMap, setBaySlotsMap] = useState<Record<string, Slot[]>>({});
  const [bayHasAvail, setBayHasAvail] = useState<Record<string, boolean>>({});
  const [loadingBays, setLoadingBays] = useState(false);
  const [slotISO, setSlotISO] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      const isToday = format(now, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
      if (isToday && now.getHours() >= CLOSE_HOUR) {
        setDate(addDays(now, 1));
      }
    }, 60_000);
    return () => clearInterval(id);
  }, [date]);

  useEffect(() => {
    if (!service || bays.length === 0) return;
    if (!(step === 3)) return;

    let aborted = false;
    const controller = new AbortController();
    (async () => {
      try {
        setLoadingBays(true);
        const results = await Promise.all(
          bays.map(async (b) => {
            const r = await fetch(
              `/api/availability?serviceId=${service.id}&bayId=${b.id}&date=${dateStr}`,
              {
                signal: controller.signal,
              }
            );
            const j = await r.json().catch(() => ({ slots: [] }));
            const slots: Slot[] = Array.isArray(j.slots) ? j.slots : [];
            const has = slots.some((s) => s.available);
            return { bayId: b.id, slots, has };
          })
        );
        if (aborted) return;
        const map: Record<string, Slot[]> = {};
        const flags: Record<string, boolean> = {};
        for (const { bayId, slots, has } of results) {
          map[bayId] = slots;
          flags[bayId] = has;
        }
        setBaySlotsMap(map);
        setBayHasAvail(flags);

        if (bay && !flags[bay.id]) {
          setBay(null);
          setSlotISO(null);
        }
      } finally {
        if (!aborted) setLoadingBays(false);
      }
    })();

    return () => {
      aborted = true;
      controller.abort();
    };
  }, [service, dateStr, bays, step]);

  const currentSlots: Slot[] = bay ? baySlotsMap[bay.id] ?? [] : [];

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setLoginError(j?.error || "Invalid email or password.");
        return;
      }
      signalAuthChanged();
      setGuestMode(false);
      setStep(1);
    } catch {
      setLoginError("Network error. Please try again.");
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (_) {
    } finally {
      signalAuthChanged();
      setStep(1);
    }
  }

  function nextFromContact() {
    if (isAuthed) {
      setStep(2);
      return;
    }
    const v = form.getValues();
    if (v.fullName && v.email && v.phone) setStep(2);
  }

  async function confirm() {
    if (!service || !bay || !slotISO) return;

    let fullName = "";
    let email = "";
    let phone = "";
    if (isAuthed && me?.email) {
      const p = parseUser(me);
      fullName =
        [p.first, p.last].filter(Boolean).join(" ") || (me.email as string);
      email = me.email as string;
      phone = p.phone || "";
    } else {
      const v = form.getValues();
      fullName = v.fullName;
      email = v.email;
      phone = v.phone;
    }

    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        email,
        phone,
        serviceId: service.id,
        bayId: bay.id,
        startISO: slotISO,
      }),
    });
    if (res.ok) {
      alert("Booked! A confirmation email was sent.");
      setStep(1);
      form.reset();
      if (isAuthed && me) prefillFromMe(form, me);
      setService(null);
      setBay(null);
      setSlotISO(null);
      setDate(new Date());
      setBaySlotsMap({});
      setBayHasAvail({});
    } else {
      const j = await res.json().catch(() => ({ error: "" }));
      alert(j.error || "Could not book. Try another time.");
    }
  }

  const err = form.formState.errors;
  const [wFullName, wEmail, wPhone] = form.watch([
    "fullName",
    "email",
    "phone",
  ]);
  const customer = useMemo(() => {
    if (isAuthed && me) {
      const p = parseUser(me);
      return {
        firstName: p.first,
        lastName: p.last,
        email: me.email || "",
        phone: p.phone || "",
      };
    }
    const parts = String(wFullName || "")
      .trim()
      .split(/\s+/);
    const firstName = parts[0] || String(wFullName || "");
    const lastName = parts.slice(1).join(" ");
    return { firstName, lastName, email: wEmail || "", phone: wPhone || "" };
  }, [isAuthed, me, wFullName, wEmail, wPhone]);

  return (
    <div className="mx-auto max-w-3xl mt-5">
      <div className="steps-shell">
        <div className="steps-grid">
          {["Contact", "Service", "Availability", "Confirmation"].map(
            (label, i) => {
              const n = (i + 1) as 1 | 2 | 3 | 4;
              const cls =
                n === step
                  ? "step step-active"
                  : n < step
                  ? "step step-done"
                  : "step step-idle";
              const clickable = n < step;
              return (
                <div
                  key={label}
                  className={cls}
                  onClick={() => clickable && setStep(n)}
                >
                  <span>{n}.</span>
                  <span className="hidden sm:inline">{label}</span>
                </div>
              );
            }
          )}
        </div>

        <div className="form-body">
          {step === 1 && (
            <section className="space-y-4">
              {authLoading ? (
                <div className="text-sm opacity-80">Checking your session…</div>
              ) : !isAuthed ? (
                // --- NOT LOGGED IN ---
                <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr] gap-6 items-start">
                  {/* Left: login form */}
                  <div>
                    <h2 className="mt-4 text-lg font-semibold text-[color:var(--g600)]">
                      Please log in or sign up to make a booking
                    </h2>
                    <form
                      className="space-y-3 mt-3"
                      onSubmit={handleLogin}
                      noValidate
                    >
                      <div>
                        <label className="block text-sm mb-1 mt-6">Email</label>
                        <input
                          className="input"
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1 mt-4">
                          Password
                        </label>
                        <input
                          className="input"
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      {loginError && (
                        <p className="text-sm text-red-600">{loginError}</p>
                      )}
                      <div className="flex items-center gap-3 pt-6">
                        <button className="btn" type="submit">
                          Log in
                        </button>
                        <a className="btn btn-ghost" href="/signup">
                          Sign up
                        </a>
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => {
                            setGuestMode(true);
                            setStep(2);
                          }}
                        >
                          Browse as a guest
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Right: logo image */}
                  <div className="hidden md:flex justify-center mt-4">
                    <Image
                      src="/golf/icons/Celtic Virtual Golf Logo-20251009.svg"
                      alt="Celtic Virtual Golf"
                      width={320}
                      height={320}
                      className="max-w-full h-auto"
                      priority
                    />
                  </div>
                </div>
              ) : (
                // --- LOGGED IN ---
                <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr] gap-6 items-start">
                  {/* Left: compact identity layout */}
                  <div className="min-h-[300px]">
                    <h2 className=" mt-4 text-lg font-semibold text-[color:var(--g600)]">
                      {`Hello ${me?.firstName ?? ""}! `}
                      <span className="font-normal">
                        Let’s find you the right spot.
                      </span>
                    </h2>

                    <div className="mt-5 grid gap-y-5 gap-x-4 md:grid-cols-2">
                      {/* Name (First + Last) */}
                      <label className="block">
                        <span className="block text-sm mb-1">Name</span>
                        <input
                          className="input"
                          value={`${(me?.firstName ?? "").trim()} ${(
                            me?.lastName ?? ""
                          ).trim()}`.trim()}
                          readOnly
                        />
                      </label>

                      {/* Phone */}
                      <label className="block">
                        <span className="block text-sm mb-1">Phone</span>
                        <input
                          className="input"
                          value={me?.phone ?? ""}
                          readOnly
                        />
                      </label>

                      {/* Email */}
                      <label className="block md:col-span-2">
                        <span className="block text-sm mb-1">Email</span>
                        <input
                          className="input"
                          value={me?.email ?? ""}
                          readOnly
                        />
                      </label>

                      <div className="md:col-span-2 flex items-start pt-2 gap-2">
                        <button className="btn" onClick={() => setStep(2)}>
                          Continue
                        </button>
                        <button
                          className="btn-secondary"
                          onClick={handleLogout}
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: logo image */}
                  <div className="hidden md:flex justify-center items-center mt-4 ">
                    <Image
                      src="/golf/icons/Celtic Virtual Golf Logo-20251009.svg"
                      alt="Celtic Virtual Golf"
                      width={420}
                      height={420}
                      className="max-w-full h-auto"
                      priority
                    />
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ==== STEP 2: Services ==== */}
          {step === 2 && (
            <section className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-medium text-[color:var(--g600)]">
                  Select a service
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setService(s);
                        setSlotISO(null);
                        setBay(null);
                      }}
                      className={`card selectable ${
                        service?.id === s.id ? "is-selected" : ""
                      }`}
                    >
                      <img
                        src={`/services/${svcSlug(s)}.jpg`}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/services/default.jpg";
                        }}
                        alt={s.name}
                        className="h-44 w-full object-cover rounded-xl mb-3"
                      />
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-sm opacity-80">
                        {s.durationMinutes} min
                        {typeof s.priceCents === "number"
                          ? ` • $${(s.priceCents / 100).toFixed(2)}`
                          : ""}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Show the button only after a service is picked */}
              {service && (
                <div className="pt-2">
                  <button className="btn" onClick={() => setStep(3)}>
                    Check availability
                  </button>
                </div>
              )}

              {!service && (
                <p className="text-sm opacity-70">
                  Pick a service to continue.
                </p>
              )}
            </section>
          )}

          {/* ==== STEP 3: Date picker + bay list (validated), then times ==== */}
          {step === 3 && service && (
            <section className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6 items-stretch">
                <div className="h-full">
                  <h4 className="font-medium text-[color:var(--g600)] mb-2">
                    Pick a date
                  </h4>
                  <div className="w-full rounded-xl ring-1 ring-emerald-900/10 bg-white p-2">
                    <DayPicker
                      mode="single"
                      selected={date}
                      onSelect={(d) => d && setDate(d)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="h-full">
                  <h4 className="font-medium text-[color:var(--g600)] mb-2">
                    Your service
                  </h4>
                  <div className="card selectable is-selected flex flex-col">
                    <div className="thumb flex-1 max-h-[217px] rounded-xl overflow-hidden mb-3 bg-gray-100">
                      <img
                        src={`/services/${svcSlug(service)}.jpg`}
                        alt={service.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/services/default.jpg";
                        }}
                      />
                    </div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm opacity-80">
                      {service.durationMinutes} minutes
                      {typeof service.priceCents === "number"
                        ? " • $" + (service.priceCents / 100).toFixed(2)
                        : ""}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bay list (validated) */}
              <div className="space-y-3">
                <h4 className="font-medium text-[color:var(--g600)]">
                  Choose a bay
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                  {bays.slice(0, 6).map((b) => {
                    const disabled = loadingBays
                      ? true
                      : bayHasAvail[b.id] === false;
                    const selected = bay?.id === b.id;
                    const totalAvail =
                      baySlotsMap[b.id]?.filter((s) => s.available).length ?? 0;

                    return (
                      <button
                        key={b.id}
                        disabled={disabled}
                        onClick={() => {
                          if (!disabled) {
                            setBay(b);
                            setSlotISO(null);
                          }
                        }}
                        className={
                          `card selectable w-full ${
                            selected ? "is-selected" : ""
                          } ` +
                          (disabled
                            ? "opacity-50 cursor-not-allowed ring-1 ring-slate-200"
                            : "")
                        }
                        title={
                          disabled
                            ? "No available window for this service on this date"
                            : ""
                        }
                      >
                        <div className="font-semibold">{b.name}</div>
                        <div className="text-sm opacity-80">
                          {b.type === "PRIME" ? "Prime" : "Standard"} • Cap{" "}
                          {b.capacity}
                        </div>

                        <div className="mt-1 text-xs opacity-70">
                          {totalAvail} time{totalAvail === 1 ? "" : "s"}{" "}
                          available
                        </div>
                      </button>
                    );
                  })}
                </div>
                {loadingBays && (
                  <div className="text-sm opacity-70">
                    Checking bay availability…
                  </div>
                )}
              </div>

              {/* Times for selected bay */}
              {bay && (
                <div>
                  <h4 className="font-medium text-[color:var(--g600)] mb-2">
                    Available times • {bay.name} • {format(date, "EEE, MMM d")}
                  </h4>
                  <div className="time-grid">
                    {currentSlots.map((s) => (
                      <button
                        key={s.iso}
                        disabled={!s.available}
                        onClick={() => {
                          if (!s.available) return;
                          if (!isAuthed) {
                            setShowAuthDialog(true);
                            return;
                          }
                          setSlotISO(s.iso);
                          setShowAuthDialog(false);
                          setStep(4);
                        }}
                        className={
                          "chip w-full justify-center " +
                          (slotISO === s.iso ? "chip-active" : "") +
                          (s.available ? "" : " chip-disabled")
                        }
                        title={s.available ? "" : "Unavailable"}
                      >
                        {s.label}
                      </button>
                    ))}
                    {currentSlots.length === 0 && (
                      <p className="text-sm opacity-75">No times available.</p>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ==== STEP 4: Confirmation ==== */}
          {step === 4 && service && bay && slotISO && (
            <ConfirmationView
              customer={customer}
              service={service}
              bay={bay}
              startISO={slotISO}
              onConfirm={confirm}
              onChangeTime={() => setStep(3)}
            />
          )}
        </div>
      </div>

      {/* Auth required dialog for guests picking a time */}
      {showAuthDialog && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowAuthDialog(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-lg font-semibold text-emerald-900">
              Log in to make a booking
            </h4>
            <p className="mt-2 text-sm text-slate-700">
              To reserve this time, please log in or sign up in. Once you’re
              logged in, you can come back here and book your time.
            </p>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-xl px-4 py-2 text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => setShowAuthDialog(false)}
              >
                Keep browsing times
              </button>
              <button
                type="button"
                className="rounded-xl px-4 py-2 text-sm font-semibold bg-[color:var(--g600)] text-white hover:bg-emerald-700"
                onClick={() => {
                  setShowAuthDialog(false);
                  setStep(1);
                  if (typeof window !== "undefined") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
