import type { SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import StatePickerClient from "./StatePickerClient";

async function getUserAndBookings(id: string, cookieHeader: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const r = await fetch(`${base}/api/admin/users/${id}`, {
    cache: "no-store",
    headers: { cookie: cookieHeader }
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error("Failed to load user");
  return r.json();
}

export const dynamic = "force-dynamic";

export default async function AdminUserProfile(props: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions as any);
  if (session?.user?.role !== "ADMIN") redirect("/admin");

  const { id } = await props.params;
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");

  const data = await getUserAndBookings(id, cookieHeader);
  if (!data) notFound();

  const { user, bookings } = data;

  return (
    <main className="min-h-[calc(100vh-7rem)] px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="panel">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-[color:var(--g600)]">
              {(user.firstName || "—") + " " + (user.lastName || "")}
              <span className="opacity-60 text-lg"> • {user.email || "—"}</span>
            </h1>
            <a href="/admin/users" className="btn">Back</a>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg ring-1 ring-slate-200 bg-white p-3">
              <div className="text-xs opacity-60">First name</div>
              <div className="font-medium">{user.firstName ?? "—"}</div>
            </div>
            <div className="rounded-lg ring-1 ring-slate-200 bg-white p-3">
              <div className="text-xs opacity-60">Last name</div>
              <div className="font-medium">{user.lastName ?? "—"}</div>
            </div>
            <div className="rounded-lg ring-1 ring-slate-200 bg-white p-3">
              <div className="text-xs opacity-60">Email</div>
              <div className="font-medium break-all">{user.email ?? "—"}</div>
            </div>
            <div className="rounded-lg ring-1 ring-slate-200 bg-white p-3">
              <div className="text-xs opacity-60">Phone</div>
              <div className="font-medium">{user.phone ?? "—"}</div>
            </div>
            <div className="rounded-lg ring-1 ring-slate-200 bg-white p-3 sm:col-span-2">
              <div className="text-xs opacity-60 mb-1">State</div>
              <StatePickerClient userId={user.id} initialState={user.state} />
            </div>
          </div>
        </div>

        <div className="panel">
          <h3 className="font-medium text-[color:var(--g600)] mb-3">Bookings (latest 100)</h3>
          <div className="space-y-3">
            {bookings.map((b: any) => {
              const start = new Date(b.startTime);
              const end = new Date(b.endTime);
              const ok = b.status === "CONFIRMED";
              return (
                <div key={b.id} className="card bg-[linear-gradient(180deg,#ffffff_0%,#f7faf7_100%)]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${ok ? "bg-[color:var(--g600)]" : "bg-red-500"}`} />
                      <div className="font-semibold">{b.bay?.name} • {b.service?.name}</div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shadow ${ok ? "bg-[color:var(--g50)] text-[color:var(--g600)]" : "bg-red-50 text-red-700"}`}>{b.status.toLowerCase()}</span>
                    </div>
                    <div className="text-sm opacity-80">{start.toLocaleString()} – {end.toLocaleTimeString()}</div>
                  </div>
                </div>
              );
            })}
            {bookings.length === 0 && (
              <p className="text-sm opacity-80">This user has no bookings.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
