import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning database...');
  
  // Delete related records first to avoid foreign key constraints
  await prisma.auditLog.deleteMany({});
  await prisma.file.deleteMany({});
  await prisma.project.deleteMany({});
  
  // Delete users
  const { count } = await prisma.user.deleteMany({});
  
  console.log(`Successfully cleaned ${count} users and all related data.`);
}

main()
  .catch((e) => {
    console.error('Failed to clean database:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
