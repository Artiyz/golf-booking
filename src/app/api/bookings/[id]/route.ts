import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const booking = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELED" },
      select: { id: true, status: true },
    });
    return NextResponse.json({ ok: true, booking });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 400 });
  }
}
