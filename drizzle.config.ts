import { defineConfig } from "drizzle-kit";

const url =
  process.env.POSTGRES_URL ?? process.env.DATABASE_URL ?? "postgresql://127.0.0.1:5432/placeholder";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
