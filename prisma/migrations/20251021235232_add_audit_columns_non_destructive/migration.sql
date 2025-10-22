/* ========= Add audit columns with safe backfill, then drop temp defaults ========= */

/* Bay.updatedAt (backfill existing rows, then let Prisma @updatedAt take over) */
ALTER TABLE "Bay"
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();

/* Service.updatedAt */
ALTER TABLE "Service"
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();

/* Customer.updatedAt (harmless if already present in DB) */
ALTER TABLE "Customer"
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();

/* User.createdAt & User.updatedAt (createdAt keeps default; updatedAt is temp default then dropped) */
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();

/* Ensure unique index on User.phone exists only once (optional; @unique on nullable allows multiple NULLs) */
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'User_phone_key'
  ) THEN
    CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
  END IF;
END$$;

/* Drop runtime defaults so Prisma's @updatedAt updates these automatically on writes */
ALTER TABLE "Bay"     ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "Service" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "Customer"ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "User"    ALTER COLUMN "updatedAt" DROP DEFAULT;

/* Keep createdAt defaults */