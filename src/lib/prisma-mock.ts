// Mock prisma client for frontend development
// This avoids the PrismaClient import that's causing issues

export const prisma = {
  post: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve(null),
    update: () => Promise.resolve(null),
    delete: () => Promise.resolve(null),
  },
  user: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve(null),
    update: () => Promise.resolve(null),
  },
  tag: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve(null),
  },
  comment: {
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve(null),
    delete: () => Promise.resolve(null),
  },
  like: {
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve(null),
    delete: () => Promise.resolve(null),
  },
  $disconnect: () => Promise.resolve(),
} as any
