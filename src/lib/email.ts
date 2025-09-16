import nodemailer from "nodemailer";
export async function sendConfirmationEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({ jsonTransport: true });
  const info = await transporter.sendMail({
    from: `"${process.env.SITE_NAME || "Golf Center"}" <no-reply@example.com>`,
    to, subject, html
  });
  console.log("EMAIL_SIMULATED:", JSON.stringify(info, null, 2));
  return { ok: true, messageId: (info as any).messageId || "simulated" };
}
