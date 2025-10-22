import type { SessionData } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions as any);
  if (session.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await prisma.user.findMany({
    orderBy: { lastName: "asc" },
    select: { id: true, firstName: true, lastName: true, email: true, phone: true, state: true, role: true },
  });
  return NextResponse.json(users);
}
