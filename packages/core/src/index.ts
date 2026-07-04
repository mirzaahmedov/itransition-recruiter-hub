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

export * from "./generated/client";
export * from "./generated/models";
export * from "./generated/enums";

export * from "./dtos/UserCreateDto";
