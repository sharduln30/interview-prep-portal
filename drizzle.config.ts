import { defineConfig } from "drizzle-kit";
import path from "path";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_PATH
      ? `file:${process.env.DATABASE_PATH}`
      : `file:${path.join(process.cwd(), "data", "app.db")}`,
  },
});
