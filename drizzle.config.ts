import "dotenv/config";
import * as fs from "fs";
import { defineConfig } from "drizzle-kit";
import path from "path";
export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
