import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addMinutes, isBefore } from "date-fns";

const TZ = "America/Toronto";
const OPEN_H = 9;
const CLOSE_H = 19;

function torontoOffset(date: string) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    timeZoneName: "shortOffset",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(new Date(date + "T12:00:00Z"));
  const tzn = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT-04:00";
  const m = tzn.match(/GMT([+-]\d{1,2})(?::?(\d{2}))?/);
  const sign = m && m[1].startsWith("-") ? "-" : "+";
  const hh = m ? String(Math.abs(parseInt(m[1], 10))).padStart(2, "0") : "04";
  const mm = m && m[2] ? m[2] : "00";
  return `${sign}${hh}:${mm}`;
}

function torontoLabel(d: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId")!;
    const bayId = searchParams.get("bayId")!;
    const date = searchParams.get("date")!;

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) return NextResponse.json({ slots: [] });

    const off = torontoOffset(date);
    const openUtc = new Date(`${date}T${String(OPEN_H).padStart(2, "0")}:00:00${off}`);
    const closeUtc = new Date(`${date}T${String(CLOSE_H).padStart(2, "0")}:00:00${off}`);

    const bookings = await prisma.booking.findMany({
      where: {
        bayId,
        status: "CONFIRMED",
        startTime: { lt: closeUtc },
        endTime: { gt: openUtc },
      },
      select: { startTime: true, endTime: true },
      orderBy: { startTime: "asc" },
    });

    const step = service.durationMinutes;
    const now = new Date();
    const slots: { iso: string; label: string; available: boolean }[] = [];

    for (
      let startUtc = new Date(openUtc);
      addMinutes(startUtc, service.durationMinutes) <= closeUtc;
      startUtc = addMinutes(startUtc, step)
    ) {
      const endUtc = addMinutes(startUtc, service.durationMinutes);
      const blocked = bookings.some((b) => startUtc < b.endTime && endUtc > b.startTime);
      const inPast = isBefore(startUtc, now);
      slots.push({ iso: startUtc.toISOString(), label: torontoLabel(startUtc), available: !(blocked || inPast) });
    }

    return NextResponse.json({ slots, tz: TZ });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ slots: [], error: msg }, { status: 500 });
  }
}
