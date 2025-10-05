"use client";

import { useMemo, useState } from "react";
import { format, min as dfMin, max as dfMax } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Booking = {
  id: string;
  startTime: string;
  endTime: string;
  status: "CONFIRMED" | "CANCELED";
  confirmationCode: string;
  customer: { fullName: string; email: string; phone?: string | null };
  bay: { name: string };
  service: { name: string; durationMinutes: number };
};

type Bay = {
  id: string;
  name: string;
  type?: "PRIME" | "STANDARD";
  capacity?: number;
};

function parseBookings(payload: any): Booking[] {
  if (Array.isArray(payload)) return payload as Booking[];
  if (payload && Array.isArray(payload.bookings)) return payload.bookings as Booking[];
  return [];
}

export default function AdminPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateStr = useMemo(() => format(selectedDate, "yyyy-MM-dd"), [selectedDate]);

  const qc = useQueryClient();

  const { data: bays = [] } = useQuery({
    queryKey: ["bays"],
    queryFn: async () => {
      const r = await fetch("/api/bays");
      return (await r.json()) as Bay[];
    },
  });

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["adminBookings", dateStr],
    queryFn: async () => {
      const r = await fetch(`/api/admin/bookings?date=${dateStr}`);
      const j = await r.json();
      return parseBookings(j);
    },
  });

  async function cancel(id: string) {
    await fetch(`/api/bookings/${id}`, { method: "POST" });
    qc.invalidateQueries({ queryKey: ["adminBookings", dateStr] });
  }

  // Build bay rows ensuring every bay shows (even 0 bookings)
  const bayRows = useMemo(() => {
    const rows = bays.map((bay) => {
      const bks = bookings.filter((b) => (b.bay?.name || "").toLowerCase() === bay.name.toLowerCase());
      const confirmed = bks.filter((b) => b.status === "CONFIRMED");
      const canceled = bks.filter((b) => b.status === "CANCELED");
      const first = bks.length ? dfMin(bks.map((b) => new Date(b.startTime))) : null;
      const last = bks.length ? dfMax(bks.map((b) => new Date(b.endTime))) : null;
      return {
        bay,
        count: bks.length,
        confirmed: confirmed.length,
        canceled: canceled.length,
        first,
        last,
      };
    });
    return rows.sort((a, b) => a.bay.name.localeCompare(b.bay.name));
  }, [bays, bookings]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[color:var(--g600)]">Admin</h1>

      {/* Top row: Date picker + Bay overview (same width & height) */}
      <div className="grid md:grid-cols-[360px_minmax(0,1fr)] gap-4 items-stretch">
        <div className="panel max-w-md min-h-[420px]">
          <h3 className="font-medium text-[color:var(--g600)] mb-2">Choose a date</h3>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(d) => d && setSelectedDate(d)}
            className="w-full"
          />
        </div>

        <div className="panel min-h-[420px] w-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-[color:var(--g600)]">
              Bay overview • {format(selectedDate, "EEE, MMM d")}
            </h3>
            {isLoading && <span className="text-sm opacity-60">Loading…</span>}
          </div>

          <div className="rounded-xl overflow-hidden ring-1 ring-emerald-900/10 bg-[linear-gradient(180deg,#f7fef9_0%,#ecfbf1_100%)]">
            <table className="w-full text-sm">
              <thead className="bg-white/70">
                <tr className="text-left">
                  <th className="px-3 py-2 font-medium">Bay</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Cap</th>
                  <th className="px-3 py-2 font-medium">Bookings</th>
                  <th className="px-3 py-2 font-medium">Confirmed</th>
                  <th className="px-3 py-2 font-medium">Canceled</th>
                  <th className="px-3 py-2 font-medium">First</th>
                  <th className="px-3 py-2 font-medium">Last</th>
                </tr>
              </thead>
              <tbody>
                {bayRows.map((r) => (
                  <tr key={r.bay.id} className="border-t border-emerald-900/10 bg-white/60">
                    <td className="px-3 py-2">{r.bay.name}</td>
                    <td className="px-3 py-2 uppercase opacity-70">{r.bay.type || "-"}</td>
                    <td className="px-3 py-2">{r.bay.capacity ?? "-"}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex min-w-[2.5rem] justify-center rounded-md bg-emerald-50 text-[color:var(--g600)] ring-1 ring-emerald-900/10 px-2 py-0.5 font-medium">
                        {r.count}
                      </span>
                    </td>
                    <td className="px-3 py-2">{r.confirmed}</td>
                    <td className="px-3 py-2">{r.canceled}</td>
                    <td className="px-3 py-2">{r.first ? format(r.first, "p") : "—"}</td>
                    <td className="px-3 py-2">{r.last ? format(r.last, "p") : "—"}</td>
                  </tr>
                ))}
                {bayRows.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-sm opacity-70" colSpan={8}>
                      No bays found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tiny legend */}
          <div className="mt-2 text-xs opacity-70">
            Counts reflect all bookings on the selected date (including canceled).
          </div>
        </div>
      </div>

      {/* Bookings list: full width */}
      <div className="panel">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-[color:var(--g600)]">
            Bookings • {format(selectedDate, "EEE, MMM d")}
          </h3>
          {isLoading && <span className="text-sm opacity-60">Loading…</span>}
        </div>

        <div className="space-y-3">
          {bookings.map((b) => {
            const start = new Date(b.startTime);
            const end = new Date(b.endTime);
            const ok = b.status === "CONFIRMED";
            return (
              <div
                key={b.id}
                className="card hover:shadow-2xl transition-shadow bg-[linear-gradient(180deg,#ffffff_0%,#f7faf7_100%)]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left: stacked info */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          ok ? "bg-[color:var(--g600)]" : "bg-red-500"
                        }`}
                        title={b.status}
                      />
                      <div className="font-semibold">
                        {b.bay.name} • {b.service.name}
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shadow ${
                          ok
                            ? "bg-[color:var(--g50)] text-[color:var(--g600)]"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {b.status.toLowerCase()}
                      </span>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-lg ring-1 ring-slate-200 bg-white p-2">
                        <div className="text-xs opacity-60">When</div>
                        <div className="font-medium">
                          {format(start, "p")} – {format(end, "p")}
                        </div>
                      </div>

                      <div className="rounded-lg ring-1 ring-slate-200 bg-white p-2">
                        <div className="text-xs opacity-60">Customer</div>
                        <div className="font-medium">{b.customer.fullName}</div>
                        <div className="opacity-80 break-all">{b.customer.email}</div>
                      </div>

                      <div className="rounded-lg ring-1 ring-slate-200 bg-white p-2">
                        <div className="text-xs opacity-60">Duration</div>
                        <div className="font-medium">{b.service.durationMinutes} min</div>
                      </div>

                      <div className="rounded-lg ring-1 ring-slate-200 bg-white p-2">
                        <div className="text-xs opacity-60">Code</div>
                        <div className="font-mono">{b.confirmationCode}</div>
                      </div>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="shrink-0">
                    {ok ? (
                      <button className="btn" onClick={() => cancel(b.id)}>
                        Cancel
                      </button>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shadow bg-gray-100 text-gray-700">
                        No actions
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {!isLoading && bookings.length === 0 && (
            <p className="text-sm opacity-80">No bookings.</p>
          )}
        </div>
      </div>
    </div>
  );
}
