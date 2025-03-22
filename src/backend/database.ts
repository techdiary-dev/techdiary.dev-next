import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schemas/schemas";
import { Client as PgClient } from "pg";
// export const db = drizzle(process.env.DATABASE_URL!, { schema });

const dbClient = new PgClient({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});
