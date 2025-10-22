/* scripts/create-admin.ts
 * Upserts an ADMIN user your auth flow expects.
 *
 * Usage:
 *   ADMIN_EMAIL=admin@cv.local ADMIN_PASSWORD=Admin123! npx tsx scripts/create-admin.ts
 *   # or with ts-node if you prefer:
 *   # ADMIN_EMAIL=admin@cv.local ADMIN_PASSWORD=Admin123! npx ts-node scripts/create-admin.ts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@cv.local";
  const password = process.env.ADMIN_PASSWORD || "Admin123!";
  const firstName = process.env.ADMIN_FIRST_NAME || "Site";
  const lastName = process.env.ADMIN_LAST_NAME || "Admin";

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: "ADMIN",
      passwordHash,
      firstName,
      lastName,
      state: "REGULAR",
    },
    create: {
      email,
      role: "ADMIN",
      passwordHash,
      firstName,
      lastName,
      state: "REGULAR",
      // phone is optional; omit to avoid unique conflicts
    },
  });

  console.log("✅ Admin upserted:", { id: user.id, email: user.email, role: user.role });
  console.log("   Login with:", email);
}

main()
  .catch((e) => {
    console.error("Failed to create admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });