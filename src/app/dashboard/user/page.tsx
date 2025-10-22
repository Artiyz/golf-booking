// src/app/dashboard/user/page.tsx
import type { SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function UserDashboard() {
  // --- Auth / session ---
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions as any
  );
  const me = session.user as { id: string; email: string } | undefined;
  if (!me?.id) redirect("/dashboard");

  // --- Load user ---
  const user = await prisma.user.findUnique({
    where: { id: me.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      state: true,
    },
  });
  if (!user) redirect("/dashboard");

  // --- Load bookings (read only) ---
  const bookings = await prisma.booking.findMany({
    where: { customer: { email: user.email } },
    include: { bay: true, service: true },
    orderBy: { startTime: "desc" },
    take: 50,
  });

  return (
    <main className="min-h-[calc(100vh-7rem)] px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Profile card */}
        <section className="panel">
          <div className="flex items-start justify-between">
            <h1 className="text-xl sm:text-2xl font-semibold text-[color:var(--g600)]">
              Welcome, {user.firstName ?? ""} {user.lastName ?? ""}
            </h1>
            <LogoutButton />
          </div>

          {/* Read-only details: phone under first name, status in top-right, email */}
          <form className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 items-start">
            {/* First name */}
            <label className="block">
              <span className="block text-xs uppercase tracking-wide opacity-60 mb-1">
                First name
              </span>
              <input
                disabled
                value={user.firstName ?? ""}
                className="input w-full disabled:opacity-80"
              />
            </label>

            {/* Last name */}
            <label className="block">
              <span className="block text-xs uppercase tracking-wide opacity-60 mb-1">
                Last name
              </span>
              <input
                disabled
                value={user.lastName ?? ""}
                className="input w-full disabled:opacity-80"
              />
            </label>

            {/* Status */}
            <div className="block">
              <span className="block text-xs uppercase tracking-wide opacity-60 mb-1 ml-5">
                Status
              </span>
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-[color:var(--g50)] text-[color:var(--g600)] ring-1 ring-emerald-900/10">
                {user.state}
              </div>
            </div>

            {/* Phone */}
            <label className="block lg:col-start-1">
              <span className="block text-xs uppercase tracking-wide opacity-60 mb-1">
                Phone
              </span>
              <input
                disabled
                value={user.phone ?? "—"}
                className="input w-full disabled:opacity-80"
              />
            </label>

            {/* Email */}
            <label className="block lg:col-span-1 max-w-xl">
              <span className="block text-xs uppercase tracking-wide opacity-60 mb-1">
                Email
              </span>
              <input
                disabled
                type="email"
                value={user.email}
                className="input w-full disabled:opacity-80"
              />
            </label>
          </form>
        </section>

        {/* Bookings list  */}
        <section className="panel">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-[color:var(--g600)]">
              Your Bookings
            </h2>
            <span className="text-xs opacity-60">{bookings.length} total</span>
          </div>

          <div className="rounded-xl ring-1 ring-emerald-900/10 bg-white/60 p-2 pt-3">
            <div className="space-y-3 max-h-[60vh] overflow-auto">
              {bookings.length ? (
                bookings.map((b) => {
                  const start = new Date(b.startTime);
                  const end = new Date(b.endTime);
                  const isCanceled = b.status === "CANCELED";
                  const badge =
                    b.status === "CANCELED"
                      ? "canceled"
                      : b.status === "CONFIRMED"
                      ? "confirmed"
                      : "pending";

                  return (
                    <div
                      key={b.id}
                      className="rounded-2xl ring-1 ring-emerald-900/10 bg-[linear-gradient(180deg,#ffffff_0%,#f7faf7_100%)] p-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              isCanceled
                                ? "bg-red-500"
                                : "bg-[color:var(--g600)]"
                            }`}
                          />
                          <div className="font-semibold">
                            {b.bay?.name} • {b.service?.name}
                          </div>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              isCanceled
                                ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                                : "bg-[color:var(--g50)] text-[color:var(--g600)] ring-1 ring-emerald-900/10"
                            }`}
                          >
                            {badge}
                          </span>
                        </div>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 mt-3">
                        <div className="rounded-lg ring-1 ring-slate-200 bg-white p-2">
                          <div className="text-xs opacity-60">When</div>
                          <div className="font-medium">
                            {format(start, "PP p")} — {format(end, "p")}
                          </div>
                        </div>
                        <div className="rounded-lg ring-1 ring-slate-200 bg-white p-2">
                          <div className="text-xs opacity-60">Duration</div>
                          <div className="font-medium">
                            {(b.service as any)?.durationMinutes ?? "—"} min —{" "}
                            {format(start, "p")}
                          </div>
                        </div>
                        <div className="rounded-lg ring-1 ring-slate-200 bg-white p-2">
                          <div className="text-xs opacity-60">Code</div>
                          <div className="font-mono">{b.confirmationCode}</div>
                        </div>
                        <div className="rounded-lg ring-1 ring-slate-200 bg-white p-2">
                          <div className="text-xs opacity-60">Status</div>
                          <div className="font-medium">{b.status}</div>
                        </div>
                      </div>

                      {b.cancelReason && (
                        <div className="mt-2 text-sm">
                          <span className="opacity-60">Cancel reason: </span>
                          <span className="italic">{b.cancelReason}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm opacity-80 px-1">No bookings yet.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
