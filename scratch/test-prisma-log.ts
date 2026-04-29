import { PrismaClient } from '@prisma/client';
try {
  const client = new PrismaClient({
    log: ['info']
  });
  console.log('Client initialized with log options');
} catch (e) {
  console.log('Failed with log options:', e.message);
}
