"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@cv.local");
  const [password, setPassword] = useState("Admin123!");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // If already logged-in as admin, go to the admin dashboard
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/auth/me", {
          cache: "no-store",
          credentials: "include",
        });
        const j = await r.json().catch(() => ({}));
        if (String(j?.user?.role || "").toUpperCase() === "ADMIN")
          router.replace("/admin");
      } catch {}
    })();
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setErr(j?.error || "Invalid email or password");
        return;
      }
      const me = await fetch("/api/auth/me", {
        cache: "no-store",
        credentials: "include",
      })
        .then((x) => x.json())
        .catch(() => ({}));
      if (String(me?.user?.role || "").toUpperCase() !== "ADMIN") {
        setErr("That account is not an admin.");
        return;
      }
      router.replace("/admin");
    } catch {
      setErr("Could not log in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-7rem)] flex items-start justify-center pt-10 sm:pt-16">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl ring-1 ring-black/5 p-8">
        <h1 className="text-2xl font-semibold text-emerald-900">Admin Login</h1>
        <p className="mt-2 text-[15.5px] leading-8 text-slate-700">
          Log in to access the admin dashboard.
        </p>
        <form className="mt-6 grid gap-4" onSubmit={onSubmit} noValidate>
          <label className="flex flex-col text-sm">
            <span className="text-slate-700 mb-1">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="admin@cv.local"
              autoComplete="email"
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="text-slate-700 mb-1">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </label>
          {err && <div className="text-sm text-red-600">{err}</div>}
          <div>
            <button type="submit" className="btn" disabled={busy}>
              {busy ? "Logging in…" : "Login"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
