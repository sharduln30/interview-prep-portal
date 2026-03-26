import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import fs from "fs";
import path from "path";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  __ipp_sqlite?: Database.Database;
  __ipp_drizzle?: BetterSQLite3Database<typeof schema>;
};

export function getSqlitePath(): string {
  return process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "app.db");
}

export function getDb(): BetterSQLite3Database<typeof schema> {
  if (globalForDb.__ipp_drizzle) {
    return globalForDb.__ipp_drizzle;
  }
  const dbPath = getSqlitePath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  globalForDb.__ipp_sqlite = sqlite;
  globalForDb.__ipp_drizzle = drizzle(sqlite, { schema });
  return globalForDb.__ipp_drizzle;
}
