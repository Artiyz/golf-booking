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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; commentId: string }> }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  const { commentId } = await params;

  const expected = (process.env.ADMIN_DELETE_CODE || "").trim();
  if (!expected) {
    return NextResponse.json({ error: "Admin delete code is not configured" }, { status: 500 });
  }

  let body: any = {};
  try { body = await req.json(); } catch {}
  const code = String(body?.code ?? "").trim();

  if (!code) return NextResponse.json({ error: "verification_code_required" }, { status: 400 });
  if (code !== expected) return NextResponse.json({ error: "invalid_verification_code" }, { status: 403 });

  try {
    await prisma.userComment.delete({ where: { id: commentId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}