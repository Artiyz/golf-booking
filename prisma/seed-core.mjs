import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Services
  await prisma.service.createMany({
    data: [
      { name: 'Golf 1 Hour',  slug: 'golf-1h',   durationMinutes: 60,  priceCents: 4000 },
      { name: 'Golf 2 Hours', slug: 'golf-2h',   durationMinutes: 120, priceCents: 7500 },
      { name: 'Golf 4 Hours', slug: 'golf-4h',   durationMinutes: 240, priceCents: 14000 },
      { name: 'Golf 2.5 Hours', slug: 'golf-2-5-hours', durationMinutes: 150, priceCents: 9500 }
    ],
    skipDuplicates: true
  });

  // Bays
  const bays = [
    { name: 'Prime A', type: 'PRIME',    capacity: 10 },
    { name: 'Prime B', type: 'PRIME',    capacity: 10 },
    { name: 'Bay 1',   type: 'STANDARD', capacity: 4  },
    { name: 'Bay 2',   type: 'STANDARD', capacity: 4  },
    { name: 'Bay 3',   type: 'STANDARD', capacity: 4  },
    { name: 'Bay 4',   type: 'STANDARD', capacity: 4  },
  ];
  for (const b of bays) {
    await prisma.bay.upsert({
      where: { name: b.name },
      update: {},
      create: b
    });
  }

  const svcCount = await prisma.service.count();
  const bayCount = await prisma.bay.count();
  console.log(`✅ Seeded core data • services=${svcCount} • bays=${bayCount}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
