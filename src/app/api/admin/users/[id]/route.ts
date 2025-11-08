"use server";

import type { SessionData } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { UserState } from "@prisma/client";

function isUserState(v: string): v is UserState {
  return ["REGULAR", "PREMIUM", "BLACKLISTED", "NO_SHOW"].includes(v);
}

async function requireAdmin() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions as any
  );
  if (session?.user?.role !== "ADMIN") {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true as const };
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  const { id } = await ctx.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      state: true,
    },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const comments = await prisma.userComment.findMany({
    where: { userId: id },
    select: { id: true, text: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = await prisma.booking.findMany({
    where: { customer: { email: user.email || "" } },
    include: { bay: true, service: true },
    orderBy: { startTime: "desc" },
    take: 100,
  });

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
      ? {
          name: b.service.name,
          durationMinutes: (b.service as any).durationMinutes,
        }
      : null,
  }));

  return NextResponse.json({ user, bookings, comments });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  const { id } = await params;
  const body = await req.json().catch(() => ({} as any));

  const nextStateRaw: string | undefined = body?.state;
  const codeFromClient: string = String(body?.code ?? "").trim();

  if (!nextStateRaw) {
    return NextResponse.json({ error: "state is required" }, { status: 400 });
  }

  const NEXT = nextStateRaw.toUpperCase();
  if (!isUserState(NEXT)) {
    return NextResponse.json({ error: "invalid_state" }, { status: 400 });
  }

  // Check current state to decide if code is required
  const user = await prisma.user.findUnique({
    where: { id },
    select: { state: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const CURRENT = (user.state || "REGULAR") as UserState;
  const involvesBlacklist =
    (CURRENT !== "BLACKLISTED" && NEXT === "BLACKLISTED") ||
    (CURRENT === "BLACKLISTED" && NEXT !== "BLACKLISTED");

  if (involvesBlacklist) {
    // Same env var as comment deletion
    const expected = (process.env.ADMIN_DELETE_CODE || "").trim();
    if (!expected) {
      return NextResponse.json(
        { error: "Admin delete code is not configured" },
        { status: 500 }
      );
    }
    if (!codeFromClient) {
      return NextResponse.json(
        { error: "verification_code_required" },
        { status: 400 }
      );
    }
    if (codeFromClient !== expected) {
      return NextResponse.json(
        { error: "invalid_verification_code" },
        { status: 403 }
      );
    }
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { state: NEXT as UserState },
    select: { id: true, state: true },
  });

  return NextResponse.json({ ok: true, user: updated }, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  // Use the SAME env var as comments + PUT
  const expected = (process.env.ADMIN_DELETE_CODE || "").trim();
  if (!expected) {
    return NextResponse.json(
      { error: "Admin delete code is not configured" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    // ignore
  }
  const code = String((body as any)?.code ?? "").trim();

  if (!code) {
    return NextResponse.json(
      { error: "verification_code_required" },
      { status: 400 }
    );
  }
  if (code !== expected) {
    return NextResponse.json(
      { error: "invalid_verification_code" },
      { status: 403 }
    );
  }

  const { id } = await ctx.params;

  try {
    await prisma.userComment.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Cannot delete this user (has related records)" },
      { status: 409 }
    );
  }
}