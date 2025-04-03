import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schemas/schemas";
import { Client as PgClient } from "pg";
// export const db = drizzle(process.env.DATABASE_URL!, { schema });
