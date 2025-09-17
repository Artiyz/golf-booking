import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST() {
  const s = await prisma.service.upsert({
    where: { slug: "golf-2-5-hours" },
    update: { name: "Golf 2.5 Hours", durationMinutes: 150, priceCents: 9500 },
    create: {
      name: "Golf 2.5 Hours",
      slug: "golf-2-5-hours",
      durationMinutes: 150,
      priceCents: 9500,
    },
    select: { id: true, name: true, durationMinutes: true, priceCents: true, slug: true },
  });
  return NextResponse.json(s);
}
