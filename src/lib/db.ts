import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  // Prisma's driver-adapter query compiler rejects libpq-style params like
  // `sslmode` in the connection string (URL_PARAM_NOT_SUPPORTED) — strip it
  // and configure TLS on the pg Pool directly instead.
  const url = new URL(process.env.DATABASE_URL!);
  url.searchParams.delete("sslmode");
  const pool = new Pool({ connectionString: url.toString(), ssl: true });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
