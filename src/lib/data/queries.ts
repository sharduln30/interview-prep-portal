import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { dsaProblems, ingestRuns, lldProblems, sdProblems } from "@/db/schema";
import companies from "@/lib/data/companies.json";
import { interviewMetaForSlug } from "@/lib/data/sd-interview-defaults";
import type { Company, DsaProblemRow, IngestRunRow, LldProblemRow, ReferenceLink, SdInterviewMeta, SdProblemRow } from "@/types";
import { bootstrapFromSeedIfEmpty } from "@/lib/ingest/runner";
import { isNewItem } from "@/lib/ingest/diff";

function parseRefs(raw: string | null | undefined): ReferenceLink[] {
  if (!raw) return [];
  try {
    const refs = JSON.parse(raw) as ReferenceLink[];
    return Array.isArray(refs) ? refs : [];
  } catch {
    return [];
  }
}

function rowToDsa(r: typeof dsaProblems.$inferSelect): DsaProblemRow {
  return {
    slug: r.slug,
    title: r.title,
    difficulty: r.difficulty,
    topics: JSON.parse(r.topicsJson || "[]") as string[],
    companies: JSON.parse(r.companiesJson || "[]") as string[],
    frequency: r.frequency ?? 0,
    references: parseRefs(r.referencesJson),
    firstSeenAt: r.firstSeenAt,
    lastSeenAt: r.lastSeenAt,
  };
}

function parseSdInterviewMeta(raw: string | null | undefined, slug: string): SdInterviewMeta {
  if (!raw || raw === "{}") return interviewMetaForSlug(slug);
  try {
    const p = JSON.parse(raw) as SdInterviewMeta;
    if (
      p &&
      typeof p.lastAskedSummary === "string" &&
      Array.isArray(p.experiences) &&
      typeof p.disclaimer === "string"
    ) {
      return p;
    }
  } catch {
    /* invalid */
  }
  return interviewMetaForSlug(slug);
}

function rowToSd(r: typeof sdProblems.$inferSelect): SdProblemRow {
  return {
    slug: r.slug,
    title: r.title,
    companies: JSON.parse(r.companiesJson || "[]") as string[],
    category: r.category,
    difficulty: r.difficulty,
    interviewMeta: parseSdInterviewMeta(r.interviewMetaJson, r.slug),
    references: parseRefs(r.referencesJson),
    firstSeenAt: r.firstSeenAt,
    lastSeenAt: r.lastSeenAt,
  };
}

function rowToLld(r: typeof lldProblems.$inferSelect): LldProblemRow {
  return {
    slug: r.slug,
    title: r.title,
    companies: JSON.parse(r.companiesJson || "[]") as string[],
    category: r.category,
    difficulty: r.difficulty,
    prompt: r.prompt,
    solutionMarkdown: r.solutionMarkdown,
    references: parseRefs(r.referencesJson),
    firstSeenAt: r.firstSeenAt,
    lastSeenAt: r.lastSeenAt,
  };
}

export function ensureDataLoaded(): void {
  bootstrapFromSeedIfEmpty();
}

export function getCompaniesWithCounts(): (Company & { dsaCount: number; sdCount: number; lldCount: number })[] {
  ensureDataLoaded();
  const db = getDb();
  const allDsa = db.select().from(dsaProblems).all();
  const allSd = db.select().from(sdProblems).all();
  const allLld = db.select().from(lldProblems).all();
  const list = companies as Company[];

  return list.map((c) => {
    const dsaCount = allDsa.filter((r) => (JSON.parse(r.companiesJson || "[]") as string[]).includes(c.slug))
      .length;
    const sdCount = allSd.filter((r) => (JSON.parse(r.companiesJson || "[]") as string[]).includes(c.slug))
      .length;
    const lldCount = allLld.filter((r) => (JSON.parse(r.companiesJson || "[]") as string[]).includes(c.slug))
      .length;
    return { ...c, dsaCount, sdCount, lldCount };
  });
}

export function listDsaForCompany(companySlug: string): DsaProblemRow[] {
  ensureDataLoaded();
  const db = getDb();
  const rows = db.select().from(dsaProblems).all();
  return rows
    .filter((r) => (JSON.parse(r.companiesJson || "[]") as string[]).includes(companySlug))
    .map(rowToDsa);
}

export function listSdForCompany(companySlug: string): SdProblemRow[] {
  ensureDataLoaded();
  const db = getDb();
  const rows = db.select().from(sdProblems).all();
  return rows
    .filter((r) => (JSON.parse(r.companiesJson || "[]") as string[]).includes(companySlug))
    .map(rowToSd);
}

export function getDsaBySlug(slug: string): DsaProblemRow | null {
  ensureDataLoaded();
  const db = getDb();
  const r = db.select().from(dsaProblems).where(eq(dsaProblems.slug, slug)).get();
  return r ? rowToDsa(r) : null;
}

export function getSdBySlug(slug: string): SdProblemRow | null {
  ensureDataLoaded();
  const db = getDb();
  const r = db.select().from(sdProblems).where(eq(sdProblems.slug, slug)).get();
  return r ? rowToSd(r) : null;
}

export function getLatestSuccessfulIngest(): IngestRunRow | null {
  ensureDataLoaded();
  const db = getDb();
  const r = db
    .select()
    .from(ingestRuns)
    .where(eq(ingestRuns.status, "ok"))
    .orderBy(desc(ingestRuns.finishedAt))
    .limit(1)
    .get();
  if (!r) return null;
  return {
    id: r.id,
    startedAt: r.startedAt,
    finishedAt: r.finishedAt,
    source: r.source,
    dsaCount: r.dsaCount ?? 0,
    sdCount: r.sdCount ?? 0,
    lldCount: r.lldCount ?? 0,
    status: r.status,
    error: r.error,
  };
}

export function listLldForCompany(companySlug: string): LldProblemRow[] {
  ensureDataLoaded();
  const db = getDb();
  const rows = db.select().from(lldProblems).all();
  return rows
    .filter((r) => (JSON.parse(r.companiesJson || "[]") as string[]).includes(companySlug))
    .map(rowToLld);
}

export function listAllLld(): LldProblemRow[] {
  ensureDataLoaded();
  const db = getDb();
  const rows = db.select().from(lldProblems).all();
  return rows.map(rowToLld).sort((a, b) => a.title.localeCompare(b.title));
}

export function getLldBySlug(slug: string): LldProblemRow | null {
  ensureDataLoaded();
  const db = getDb();
  const r = db.select().from(lldProblems).where(eq(lldProblems.slug, slug)).get();
  return r ? rowToLld(r) : null;
}

export { isNewItem };
