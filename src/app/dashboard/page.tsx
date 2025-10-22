import type { SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { redirect } from "next/navigation";
import DefaultDashboardClient from "./_DefaultDashboardClient";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions as any);
  const u = session.user as
    | { id: string; email: string; role?: string }
    | undefined;

  if (u?.role === "ADMIN") {
    redirect("/admin");
  }
  if (u?.id) {
    redirect("/dashboard/user");
  }

  // Not logged in -> render the existing public dashboard UI verbatim.
  return <DefaultDashboardClient />;
}
