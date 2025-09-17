"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Booking = {
  id: string;
  startTime: string;
  endTime: string;
  status: "CONFIRMED" | "CANCELED";
  confirmationCode: string;
  customer: { fullName: string; email: string };
  bay: { name: string };
  service: { name: string; durationMinutes: number };
};

export default function AdminPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateStr = useMemo(() => format(selectedDate, "yyyy-MM-dd"), [selectedDate]);

  const qc = useQueryClient();
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["adminBookings", dateStr],
    queryFn: async () => {
      const r = await fetch(`/api/admin/bookings?date=${dateStr}`);
      const j = await r.json();
      return j.bookings as Booking[];
    },
  });

  async function cancel(id: string) {
    await fetch(`/api/bookings/${id}`, { method: "POST" });
    qc.invalidateQueries({ queryKey: ["adminBookings", dateStr] });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[color:var(--g600)]">Admin</h1>
      <div className="grid md:grid-cols-[360px_1fr] gap-4 items-start">
        <div className="panel max-w-md">
          <h3 className="font-medium text-[color:var(--g600)] mb-2">Choose a date</h3>
          <DayPicker mode="single" selected={selectedDate} onSelect={(d)=>d&&setSelectedDate(d)} className="w-full" />
        </div>

        <div className="panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-[color:var(--g600)]">Bookings • {format(selectedDate, "EEE, MMM d")}</h3>
            {isLoading && <span className="text-sm opacity-60">Loading…</span>}
          </div>
          <div className="space-y-3">
            {bookings.map(b => (
              <div key={b.id} className="card hover:shadow-xl">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${b.status==="CONFIRMED"?"bg-[color:var(--g600)]":"bg-red-500"}`} />
                      <div className="font-medium">{b.bay.name} • {b.service.name}</div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shadow ${b.status==="CONFIRMED"?"bg-[color:var(--g50)] text-[color:var(--g600)]":"bg-gray-100 text-gray-700"}`}>{b.status.toLowerCase()}</span>
                    </div>
                    <div className="text-sm opacity-80">
                      {format(new Date(b.startTime), "p")} – {format(new Date(b.endTime), "p")}
                    </div>
                    <div className="text-sm opacity-80">{b.customer.fullName} • {b.customer.email}</div>
                    <div className="text-xs opacity-60">Code: {b.confirmationCode}</div>
                  </div>

                  {b.status === "CONFIRMED" ? (
                    <button className="btn" onClick={() => cancel(b.id)}>Cancel</button>
                  ) : (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shadow bg-gray-100 text-gray-700">No actions</span>
                  )}
                </div>
              </div>
            ))}
            {bookings.length === 0 && <p className="text-sm opacity-80">No bookings.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
