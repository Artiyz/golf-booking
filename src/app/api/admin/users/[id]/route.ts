"use server";

import type { SessionData } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const ALLOWED = new Set(["REGULAR", "PREMIUM", "BLACKLISTED", "NO_SHOW"]);

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions as any);
  if (session?.user?.role !== "ADMIN") {
    return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true as const };
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  const { id } = await ctx.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, firstName: true, lastName: true, email: true, phone: true, state: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Use LOWER-CASE relation names that your current Prisma Client exposes
  const rows = await prisma.booking.findMany({
    where: { customer: { email: user.email || "" } },
    include: {
      bay: true,
      service: true,
    },
    orderBy: { startTime: "desc" },
    take: 100,
  });

  // Keep the response shape the same as before
  const bookings = rows.map((b) => ({
    id: b.id,
    startTime: b.startTime,
    endTime: b.endTime,
    status: b.status,
    confirmationCode: b.confirmationCode,
    cancelReason: (b as any).cancelReason ?? null,
    checkedIn: (b as any).checkedIn ?? false,
    bay: b.bay ? { name: b.bay.name } : null,
    service: b.service
      ? { name: b.service.name, durationMinutes: (b.service as any).durationMinutes }
      : null,
  }));

  return NextResponse.json({ user, bookings });
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  const { id } = await ctx.params;

  let payload: any = {};
  try {
    payload = await req.json();
  } catch {}
  const raw = String(payload?.state ?? "REGULAR").trim();
  const state = raw.toUpperCase().replace(/\s+/g, "_"); // "No show" -> "NO_SHOW"

  if (!ALLOWED.has(state)) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  await prisma.user.update({ where: { id }, data: { state: state as any } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  const { id } = await ctx.params;

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Cannot delete this user (has related records)" }, { status: 409 });
  }
}