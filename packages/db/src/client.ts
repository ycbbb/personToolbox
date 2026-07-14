import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const raw = process.env.DATABASE_URL;
  // For development without a DB, return a no-op client that won't throw at import time.
  // Real DB connection is deferred until the first actual query.
  if (!raw) {
    if (process.env.NODE_ENV !== "production") {
      // Return a client without an adapter — it will throw only if you try to query.
      // This allows prisma generate and type-check to succeed without DATABASE_URL.
      const client = new PrismaClient();
      globalForPrisma.prisma = client;
      return client;
    }
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const adapter = new PrismaPg({ connectionString: raw });
  const client = new PrismaClient({ adapter });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

// Lazy-initialized via Proxy to avoid throwing during Next.js build-time module evaluation
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = (globalForPrisma.prisma ??= createPrismaClient());
    return Reflect.get(client, prop);
  },
});
