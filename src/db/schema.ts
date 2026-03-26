import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const dsaProblems = sqliteTable("dsa_problems", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  difficulty: text("difficulty").notNull(),
  topicsJson: text("topics_json").notNull().default("[]"),
  companiesJson: text("companies_json").notNull().default("[]"),
  frequency: integer("frequency").default(0),
  referencesJson: text("references_json").notNull().default("[]"),
  firstSeenAt: integer("first_seen_at").notNull(),
  lastSeenAt: integer("last_seen_at").notNull(),
});

export const sdProblems = sqliteTable("sd_problems", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  companiesJson: text("companies_json").notNull(),
  category: text("category"),
  difficulty: text("difficulty"),
  interviewMetaJson: text("interview_meta_json").notNull().default("{}"),
  referencesJson: text("references_json").notNull().default("[]"),
  firstSeenAt: integer("first_seen_at").notNull(),
  lastSeenAt: integer("last_seen_at").notNull(),
});

export const lldProblems = sqliteTable("lld_problems", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  companiesJson: text("companies_json").notNull(),
  category: text("category"),
  difficulty: text("difficulty"),
  prompt: text("prompt").notNull(),
  solutionMarkdown: text("solution_markdown").notNull(),
  referencesJson: text("references_json").notNull().default("[]"),
  firstSeenAt: integer("first_seen_at").notNull(),
  lastSeenAt: integer("last_seen_at").notNull(),
});

export const ingestRuns = sqliteTable("ingest_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  startedAt: integer("started_at").notNull(),
  finishedAt: integer("finished_at"),
  source: text("source").notNull(),
  dsaCount: integer("dsa_count").default(0),
  sdCount: integer("sd_count").default(0),
  lldCount: integer("lld_count").default(0),
  status: text("status").notNull(),
  error: text("error"),
});
