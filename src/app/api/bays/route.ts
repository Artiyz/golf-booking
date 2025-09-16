import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const bays = await prisma.bay.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(bays);
}
