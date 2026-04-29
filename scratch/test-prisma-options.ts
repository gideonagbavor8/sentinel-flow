import { PrismaClient } from '@prisma/client';
try {
  const client = new PrismaClient({
    datasource: {
      url: process.env.DATABASE_URL
    }
  } as any);
  console.log('Client initialized with datasource');
} catch (e) {
  console.log('Failed with datasource:', e.message);
}

try {
  const client = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  } as any);
  console.log('Client initialized with datasources');
} catch (e) {
  console.log('Failed with datasources:', e.message);
}
