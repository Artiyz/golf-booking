import type { SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import AdminLogin from "./_AdminLogin";
import AdminDashboardClient from "./_AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions as any);

  let role = session?.user?.role as string | undefined;

  // if role missing but we have an id, load once from DB
  if (!role && session?.user?.id) {
    const u = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { role: true },
    });
    role = u?.role;
    if (u?.role && session?.user) {
      session.user.role = u.role;
      await session.save();
    }
  }

  if (role !== "ADMIN") {
    return <AdminLogin />;
  }

  return (
    <main className="min-h-[calc(100vh-7rem)] px-4 py-4 sm:py-2">
      <div className="mx-auto max-w-6xl">
        <AdminDashboardClient />
      </div>
    </main>
  );
}
