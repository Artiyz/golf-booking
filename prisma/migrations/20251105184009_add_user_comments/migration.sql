-- CreateTable
CREATE TABLE "public"."UserComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserComment_userId_createdAt_idx" ON "public"."UserComment"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."UserComment" ADD CONSTRAINT "UserComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
