import { PrismaClient } from '@prisma/client';
try {
  const client = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  } as any);
  console.log('Client initialized with datasources object (runtime test)');
} catch (e) {
  console.log('Failed with datasources object:', e.message);
}
