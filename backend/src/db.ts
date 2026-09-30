/**
 * db.ts — Prisma Client Singleton
 *
 * We use a singleton pattern to avoid creating multiple database
 * connections during development (hot reloads would create many connections).
 *
 * In production, the module cache handles this naturally.
 */

import { PrismaClient } from '@prisma/client';

// Extend the global object type to include our prisma instance
// This is a TypeScript trick for singleton in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Reuse the existing client if it exists (prevents connection leaks in dev)
const prisma = global.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
