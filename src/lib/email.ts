export async function sendConfirmationEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ messageId: string } | null> {
  const messageId = Math.random().toString(36).slice(2);
  console.log("EMAIL_SIMULATED:", JSON.stringify({ to, subject, html, messageId }));
  return { messageId };
}
