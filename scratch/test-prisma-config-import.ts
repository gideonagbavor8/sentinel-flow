import { PrismaClient } from '@prisma/client';
import config from '../prisma.config';
try {
  // @ts-ignore
  const client = new PrismaClient(config);
  console.log('Client initialized with config from prisma.config.ts');
} catch (e) {
  console.log('Failed with config:', e.message);
}
