import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addMinutes } from "date-fns";
import { sendConfirmationEmail } from "@/lib/email";

function code() {
  return Math.random().toString(16).slice(2, 12).toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, serviceId, bayId, slotISO } = body;

    if (!fullName || !email || !phone || !serviceId || !bayId || !slotISO) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) return NextResponse.json({ error: "Invalid service" }, { status: 400 });

    const bay = await prisma.bay.findUnique({ where: { id: bayId } });
    if (!bay) return NextResponse.json({ error: "Invalid bay" }, { status: 400 });

    const startTime = new Date(slotISO);
    const endTime = addMinutes(startTime, service.durationMinutes);
    const confirmationCode = code();

    const result = await prisma.$transaction(async (tx) => {
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
      });

      return { booking, customer };
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

    return NextResponse.json({ ok: true, id: result.booking.id, code: confirmationCode });
  } catch (e: any) {
    const msg = String(e?.message || e);
    if (msg.includes("booking_no_overlap")) {
      return NextResponse.json({ error: "That time was just booked. Pick another slot." }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
