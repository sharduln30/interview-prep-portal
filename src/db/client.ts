import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  __ipp_drizzle?: NeonHttpDatabase<typeof schema>;
};

export function getDb(): NeonHttpDatabase<typeof schema> {
  if (globalForDb.__ipp_drizzle) {
    return globalForDb.__ipp_drizzle;
  }
  const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error("POSTGRES_URL or DATABASE_URL must be set");
  }
  const sql = neon(url);
  const db = drizzle(sql, { schema });
  globalForDb.__ipp_drizzle = db;
  return db;
}
