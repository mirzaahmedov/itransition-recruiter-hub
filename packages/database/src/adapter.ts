import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

export function createPrismaAdapter({ ca }: { ca: string }) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      ca,
    },
  });

  const adapter = new PrismaPg(pool);

  return adapter;
}
