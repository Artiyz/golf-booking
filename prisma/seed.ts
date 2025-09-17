import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.service.createMany({
    data: [
      { name: "Golf 1 Hour", slug: "golf-1h", durationMinutes: 60,  priceCents: 4000 },
      { name: "Golf 2 Hours", slug: "golf-2h", durationMinutes: 120, priceCents: 7500 },
      { name: "Golf 4 Hours", slug: "golf-4h", durationMinutes: 240, priceCents: 14000 }
    ],
    skipDuplicates: true
  });

  const baysData: { name: string; type: Prisma.$Enums.BayType; capacity: number }[] = [
    { name: "Prime A", type: "PRIME", capacity: 10 },
    { name: "Prime B", type: "PRIME", capacity: 10 },
    { name: "Bay 1",   type: "STANDARD", capacity: 4 },
    { name: "Bay 2",   type: "STANDARD", capacity: 4 },
    { name: "Bay 3",   type: "STANDARD", capacity: 4 },
    { name: "Bay 4",   type: "STANDARD", capacity: 4 }
  ];
  for (const b of baysData) {
    await prisma.bay.upsert({
      where: { name: b.name },
      update: {},
      create: { name: b.name, type: b.type, capacity: b.capacity }
    });
  }
  console.log("Seeded services and bays.");
}
main().finally(() => prisma.$disconnect());
