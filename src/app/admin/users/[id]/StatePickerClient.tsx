"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  userId: string;
  initialState: "REGULAR" | "PREMIUM" | "BLACKLISTED" | "NO_SHOW";
};

const STATE_OPTIONS = [
  { value: "REGULAR", label: "Regular (default)", dot: "bg-emerald-600" },
  { value: "PREMIUM", label: "Premium", dot: "bg-indigo-600" },
  { value: "BLACKLISTED", label: "Blacklisted", dot: "bg-red-600" },
  { value: "NO_SHOW", label: "No-show", dot: "bg-orange-500" },
] as const;

export default function StatePickerClient({ userId, initialState }: Props) {
  const [state, setState] = useState<Props["initialState"]>(initialState);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  const popRef = useRef<HTMLDivElement>(null);

  const current = useMemo(
    () => STATE_OPTIONS.find((o) => o.value === state) ?? STATE_OPTIONS[0],
    [state]
  );

  // close dropdown on outside click / Esc
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!popRef.current) return;
      if (!popRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  async function save() {
    setErr(null);
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ state }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to update state");
      }
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Failed to update");
    } finally {
      setBusy(false);
    }
  }

  async function removeUser() {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    setErr(null);
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to delete user");
      }
      router.replace("/admin/users");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Failed to delete");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex w-full flex-wrap items-center gap-3">
      {/* Modern dropdown */}
      <div ref={popRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex min-w-[230px] items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <span className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${current.dot}`} />
            <span className="font-medium">{current.label}</span>
          </span>
          <svg
            className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M5.25 7.5l4.5 4.5 4.5-4.5" />
          </svg>
        </button>

        {open && (
          <div className="absolute z-30 mt-2 w-[260px] rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
            <ul role="listbox" className="max-h-60 overflow-auto">
              {STATE_OPTIONS.map((opt) => {
                const active = opt.value === state;
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        setState(opt.value as Props["initialState"]);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-emerald-50 ${
                        active ? "bg-emerald-50" : ""
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${opt.dot}`}
                        />
                        <span className="font-medium">{opt.label}</span>
                      </span>
                      {active && (
                        <svg
                          className="h-4 w-4 text-emerald-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4A1 1 0 014.707 9.293L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* push actions to the right */}
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="btn"
          onClick={save}
          disabled={busy}
          title="Save user state"
        >
          {busy ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={removeUser}
          disabled={busy}
          title="Delete this user"
        >
          Delete user
        </button>
      </div>

      {err && <span className="text-sm text-red-600">{err}</span>}
    </div>
  );
}
