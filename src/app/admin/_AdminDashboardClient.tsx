"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  cancelReason?: string | null;
  checkedIn?: boolean;
  customer: {
    id?: string;
    fullName: string;
    email: string;
    phone?: string | null;
  };
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
  const raw: Booking[] = Array.isArray(payload)
    ? payload
    : payload?.bookings ?? [];
  return raw.map((b) => ({
    ...b,
    checkedIn: !!(b as any).checkedIn,
  }));
}

export default function AdminDashboardClient() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateStr = useMemo(
    () => format(selectedDate, "yyyy-MM-dd"),
    [selectedDate]
  );
  const qc = useQueryClient();

  const { data: bays = [] } = useQuery({
    queryKey: ["bays"],
    queryFn: async () => (await fetch("/api/bays")).json(),
  });

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["adminBookings", dateStr],
    queryFn: async () => {
      const r = await fetch(`/api/admin/bookings?date=${dateStr}`, {
        cache: "no-store",
      });
      return parseBookings(await r.json());
    },
  });

  async function doAction(
    id: string,
    action: "checkin" | "cancel",
    comment?: string
  ) {
    const r = await fetch(`/api/admin/bookings/${id}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, comment }),
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      throw new Error(j?.error || "Request failed");
    }
    qc.invalidateQueries({ queryKey: ["adminBookings", dateStr] });
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } catch (_) {
    } finally {
      router.replace("/dashboard");
      router.refresh?.();
    }
  }

  // Open the customer's profile directly.
  // Strategy:
  // 1) If booking already carries an id -> push /admin/users/[id]
  // 2) Else fetch full users list (same as Users table), find by email, push /admin/users/[id]
  // 3) Fallback to filtered users list if not found.
  async function goToCustomerProfile(customer: { id?: string; email: string }) {
    if (customer.id) {
      router.push(`/admin/users/${customer.id}`);
      return;
    }
    try {
      const r = await fetch("/api/admin/users", {
        cache: "no-store",
        credentials: "include",
      });
      if (r.ok) {
        const j = await r.json().catch(() => null);
        const arr: any[] = Array.isArray(j) ? j : j?.users || [];
        const match = arr.find(
          (u) =>
            typeof u?.email === "string" &&
            u.email.toLowerCase() === customer.email.toLowerCase()
        );
        if (match?.id) {
          router.push(`/admin/users/${match.id}`);
          return;
        }
      }
    } catch {
      // ignore and fall back
    }
    router.push(`/admin/users?email=${encodeURIComponent(customer.email)}`);
  }

  const [activeId, setActiveId] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  // Search/filter
  const [search, setSearch] = useState("");
  const filteredBookings = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter((b) => {
      const name = (b.customer.fullName || "").toLowerCase();
      const email = (b.customer.email || "").toLowerCase();
      const phone = (b.customer.phone || "").toLowerCase();
      const code = (b.confirmationCode || "").toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        code.includes(q)
      );
    });
  }, [bookings, search]);

  const bayRows = useMemo(() => {
    const rows = bays.map((bay) => {
      const bks = bookings.filter(
        (b) => (b.bay?.name || "").toLowerCase() === bay.name.toLowerCase()
      );
      const confirmed = bks.filter((b) => b.status === "CONFIRMED");
      const canceled = bks.filter((b) => b.status === "CANCELED");
      const first = bks.length
        ? dfMin(bks.map((b) => new Date(b.startTime)))
        : null;
      const last = bks.length
        ? dfMax(bks.map((b) => new Date(b.endTime)))
        : null;
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
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[color:var(--g600)]">
          Admin
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            className="btn-secondary"
          >
            Manage Users
          </button>
          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Date picker + Bay overview table */}
      <div className="grid md:grid-cols-[340px_minmax(0,1fr)] gap-4 items-stretch">
        <div className="panel max-w-md min-h-[400px]">
          <h3 className="font-medium text-[color:var(--g600)] mb-2">
            Choose a date
          </h3>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(d) => d && setSelectedDate(d)}
            className="w-full"
          />
        </div>

        <div className="panel min-h-[400px] w-full">
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
                  <tr key={r.bay.id}>
                    <td className="px-3 py-2">{r.bay.name}</td>
                    <td className="px-3 py-2 uppercase opacity-70">
                      {r.bay.type || "-"}
                    </td>
                    <td className="px-3 py-2">{r.bay.capacity ?? "-"}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex min-w-[2.5rem] justify-center rounded-md bg-emerald-50 text-[color:var(--g600)] ring-1 ring-emerald-900/10 px-2 py-0.5 font-medium">
                        {r.count}
                      </span>
                    </td>
                    <td className="px-3 py-2">{r.confirmed}</td>
                    <td className="px-3 py-2">{r.canceled}</td>
                    <td className="px-3 py-2">
                      {r.first ? format(r.first, "p") : "—"}
                    </td>
                    <td className="px-3 py-2">
                      {r.last ? format(r.last, "p") : "—"}
                    </td>
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
          <div className="mt-2 text-xs opacity-70">
            Counts reflect all bookings on the selected date (including
            canceled).
          </div>
        </div>
      </div>

      {/* Bookings list */}
      <div className="panel">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="font-medium text-[color:var(--g600)]">
            Bookings • {format(selectedDate, "EEE, MMM d")}
          </h3>
          <div className="flex items-center gap-2 w-full sm:w-[380px]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer or booking code…"
              aria-label="Search bookings"
              className="input !px-3 !py-2 !bg-white w-full"
            />
            {search && (
              <button
                className="btn-secondary"
                onClick={() => setSearch("")}
                title="Clear"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="max-h-[calc(100vh-47rem)] overflow-y-auto rounded-xl ring-1 ring-emerald-900/10 bg-white/60 p-2 pt-3 pb-2 overscroll-contain">
          <div className="space-y-3">
            {filteredBookings.map((b) => {
              const start = new Date(b.startTime);
              const end = new Date(b.endTime);
              const isCanceled = b.status === "CANCELED";
              const isChecked = !!b.checkedIn;
              const disabled = isCanceled || isChecked;
              const badge =
                b.status === "CANCELED"
                  ? "canceled"
                  : b.checkedIn
                  ? "checked in"
                  : "confirmed";
              return (
                <div
                  key={b.id}
                  className="rounded-2xl ring-1 ring-emerald-900/10 bg-[linear-gradient(180deg,#ffffff_0%,#f7faf7_100%)] p-3 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          isCanceled
                            ? "bg-red-500"
                            : isChecked
                            ? "bg-emerald-700"
                            : "bg-[color:var(--g600)]"
                        }`}
                      />
                      <div className="font-semibold">
                        {b.bay.name} • {b.service.name}
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shadow ${
                          isCanceled
                            ? "bg-red-50 text-red-700"
                            : isChecked
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-[color:var(--g50)] text-[color:var(--g600)]"
                        }`}
                      >
                        {badge}
                      </span>
                    </div>

                    <button
                      className={`btn ${
                        disabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => {
                        if (disabled) return;
                        setActiveId(b.id);
                        setComment("");
                      }}
                      disabled={disabled}
                      aria-disabled={disabled}
                      title={
                        disabled
                          ? "Available only for confirmed, not checked-in bookings"
                          : "Open actions"
                      }
                    >
                      Actions
                    </button>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 mt-3">
                    <div className="rounded-lg ring-1 ring-slate-200 bg-white p-2">
                      <div className="text-xs opacity-60">When</div>
                      <div className="font-medium">
                        {format(start, "p")} — {format(end, "p")}
                      </div>
                    </div>
                    <div className="rounded-lg ring-1 ring-slate-200 bg-white p-2">
                      <div className="text-xs opacity-60">Customer</div>
                      <div className="font-medium">
                        <button
                          type="button"
                          onClick={() =>
                            goToCustomerProfile({
                              id: b.customer?.id,
                              email: b.customer.email,
                            })
                          }
                          className="text-emerald-700 hover:underline"
                        >
                          {b.customer.fullName}
                        </button>
                      </div>
                      <div className="opacity-80 break-all">
                        {b.customer.email}
                      </div>
                    </div>
                    <div className="rounded-lg ring-1 ring-slate-200 bg-white p-2">
                      <div className="text-xs opacity-60">Duration</div>
                      <div className="font-medium">
                        {b.service.durationMinutes} min — {format(start, "p")}
                      </div>
                    </div>
                    <div className="rounded-lg ring-1 ring-slate-200 bg-white p-2">
                      <div className="text-xs opacity-60">Code</div>
                      <div className="font-mono">{b.confirmationCode}</div>
                    </div>
                  </div>

                  {isCanceled && b.cancelReason && (
                    <div className="mt-2 text-sm">
                      <span className="opacity-60">Cancel reason: </span>
                      <span className="italic">{b.cancelReason}</span>
                    </div>
                  )}
                </div>
              );
            })}
            {!isLoading && filteredBookings.length === 0 && (
              <p className="text-sm opacity-80">
                No bookings match your search.
              </p>
            )}
          </div>
        </div>
      </div>

      {activeId && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4"
          onClick={() => setActiveId(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-lg font-semibold text-emerald-900">
              Booking action
            </h4>
            <p className="mt-1 text-sm opacity-80">
              Check the guest in or cancel the booking with a note.
            </p>
            <div className="mt-4 space-y-3">
              <button
                className="w-full rounded-xl px-4 py-2 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 shadow-sm hover:bg-emerald-100 transition"
                onClick={async () => {
                  await doAction(activeId!, "checkin");
                  setActiveId(null);
                }}
              >
                Mark as Checked-in
              </button>

              <div className="space-y-2">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Cancellation reason (optional)"
                  className="w-full min-h-[110px] rounded-xl bg-white px-3 py-2 shadow-inner ring-1 ring-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  className="w-full rounded-xl px-4 py-2 bg-red-600 text-white shadow hover:bg-red-700 transition"
                  onClick={async () => {
                    await doAction(activeId!, "cancel", comment || undefined);
                    setActiveId(null);
                  }}
                >
                  Cancel booking
                </button>
              </div>

              <button
                className="w-full rounded-xl px-4 py-2 bg-[color:var(--g600)] text-white shadow ring-1 ring-emerald-900/10 hover:bg-emerald-700"
                onClick={() => setActiveId(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
