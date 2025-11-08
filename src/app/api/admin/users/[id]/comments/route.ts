"use server";

import type { SessionData } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions as any);
  if (session?.user?.role !== "ADMIN") {
    return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true as const };
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  const { id } = await params;

  let body: any = {};
  try { body = await req.json(); } catch {}
  const text = String(body?.text || "").trim();
  if (!text) return NextResponse.json({ error: "Text is required" }, { status: 400 });

  const exists = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const comment = await prisma.userComment.create({
    data: { userId: id, text },
    select: { id: true, text: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, comment });
}