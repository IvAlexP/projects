import { defineConfig } from "@prisma/config";
import path from "path";
import * as dotenv from "dotenv";

// load .env only if DATABASE_URL is not set (which means we're not in Docker, where it's already set)
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.join(__dirname, "../.env") });
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'npx ts-node -r tsconfig-paths/register src/prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});