"use client";
import { useCallback, useEffect, useState } from "react";

export type Me = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  role?: string | null;
};

export function useMe() {
  const [me, setMe] = useState<Me | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const refetchMe = useCallback(async () => {
    setAuthLoading(true);
    try {
      const r = await fetch("/api/auth/me", {
        cache: "no-store",
        credentials: "include",
      });
      const j = await r.json().catch(() => ({}));
      setMe(j?.user ?? null);
    } catch {
      setMe(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchMe();
  }, [refetchMe]);

  // Listen for auth state changes fired by login/logout
  useEffect(() => {
    const onChanged = () => refetchMe();
    window.addEventListener("auth:changed", onChanged);
    return () => window.removeEventListener("auth:changed", onChanged);
  }, [refetchMe]);

  return { me, authLoading, isAuthed: !!me?.email, refetchMe };
}

export function signalAuthChanged() {
  try {
    window.dispatchEvent(new Event("auth:changed"));
  } catch {}
}
