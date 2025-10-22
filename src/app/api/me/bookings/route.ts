import type { SessionData } from "@/lib/session";
import { sessionOptions } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const res = new NextResponse();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  const user = session.user;
  if (!user) {
    return NextResponse.json({ bookings: [] }, { headers: res.headers });
  }

  const bookings = await prisma.booking.findMany({
    where: { customer: { email: user.email } },
    include: {
      customer: { select: { fullName: true, email: true } },
      bay: { select: { name: true } },
      service: { select: { name: true, durationMinutes: true } },
    },
    orderBy: { startTime: "desc" },
    take: 100,
  });

  return NextResponse.json({ bookings }, { headers: res.headers });
}