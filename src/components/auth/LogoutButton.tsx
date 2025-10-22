"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function doLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    router.replace("/dashboard");
    router.refresh();
  }
  return (
    <button onClick={doLogout} className="btn" type="button">
      Log out
    </button>
  );
}
