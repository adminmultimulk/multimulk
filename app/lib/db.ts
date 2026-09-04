import { PrismaClient } from "@prisma/client";

/**
 * One Prisma client per process.
 *
 * `next dev` reloads modules on every edit, and a fresh `PrismaClient` each
 * time exhausts Atlas's connection limit within a few saves — hence the global.
 * In production the module is evaluated once and the global is never set.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
