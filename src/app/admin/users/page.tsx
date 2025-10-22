import type { SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import UsersTableClient from "./_UsersTableClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions as any);
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin");
  }
  return <UsersTableClient />;
}
