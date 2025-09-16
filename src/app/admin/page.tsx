"use client";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Row = {
  id: string;
  status: "CONFIRMED" | "CANCELED";
  confirmationCode: string;
  startTime: string;
  endTime: string;
  bay: { name: string };
  service: { name: string; durationMinutes: number };
  customer: { fullName: string; email: string };
};

export default function AdminPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateStr = useMemo(() => format(selectedDate, "yyyy-MM-dd"), [selectedDate]);

  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["adminBookings", dateStr],
    queryFn: async () => {
      const r = await fetch(`/api/admin/bookings?date=${dateStr}`);
      const j = await r.json();
      return (j.bookings || []) as Row[];
    },
  });

  const cancelMut = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch(`/api/bookings/${id}`, { method: "POST" });
      if (!r.ok) throw new Error("cancel failed");
      return r.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminBookings", dateStr] }),
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="card">
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-gray-600">Pick a date to view & manage bookings.</p>
      </header>

      <div className="grid lg:grid-cols-[360px,1fr] gap-6">
        <section className="card">
          <h3 className="font-medium mb-3">Choose a date</h3>
          <div className="rounded-xl border bg-white overflow-hidden">
            <DayPicker mode="single" selected={selectedDate} onSelect={(d)=>d && setSelectedDate(d)} showOutsideDays className="p-2" />
          </div>
        </section>

        <section className="card">
          <h3 className="font-medium mb-3">Bookings for {format(selectedDate, "MMMM do, yyyy")}</h3>
          <div className="space-y-3">
            {(data || []).map((b) => (
              <div key={b.id} className="border rounded-2xl p-4 flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{b.bay.name}</div>
                    {b.status === "CONFIRMED" ? (
                      <span className="badge-green">Confirmed</span>
                    ) : (
                      <span className="badge-gray">Canceled</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-700">{b.service.name} • {fmt(b.startTime)} – {fmt(b.endTime)}</div>
                  <div className="text-xs text-gray-600">{b.customer.fullName} • {b.customer.email} • Code: {b.confirmationCode}</div>
                </div>
                <div>
                  {b.status === "CONFIRMED" ? (
                    <button className="btn-danger" onClick={() => cancelMut.mutate(b.id)} disabled={cancelMut.isPending}>Cancel</button>
                  ) : (
                    <span className="text-xs text-gray-500">No actions</span>
                  )}
                </div>
              </div>
            ))}
            {(!data || data.length === 0) && <p className="text-sm text-gray-600">No bookings.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

function fmt(iso: string) {
  return format(new Date(iso), "h:mm a");
}
