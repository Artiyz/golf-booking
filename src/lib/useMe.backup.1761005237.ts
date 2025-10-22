"use client";

import { useQuery } from "@tanstack/react-query";

export type Me = {
  id?: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
};

export function useMe() {
  const q = useQuery({
    queryKey: ["me"],
    queryFn: async (): Promise<Me | null> => {
      const r = await fetch("/api/auth/me", { cache: "no-store" });
      if (!r.ok) return null;
      const j = await r.json().catch(() => null);
      return (j?.user ?? j) as Me | null;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  return {
    me: q.data ?? null,
    authLoading: q.isLoading,
    isAuthed: !!q.data?.email,
  };
}
