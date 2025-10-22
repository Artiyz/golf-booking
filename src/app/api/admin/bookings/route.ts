import type { SessionData } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addDays } from "date-fns";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export async function GET(req: NextRequest) {
  // authz: admin only
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions as any);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || new Date().toISOString().slice(0,10);
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = addDays(start, 1);

  const bookings = await prisma.booking.findMany({
    where: { startTime: { gte: start, lt: end } },
    include: {
      customer: { select: { fullName: true, email: true } },
      bay: { select: { name: true } },
      service: { select: { name: true, durationMinutes: true } },
    },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json({ bookings });
}
