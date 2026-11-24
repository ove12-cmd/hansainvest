import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
let prisma = globalForPrisma.prisma;

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || !URL.canParse(connectionString)) {
    throw new Error("DATABASE_URL must be set to a valid database connection URL.");
  }

  // Prisma's driver-adapter query compiler rejects libpq-style params like
  // `sslmode` in the connection string (URL_PARAM_NOT_SUPPORTED) — strip it
  // and configure TLS on the pg Pool directly instead.
  const url = new URL(connectionString);
  url.searchParams.delete("sslmode");
  const pool = new Pool({ connectionString: url.toString(), ssl: true });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export function getPrisma(): PrismaClient {
  if (!prisma) {
    prisma = createClient();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prisma;
    }
  }
  return prisma;
}
