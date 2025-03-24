import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import * as process from "node:process";

export default defineConfig({
  out: "./migrations",
  schema: "./src/backend/schemas/schemas.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
