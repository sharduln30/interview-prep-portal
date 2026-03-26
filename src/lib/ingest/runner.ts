import { count, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { dsaProblems, ingestRuns, lldProblems, sdProblems } from "@/db/schema";
import lldSeed from "@/lib/data/lld.seed.json";
import seedDsa from "@/lib/data/problems.seed.json";
import seedSd from "@/lib/data/system-design.seed.json";
import { refsForLld } from "@/lib/data/lld-references";
import { refsForDsa, refsForSd } from "@/lib/data/references";
import type { DsaProblemSeed, LldProblemSeed, SdProblemSeed } from "@/types";
import { mergeInterviewMeta } from "./merge-interview-meta";
import { collectDsaProblems } from "./dsa";
import { collectLldProblems } from "./lld";
import { collectSdProblems } from "./systemDesign";

export async function runIngest(): Promise<{ dsaCount: number; sdCount: number; lldCount: number; runId: number }> {
  const db = getDb();
  const startedAt = Date.now();

  const inserted = await db
    .insert(ingestRuns)
    .values({
      startedAt,
      source: "ingest",
      status: "running",
      dsaCount: 0,
      sdCount: 0,
      lldCount: 0,
    })
    .returning();
  const run = inserted[0];

  if (!run) {
    throw new Error("Failed to start ingest run");
  }

  try {
    const now = Date.now();
    const dsaList = await collectDsaProblems();
    const sdList = await collectSdProblems();
    const lldList = await collectLldProblems();

    for (const p of dsaList) {
      const existingRows = await db.select().from(dsaProblems).where(eq(dsaProblems.slug, p.slug)).limit(1);
      const firstSeen = existingRows[0]?.firstSeenAt ?? now;
      await db.insert(dsaProblems)
        .values({
          slug: p.slug,
          title: p.title,
          difficulty: p.difficulty,
          topicsJson: JSON.stringify(p.topics),
          companiesJson: JSON.stringify(p.companies),
          frequency: p.frequency,
          referencesJson: JSON.stringify(p.references ?? []),
          firstSeenAt: firstSeen,
          lastSeenAt: now,
        })
        .onConflictDoUpdate({
          target: dsaProblems.slug,
          set: {
            title: p.title,
            difficulty: p.difficulty,
            topicsJson: JSON.stringify(p.topics),
            companiesJson: JSON.stringify(p.companies),
            frequency: p.frequency,
            referencesJson: JSON.stringify(p.references ?? []),
            lastSeenAt: now,
          },
        });
    }

    for (const p of sdList) {
      const existingRows = await db.select().from(sdProblems).where(eq(sdProblems.slug, p.slug)).limit(1);
      const firstSeen = existingRows[0]?.firstSeenAt ?? now;
      await db.insert(sdProblems)
        .values({
          slug: p.slug,
          title: p.title,
          companiesJson: JSON.stringify(p.companies),
          category: p.category,
          difficulty: p.difficulty,
          interviewMetaJson: p.interviewMetaJson,
          referencesJson: p.referencesJson,
          firstSeenAt: firstSeen,
          lastSeenAt: now,
        })
        .onConflictDoUpdate({
          target: sdProblems.slug,
          set: {
            title: p.title,
            companiesJson: JSON.stringify(p.companies),
            category: p.category,
            difficulty: p.difficulty,
            interviewMetaJson: p.interviewMetaJson,
            referencesJson: p.referencesJson,
            lastSeenAt: now,
          },
        });
    }

    for (const p of lldList) {
      const existingRows = await db.select().from(lldProblems).where(eq(lldProblems.slug, p.slug)).limit(1);
      const firstSeen = existingRows[0]?.firstSeenAt ?? now;
      await db.insert(lldProblems)
        .values({
          slug: p.slug,
          title: p.title,
          companiesJson: JSON.stringify(p.companies),
          category: p.category,
          difficulty: p.difficulty,
          prompt: p.prompt,
          solutionMarkdown: p.solutionMarkdown,
          referencesJson: p.referencesJson,
          firstSeenAt: firstSeen,
          lastSeenAt: now,
        })
        .onConflictDoUpdate({
          target: lldProblems.slug,
          set: {
            title: p.title,
            companiesJson: JSON.stringify(p.companies),
            category: p.category,
            difficulty: p.difficulty,
            prompt: p.prompt,
            solutionMarkdown: p.solutionMarkdown,
            referencesJson: p.referencesJson,
            lastSeenAt: now,
          },
        });
    }

    await db.update(ingestRuns)
      .set({
        finishedAt: Date.now(),
        status: "ok",
        dsaCount: dsaList.length,
        sdCount: sdList.length,
        lldCount: lldList.length,
      })
      .where(eq(ingestRuns.id, run.id));

    return { dsaCount: dsaList.length, sdCount: sdList.length, lldCount: lldList.length, runId: run.id };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    await db.update(ingestRuns)
      .set({
        finishedAt: Date.now(),
        status: "error",
        error: message,
      })
      .where(eq(ingestRuns.id, run.id));
    throw e;
  }
}

export async function bootstrapFromSeedIfEmpty(): Promise<void> {
  const db = getDb();
  const rows = await db.select({ v: count() }).from(dsaProblems);
  if (rows[0] && rows[0].v > 0) return;

  const now = Date.now();
  const dsaList = seedDsa as DsaProblemSeed[];
  const sdList = seedSd as SdProblemSeed[];
  const lldList = lldSeed as LldProblemSeed[];

  for (const p of dsaList) {
    await db.insert(dsaProblems)
      .values({
        slug: p.slug,
        title: p.title,
        difficulty: p.difficulty,
        topicsJson: JSON.stringify(p.topics),
        companiesJson: JSON.stringify(p.companies),
        frequency: p.frequency ?? 0,
        referencesJson: JSON.stringify(p.references ?? refsForDsa(p)),
        firstSeenAt: now,
        lastSeenAt: now,
      })
      .onConflictDoNothing();
  }
  for (const p of sdList) {
    await db.insert(sdProblems)
      .values({
        slug: p.slug,
        title: p.title,
        companiesJson: JSON.stringify(p.companies),
        category: p.category ?? null,
        difficulty: p.difficulty ?? null,
        interviewMetaJson: JSON.stringify(mergeInterviewMeta(p.slug, p.interviewMeta, undefined)),
        referencesJson: JSON.stringify(p.references ?? refsForSd(p)),
        firstSeenAt: now,
        lastSeenAt: now,
      })
      .onConflictDoNothing();
  }
  for (const p of lldList) {
    await db.insert(lldProblems)
      .values({
        slug: p.slug,
        title: p.title,
        companiesJson: JSON.stringify(p.companies),
        category: p.category ?? null,
        difficulty: p.difficulty ?? null,
        prompt: p.prompt,
        solutionMarkdown: p.solutionMarkdown,
        referencesJson: JSON.stringify(p.references ?? refsForLld(p)),
        firstSeenAt: now,
        lastSeenAt: now,
      })
      .onConflictDoNothing();
  }
}
