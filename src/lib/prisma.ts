// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

declare global {
  // Prevent multiple instances in dev
  // @ts-ignore
  var prisma: PrismaClient
}

export const prisma =
  // @ts-ignore
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') {
  // @ts-ignore
  global.prisma = prisma
}
