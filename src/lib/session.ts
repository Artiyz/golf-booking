import type { SessionOptions } from "iron-session";

/** User payload we store in the iron-session cookie */
export type SessionUser = {
  id: string;
  email: string;
  // widen to string so assigning DB values never errors
  role?: "ADMIN" | "MEMBER" | string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
};

/** Shape of the whole session object we pass around via generics */
export type SessionData = {
  user?: SessionUser;
};

/** iron-session config */
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD || "dev-secret-change-me",
  cookieName: "cv_session",
  cookieOptions: { secure: process.env.NODE_ENV === "production" },
};