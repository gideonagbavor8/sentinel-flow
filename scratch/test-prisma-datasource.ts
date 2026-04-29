import { PrismaClient } from '@prisma/client';
try {
  const client = new PrismaClient();
  console.log('Client initialized');
} catch (e) {
  console.log('Failed:', e.message);
}
