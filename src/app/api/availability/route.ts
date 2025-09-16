import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addMinutes } from "date-fns";

const TZ = "America/Toronto";
const OPEN_H = 9;
const CLOSE_H = 17;

function tzOffsetHours(dateISO: string, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    timeZoneName: "shortOffset",
  }).formatToParts(new Date(dateISO));
  const tzName = parts.find((p) => p.type === "timeZoneName")?.value || "GMT+0";
  const m = tzName.match(/GMT([+-]\d{1,2})(?::\d{2})?/);
  return m ? parseInt(m[1], 10) : 0;
}

function todayInTzISO(tz: string, d = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const da = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${da}`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId")!;
    const bayId = searchParams.get("bayId")!;
    const date = searchParams.get("date")!;

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) return NextResponse.json({ slots: [] });

    const offsetHours = tzOffsetHours(`${date}T12:00:00.000Z`, TZ);
    const openUtc  = new Date(`${date}T${String(OPEN_H - offsetHours).padStart(2,"0")}:00:00.000Z`);
    const closeUtc = new Date(`${date}T${String(CLOSE_H - offsetHours).padStart(2,"0")}:00:00.000Z`);

    const bookings = await prisma.booking.findMany({
      where: {
        bayId,
        status: "CONFIRMED",
        startTime: { lt: closeUtc },
        endTime:   { gt: openUtc  },
      },
      select: { startTime: true, endTime: true },
      orderBy: { startTime: "asc" },
    });

    const step = service.durationMinutes;
    const now = new Date();
    const sameDay = todayInTzISO(TZ) === date;

    const slots: { iso: string; available: boolean }[] = [];
    for (
      let startUtc = new Date(openUtc);
      addMinutes(startUtc, service.durationMinutes) <= closeUtc;
      startUtc = addMinutes(startUtc, step)
    ) {
      const endUtc = addMinutes(startUtc, service.durationMinutes);
      const inPast = sameDay && startUtc <= now;
      const blocked = bookings.some(b => startUtc < b.endTime && endUtc > b.startTime);
      slots.push({ iso: startUtc.toISOString(), available: !(inPast || blocked) });
    }

    return NextResponse.json({ slots });
  } catch (e: any) {
    return NextResponse.json({ slots: [], error: String(e?.message || e) }, { status: 500 });
  }
}
