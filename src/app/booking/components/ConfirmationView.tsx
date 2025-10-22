"use client";

import { useMemo, useState } from "react";
import { format, parseISO, addMinutes } from "date-fns";

type Customer = {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
};
type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  priceCents: number;
};
type Bay = {
  id: string;
  name: string;
  type: "PRIME" | "STANDARD";
  capacity?: number;
};

type Props = {
  customer: Customer;
  service: Service;
  bay: Bay;
  startISO: string;
  bookingId?: string;
  onConfirm: () => Promise<void> | void;
  onChangeTime: () => void;
};

function renderEmailHTML(args: {
  greeting: string;
  serviceName: string;
  priceText: string;
  durationText: string;
  bayName: string;
  bayMeta: string;
  whenText: string;
  customerLine: string;
  bookingId?: string;
}): string {
  const refLine = args.bookingId
    ? '<tr><td style="padding:2px 24px 0 24px;font-size:12px;color:#6b7280">Reference: <span style="font-family:ui-monospace,Menlo,Consolas,monospace">' +
      args.bookingId +
      "</span></td></tr>"
    : "";
  return `<!doctype html>
<html>
<head>
  <meta charSet="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body style="margin:0;background:#f6f7f9;padding:24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111827">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,.06)">
          <tr><td style="padding:24px 24px 0 24px;font-size:14px;color:#111827">${args.greeting}</td></tr>
          <tr><td style="padding:8px 24px 0 24px;font-size:20px;font-weight:700">Your booking is confirmed</td></tr>
          ${refLine}
          <tr><td style="padding:16px 24px 0 24px;height:1px;border-bottom:1px solid #e5e7eb"></td></tr>
          <tr>
            <td style="padding:16px 24px 0 24px;font-size:14px;line-height:1.6">
              <p style="margin:0 0 8px 0"><strong>Service:</strong> ${args.serviceName} — ${args.durationText}, ${args.priceText}</p>
              <p style="margin:0 0 8px 0"><strong>Bay:</strong> ${args.bayName} — ${args.bayMeta}</p>
              <p style="margin:0 0 8px 0"><strong>When:</strong> ${args.whenText}</p>
              <p style="margin:0 0 8px 0"><strong>Customer:</strong> ${args.customerLine}</p>
              <p style="margin:12px 0 0 0">We look forward to seeing you. If you need to change or cancel, simply reply to this email.</p>
              <p style="margin:8px 0 0 0;color:#6b7280">— Golf Bays</p>
            </td>
          </tr>
          <tr><td style="height:24px"></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function ConfirmationView({
  customer,
  service,
  bay,
  startISO,
  bookingId,
  onConfirm,
  onChangeTime,
}: Props) {
  const [showEmail, setShowEmail] = useState(false);
  const [sending, setSending] = useState(false);

  const start = useMemo(() => parseISO(startISO), [startISO]);
  const end = useMemo(
    () => addMinutes(start, service.durationMinutes),
    [start, service.durationMinutes]
  );

  const whenText = useMemo(
    () =>
      `${format(start, "EEE, MMM d")} • ${format(start, "h:mm a")} – ${format(
        end,
        "h:mm a"
      )}`,
    [start, end]
  );

  const durationText = `${service.durationMinutes} min`;
  const priceText = `$${(service.priceCents / 100).toFixed(2)}`;
  const bayType = bay.type === "PRIME" ? "Prime" : "Standard";
  const bayMeta = [bayType, bay.capacity ? `Cap ${bay.capacity}` : ""]
    .filter(Boolean)
    .join(" • ");
  const greeting = `Dear ${
    customer.firstName ? customer.firstName : customer.email
  },`;
  const nameOnly = [customer.firstName || "", customer.lastName || ""]
    .join(" ")
    .trim();
  const customerLine = nameOnly || customer.email;
  const customerLineFull = [
    customerLine,
    customer.email !== customerLine ? customer.email : "",
    customer.phone || "",
  ]
    .filter(Boolean)
    .join(" • ");

  const emailHtml = useMemo(
    () =>
      renderEmailHTML({
        greeting,
        serviceName: service.name,
        priceText,
        durationText,
        bayName: bay.name,
        bayMeta,
        whenText,
        customerLine: customerLineFull,
        bookingId,
      }),
    [
      greeting,
      service.name,
      priceText,
      durationText,
      bay.name,
      bayMeta,
      whenText,
      customerLineFull,
      bookingId,
    ]
  );

  async function handleConfirm() {
    setSending(true);
    try {
      await onConfirm();
    } finally {
      setSending(false);
    }
  }

  const tileCls =
    "card selectable is-selected h-[140px] min-h-[140px] flex flex-col justify-center gap-1";

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className={tileCls}>
            <div className="text-sm opacity-70">Service</div>
            <div className="font-semibold text-lg">{service.name}</div>
            <div className="text-sm opacity-80">
              {durationText} • {priceText}
            </div>
          </div>
          <div className={tileCls}>
            <div className="text-sm opacity-70">Bay</div>
            <div className="font-semibold text-lg">{bay.name}</div>
            <div className="text-sm opacity-80">{bayMeta}</div>
          </div>
        </div>
        <div className="space-y-6">
          <div className={tileCls}>
            <div className="text-sm opacity-70">When</div>
            <div className="font-semibold text-lg">{whenText}</div>
          </div>
          <div className={tileCls}>
            <div className="text-sm opacity-70">Customer</div>
            <div className="font-semibold text-lg">{customerLine}</div>
            <div className="text-sm opacity-80 break-all">
              {customer.email}
              {customer.phone ? ` • ${customer.phone}` : ""}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="btn" onClick={handleConfirm} disabled={sending}>
          {sending ? "Sending…" : "Confirm & Send Email"}
        </button>
        <button className="btn btn-ghost" onClick={onChangeTime}>
          Change time
        </button>
        <button
          className="btn-secondary btn-ghost"
          onClick={() => setShowEmail((v) => !v)}
        >
          {showEmail ? "Hide confirmation email" : "Show confirmation email"}
        </button>
      </div>

      {showEmail && (
        <div className="card overflow-hidden p-0">
          <div className="px-4 pt-4 pb-3 border-b">
            <div className="text-sm opacity-70">Preview</div>
            <div className="font-medium">Booking Confirmation</div>
            <div className="text-sm opacity-80">
              To: {customer.email}
              {bookingId ? (
                <>
                  {" "}
                  • Ref: <span className="font-mono">{bookingId}</span>
                </>
              ) : null}
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
