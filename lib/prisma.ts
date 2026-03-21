import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { 
  prisma: PrismaClient;
  pool: Pool;
};

const getPool = () => {
  if (globalForPrisma.pool) return globalForPrisma.pool;
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Limit to 1 connection per Vercel serverless instance to prevent DB exhaustion exhaustion (Supabase pool limit)
    max: process.env.NODE_ENV === "production" ? 1 : 10,
    connectionTimeoutMillis: 10000, // 10s timeout
  });
  
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pool = pool;
  }
  
  return pool;
};

const createPrismaClient = () => {
  const pool = getPool();
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
