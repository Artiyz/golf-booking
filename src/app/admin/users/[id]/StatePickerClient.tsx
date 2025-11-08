"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  userId: string;
  initialState: "REGULAR" | "PREMIUM" | "NO_SHOW" | "BLACKLISTED";
};

// Blacklisted moved to the end
const STATE_OPTIONS = [
  { value: "REGULAR", label: "Regular (default)", dot: "bg-emerald-600" },
  { value: "PREMIUM", label: "Premium", dot: "bg-indigo-600" },
  { value: "NO_SHOW", label: "No-show", dot: "bg-orange-500" },
  { value: "BLACKLISTED", label: "Blacklisted", dot: "bg-red-600" },
] as const;

export default function StatePickerClient({ userId, initialState }: Props) {
  const [state, setState] = useState<Props["initialState"]>(initialState);
  const [originalState, setOriginalState] =
    useState<Props["initialState"]>(initialState);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // inline errors
  const [err, setErr] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [codeErr, setCodeErr] = useState<string | null>(null);

  const router = useRouter();
  const popRef = useRef<HTMLDivElement>(null);

  const current = useMemo(
    () => STATE_OPTIONS.find((o) => o.value === state) ?? STATE_OPTIONS[0],
    [state]
  );

  // Require admin code if moving into/out of BLACKLISTED
  const requireCode =
    (originalState !== "BLACKLISTED" && state === "BLACKLISTED") ||
    (originalState === "BLACKLISTED" && state !== "BLACKLISTED");

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
    setCodeErr(null);

    if (requireCode && !code.trim()) {
      setCodeErr("Verification code required");
      return;
    }

    setBusy(true);
    try {
      const body: Record<string, unknown> = { state };
      if (requireCode) body.code = code.trim();

      const r = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body),
      });

      const j = await r.json().catch(() => ({} as any));

      if (!r.ok) {
        if (j?.error === "verification_code_required") {
          setCodeErr("Verification code required");
        } else if (j?.error === "invalid_verification_code") {
          setCodeErr("Invalid verification code");
        } else if (j?.error === "Admin delete code is not configured") {
          setCodeErr("Server not configured with admin code");
        } else {
          setErr(j?.error || "Failed to update state");
        }
        return;
      }

      // Success
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("statepicker:saved", {
            detail: {
              message: `User state updated to ${state
                .replace("_", " ")
                .toLowerCase()}.`,
            },
          })
        );
      }
      setOpen(false);
      setOriginalState(state);
      setCode("");
      router.refresh();
    } catch (e: any) {
      const message = e?.message || "Failed to update";
      setErr(message);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("statepicker:error", { detail: { message } })
        );
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    // keep items on one line; code is narrow; allow wrap on tiny screens
    <div className="flex w-full items-center gap-3 flex-wrap">
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
            aria-hidden="true"
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
                          aria-hidden="true"
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

      <button
        type="button"
        onClick={save}
        disabled={busy}
        className="btn"
        aria-label="Save state"
      >
        {busy ? "Saving…" : "Save"}
      </button>

      {requireCode && (
        <div className="flex flex-col whitespace-nowrap">
          <div className="flex items-center gap-2">
            <label htmlFor="admin-code" className="text-xs text-slate-600">
              Code
            </label>
            <input
              id="admin-code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (codeErr) setCodeErr(null);
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              className="input h-9 w-20"
              placeholder="1234"
              aria-label="Verification code"
            />
          </div>
          {codeErr && (
            <span
              className="mt-1.5 text-xs px-2 py-1 rounded-md border border-red-200 bg-red-50 text-red-700"
              role="alert"
            >
              {codeErr}
            </span>
          )}
        </div>
      )}

      {err && <span className="text-sm text-red-600">{err}</span>}
    </div>
  );
}
