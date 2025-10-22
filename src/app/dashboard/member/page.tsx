"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MemberLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // If already logged in, bounce to the profile
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/auth/me", { cache: "no-store" });
        const j = await r.json().catch(() => ({}));
        if (j?.user?.id) {
          router.replace("/dashboard/user");
        }
      } catch {}
    })();
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!email || !password) {
      setErr("Enter your email and password.");
      return;
    }
    setBusy(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // same-origin is default, but set explicitly; cookie will be set by the response
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setErr(j?.error || "Invalid email or password");
        return;
      }
      // Navigate to the user dashboard; server will read the cookie we just set.
      router.replace("/dashboard/user");
    } catch {
      setErr("Could not log in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-7rem)] flex items-start justify-center bg-[color:var(--g50)] pt-10 sm:pt-16">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl ring-1 ring-black/5 p-8">
        <div className="mx-auto">
          <h1 className="text-3xl font-bold text-emerald-900">Welcome back!</h1>
          <p className="mt-2 text-[15.5px] leading-8 text-slate-700">Enter your credentials to access your account</p>

          <form className="mt-8 grid grid-cols-1 gap-4" onSubmit={onSubmit} noValidate>
            <label className="flex flex-col text-sm">
              <span className="text-slate-700 mb-1">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoComplete="email"
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="text-slate-700 mb-1">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoComplete="current-password"
              />
            </label>

            {err && <div className="text-sm text-red-600">{err}</div>}

            <div className="mt-2">
              <button type="submit" className="btn" disabled={busy}>
                {busy ? "Logging in…" : "Login"}
              </button>
            </div>

            <div className="mt-4 text-sm text-center text-slate-700">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-emerald-700 hover:underline">
                Sign Up
              </Link>{" "}
              or{" "}
              <Link href="/booking" className="text-emerald-700 hover:underline">
                View As A Guest
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
