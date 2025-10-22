import type { SessionData } from "@/lib/session";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export async function POST() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions as any);
  await session.destroy();
  const res = NextResponse.json({ ok: true });
  // Ensure cookie is cleared on the client immediately
  res.headers.append("Set-Cookie", "cv_golf_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax");
  return res;
}
