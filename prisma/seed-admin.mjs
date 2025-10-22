import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@celticvirtualgolf.ca';
  const phone = '000-000-0000';
  const passwordPlain = 'admin123';
  const passwordHash = await bcrypt.hash(passwordPlain, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN', state: 'REGULAR', phone, passwordHash },
    create: {
      firstName: 'Site',
      lastName: 'Admin',
      email,
      phone,
      role: 'ADMIN',
      state: 'REGULAR',
      passwordHash
    }
  });

  console.log('✅ Admin user ready:', { email, passwordPlain });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
