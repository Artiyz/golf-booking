"use client";
import React, { useMemo, useState } from "react";

type Customer = { firstName: string; lastName: string; email: string; phone?: string };
type Service  = { name: string; durationMinutes: number; priceCents: number; slug?: string };
type Bay      = { name: string; type?: string; capacity?: number };

const fmtMoney = (cents: number) =>
  (cents / 100).toLocaleString(undefined, { style: "currency", currency: "USD" });

const formatRange = (iso: string, minutes: number) => {
  const start = new Date(iso);
  const end = new Date(start.getTime() + minutes * 60000);
  const o: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  return `${start.toLocaleString(undefined, o)} → ${end.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })}`;
};

const svcSlug = (s: Service) =>
  s.slug ?? s.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

function buildEmailHtml(opts: {
  customer: Customer;
  service: Service;
  bay: Bay;
  slotISO: string;
  bookingId?: string;
}) {
  const { customer, service, bay, slotISO, bookingId } = opts;
  const when = formatRange(slotISO, service.durationMinutes);

  return `
  <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu;line-height:1.6;color:#0f172a">
    <div style="max-width:640px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:16px">
      <h2 style="margin:0 0 12px;font-size:20px">Booking Confirmation</h2>
      ${bookingId ? `<p style="margin:0 0 16px;color:#334155">Reference: <strong>${bookingId}</strong></p>` : ""}
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0" />
      <table style="width:100%;border-collapse:separate;border-spacing:0 8px">
        <tr><td style="width:160px;color:#64748b">Name</td><td><strong>${customer.firstName} ${customer.lastName}</strong></td></tr>
        <tr><td style="color:#64748b">Email</td><td>${customer.email}</td></tr>
        ${customer.phone ? `<tr><td style="color:#64748b">Phone</td><td>${customer.phone}</td></tr>` : ""}
        <tr><td style="color:#64748b">Service</td><td>${service.name} • ${service.durationMinutes} min • ${fmtMoney(service.priceCents)}</td></tr>
        <tr><td style="color:#64748b">Bay</td><td>${bay.name}${bay.type ? " • " + bay.type : ""}${bay.capacity ? " • Cap " + bay.capacity : ""}</td></tr>
        <tr><td style="color:#64748b">When</td><td>${when}</td></tr>
      </table>
      <p style="margin:16px 0 0;color:#334155">We look forward to seeing you on the tee! If you need to make changes, reply to this email.</p>
    </div>
  </div>`;
}

export default function ConfirmationView({
  customer,
  service,
  bay,
  slotISO,
  bookingId,
}: {
  customer: Customer;
  service: Service;
  bay: Bay;
  slotISO: string;
  bookingId?: string;
}) {
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  const whenText = useMemo(
    () => formatRange(slotISO, service.durationMinutes),
    [slotISO, service.durationMinutes]
  );

  const emailHtml = useMemo(
    () => buildEmailHtml({ customer, service, bay, slotISO, bookingId }),
    [customer, service, bay, slotISO, bookingId]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">You’re all set! 🎉</h3>
          {bookingId ? (
            <p className="text-sm opacity-70">
              Reference: <span className="font-mono">{bookingId}</span>
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setShowEmailPreview((v) => !v)}
          className="btn btn-secondary"
        >
          {showEmailPreview ? "Hide email preview" : "Show confirmation email"}
        </button>
      </div>

      {/* Summary grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Service */}
        <div className="card p-0 overflow-hidden">
          <img
            src={`/services/${svcSlug(service)}.jpg`}
            alt={service.name}
            className="w-full h-32 object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/services/default.jpg"; }}
          />
          <div className="p-4">
            <div className="font-semibold">{service.name}</div>
            <div className="text-sm opacity-80">
              {service.durationMinutes} min • {fmtMoney(service.priceCents)}
            </div>
          </div>
        </div>

        {/* Bay */}
        <div className="card p-4">
          <div className="font-semibold mb-1">Bay</div>
          <div className="text-base">{bay.name}</div>
          <div className="text-sm opacity-80">
            {[bay.type, bay.capacity ? `Cap ${bay.capacity}` : ""].filter(Boolean).join(" • ")}
          </div>
        </div>

        {/* When */}
        <div className="card p-4">
          <div className="font-semibold mb-1">When</div>
          <div className="text-sm">{whenText}</div>
        </div>

        {/* Customer */}
        <div className="card p-4">
          <div className="font-semibold mb-1">Customer</div>
          <div className="text-base">
            {customer.firstName} {customer.lastName}
          </div>
          <div className="text-sm opacity-80 break-all">{customer.email}</div>
          {customer.phone ? <div className="text-sm opacity-80">{customer.phone}</div> : null}
        </div>
      </div>

      {/* Email preview (lazy reveal) */}
      {showEmailPreview && (
        <div className="card overflow-hidden p-0">
          <div className="px-4 pt-4 pb-3 border-b">
            <div className="text-sm opacity-70">Preview</div>
            <div className="font-medium">Booking Confirmation</div>
            <div className="text-sm opacity-80">
              To: {customer.email}
              {bookingId ? <> • Ref: <span className="font-mono">{bookingId}</span></> : null}
            </div>
          </div>
          <div
            className="p-4 bg-white"
            dangerouslySetInnerHTML={{ __html: emailHtml }}
          />
        </div>
      )}
    </div>
  );
}
