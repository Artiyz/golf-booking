import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addMinutes } from "date-fns";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, serviceId, bayId, startISO } = body || {};
    if (!fullName || !email || !serviceId || !bayId || !startISO) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    const bay = await prisma.bay.findUnique({ where: { id: bayId } });
    if (!service || !bay) return NextResponse.json({ error: "Invalid service or bay" }, { status: 400 });

    const startTime = new Date(startISO);
    const endTime = addMinutes(startTime, service.durationMinutes);
    const confirmationCode = Math.random().toString(16).slice(2, 12).toUpperCase();

    const { booking } = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.upsert({
        where: { email },
        update: { fullName, phone },
        create: { fullName, email, phone },
      });

      const booking = await tx.booking.create({
        data: {
          customerId: customer.id,
          bayId,
          serviceId,
          partySize: 1,
          startTime,
          endTime,
          status: "CONFIRMED",
          confirmationCode,
        },
        select: { id: true, confirmationCode: true },
      });

      return { booking };
    });

    const html = `
      <h2>Booking Confirmed</h2>
      <p>Hello ${fullName},</p>
      <p>Your booking is confirmed.</p>
      <ul>
        <li>Bay: ${bay.name}</li>
        <li>Service: ${service.name}</li>
        <li>Start: ${startTime.toISOString()}</li>
        <li>End: ${endTime.toISOString()}</li>
        <li>Code: ${confirmationCode}</li>
      </ul>
    `;
    await sendConfirmationEmail(email, "Your Booking Confirmation", html);

    return NextResponse.json({ ok: true, id: booking.id, code: confirmationCode });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("booking_no_overlap") || msg.includes("23P01")) {
      return NextResponse.json({ error: "Time just got booked. Pick another slot." }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
