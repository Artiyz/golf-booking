import type { SessionData } from "@/lib/session";
import "iron-session";
declare module "iron-session" {
  interface IronSessionData {
    user?: import("../lib/session").SessionUser;
  }
}
