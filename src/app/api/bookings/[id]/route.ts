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
  } catch (_e: unknown) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
