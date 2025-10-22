"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type User = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  state: "REGULAR" | "BANNED" | "PENDING" | string;
  role: "USER" | "ADMIN" | string;
};

export default function UsersTableClient() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        setLoading(true);
        const r = await fetch("/api/admin/users", { cache: "no-store" });
        if (!r.ok) throw new Error("Failed to load users");
        const j = await r.json();
        if (!aborted) setUsers(Array.isArray(j) ? j : j.users || []);
      } catch (e: any) {
        if (!aborted) setErr(e?.message || "Error loading users");
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter((u) =>
      [u.firstName, u.lastName, u.email, u.phone]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s))
    );
  }, [users, q]);

  return (
    <main className="min-h-[calc(100vh-7rem)] px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[color:var(--g600)]">
            Manage Users
          </h1>
          <Link href="/admin" className="btn">
            Back
          </Link>
        </div>

        <div className="panel">
          <div className="flex items-center justify-between mb-4 gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, email, or phone…"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-sm opacity-60 shrink-0">
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="rounded-xl overflow-hidden ring-1 ring-emerald-900/10 bg-[linear-gradient(180deg,#f7fef9_0%,#ecfbf1_100%)]">
            <table className="w-full text-sm">
              <thead className="bg-white/70">
                <tr className="text-left">
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Phone</th>
                  <th className="px-3 py-2 font-medium">State</th>
                  <th className="px-3 py-2 font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t border-emerald-900/10 bg-white/60 hover:bg-emerald-50"
                  >
                    <td className="px-3 py-2">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="text-emerald-700 hover:underline"
                      >
                        {(u.firstName || "") + " " + (u.lastName || "")}
                      </Link>
                    </td>
                    <td className="px-3 py-2 break-all">{u.email}</td>
                    <td className="px-3 py-2">{u.phone ?? "—"}</td>
                    <td className="px-3 py-2">{u.state}</td>
                    <td className="px-3 py-2">{u.role}</td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-sm opacity-70" colSpan={5}>
                      No users matched your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {loading && <div className="text-sm opacity-70 mt-3">Loading…</div>}
          {err && <div className="text-sm text-red-600 mt-3">{err}</div>}
        </div>
      </div>
    </main>
  );
}
