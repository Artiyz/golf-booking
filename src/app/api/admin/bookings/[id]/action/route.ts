import type { SessionData } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions as any);
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  if (!id) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  const { action, comment } = await req.json().catch(() => ({}));

  if (action === "checkin") {
    await prisma.booking.update({ where: { id }, data: { checkedIn: true } });
    return NextResponse.json({ ok: true });
  }

  if (action === "cancel") {
    await prisma.booking.update({ where: { id }, data: { status: "CANCELED", cancelReason: comment ?? null } });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
