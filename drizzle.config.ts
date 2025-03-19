import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import * as process from "node:process";

console.log(process.env.DATABASE_URL);

export default defineConfig({
  out: "./migrations",
  schema: "./src/persistent/schemas/schemas.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
