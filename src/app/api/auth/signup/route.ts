import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const phoneRegex = /^[0-9+().\-\s]{7,20}$/;

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(phoneRegex, "Enter a valid phone"),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { firstName, lastName, email, phone, password } = parsed.data;
    const normEmail = email.trim().toLowerCase();
    const normPhone = phone.trim();

    // Ensure uniqueness for email (case-insensitive) and phone (exact)
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: normEmail, mode: "insensitive" } },
          { phone: normPhone },
        ],
      },
      select: { email: true, phone: true },
    });
    if (existing) {
      if (existing.email?.toLowerCase() === normEmail) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
      if (existing.phone === normPhone) {
        return NextResponse.json({ error: "Phone already in use" }, { status: 409 });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: normEmail,
        phone: normPhone,
        passwordHash,
        state: "REGULAR",
        role: "USER",
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
