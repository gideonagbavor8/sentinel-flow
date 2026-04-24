// FIX: Use @prisma/client, not prisma/client or @/prisma/client
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

// We assign it to a constant so we can export it by name
const prisma = globalThis.prisma ?? prismaClientSingleton()

// FIX: Named export to match your other files
export { prisma };

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma