import { bigint, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const dsaProblems = pgTable("dsa_problems", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  difficulty: text("difficulty").notNull(),
  topicsJson: text("topics_json").notNull().default("[]"),
  companiesJson: text("companies_json").notNull().default("[]"),
  frequency: integer("frequency").default(0),
  referencesJson: text("references_json").notNull().default("[]"),
  firstSeenAt: bigint("first_seen_at", { mode: "number" }).notNull(),
  lastSeenAt: bigint("last_seen_at", { mode: "number" }).notNull(),
});

export const sdProblems = pgTable("sd_problems", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  companiesJson: text("companies_json").notNull(),
  category: text("category"),
  difficulty: text("difficulty"),
  interviewMetaJson: text("interview_meta_json").notNull().default("{}"),
  referencesJson: text("references_json").notNull().default("[]"),
  firstSeenAt: bigint("first_seen_at", { mode: "number" }).notNull(),
  lastSeenAt: bigint("last_seen_at", { mode: "number" }).notNull(),
});

export const lldProblems = pgTable("lld_problems", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  companiesJson: text("companies_json").notNull(),
  category: text("category"),
  difficulty: text("difficulty"),
  prompt: text("prompt").notNull(),
  solutionMarkdown: text("solution_markdown").notNull(),
  referencesJson: text("references_json").notNull().default("[]"),
  firstSeenAt: bigint("first_seen_at", { mode: "number" }).notNull(),
  lastSeenAt: bigint("last_seen_at", { mode: "number" }).notNull(),
});

export const ingestRuns = pgTable("ingest_runs", {
  id: serial("id").primaryKey(),
  startedAt: bigint("started_at", { mode: "number" }).notNull(),
  finishedAt: bigint("finished_at", { mode: "number" }),
  source: text("source").notNull(),
  dsaCount: integer("dsa_count").default(0),
  sdCount: integer("sd_count").default(0),
  lldCount: integer("lld_count").default(0),
  status: text("status").notNull(),
  error: text("error"),
});
