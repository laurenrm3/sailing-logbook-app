import { PrismaClient } from "@prisma/client";

// Standard Prisma singleton pattern for Next.js dev mode (prevents
// exhausting your DB connection limit from hot-reloading).
// You shouldn't need to change this file.

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
