import { PrismaClient } from '@prisma/client';
class SentinelPrismaClient extends PrismaClient {
  constructor() {
    super({
      // @ts-ignore
      datasourceUrl: process.env.DATABASE_URL,
    })
  }
}
try {
  const client = new SentinelPrismaClient();
  console.log('Subclassed client initialized');
} catch (e) {
  console.log('Failed subclassed client:', e.message);
}
