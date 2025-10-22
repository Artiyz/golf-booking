import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@celtic.local";
  const pass  = process.env.ADMIN_PASSWORD || "AdminPass!123";
  const first = process.env.ADMIN_FIRST || "Site";
  const last  = process.env.ADMIN_LAST  || "Admin";

  const passwordHash = await bcrypt.hash(pass, 12);
  await prisma.user.upsert({
    where: { email },
    update: { role: "admin", firstName: first, lastName: last, passwordHash },
    create: { email, passwordHash, role: "admin", firstName: first, lastName: last, state: "REGULAR" }
  });

  console.log("Admin ready:", email, "(change in env for production)");
}
main().finally(async () => { await prisma.$disconnect(); });
