import sdSeed from "@/lib/data/system-design.seed.json";
import { refsForSd } from "@/lib/data/references";
import type { SdProblemSeed } from "@/types";
import { mergeInterviewMeta } from "./merge-interview-meta";

export type NormalizedSd = {
  slug: string;
  title: string;
  companies: string[];
  category: string | null;
  difficulty: string | null;
  interviewMetaJson: string;
  referencesJson: string;
};

async function fetchUpstreamSd(): Promise<SdProblemSeed[]> {
  const url = process.env.UPSTREAM_SD_URL;
  if (!url) return [];
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = (await res.json()) as { problems?: SdProblemSeed[] } | SdProblemSeed[];
    if (Array.isArray(data)) return data;
    return data.problems ?? [];
  } catch {
    return [];
  }
}

function mergeSd(a: SdProblemSeed, b: Partial<SdProblemSeed>): SdProblemSeed {
  return {
    slug: a.slug,
    title: b.title ?? a.title,
    companies: Array.from(new Set([...(a.companies ?? []), ...(b.companies ?? [])])).sort(),
    category: b.category ?? a.category,
    difficulty: b.difficulty ?? a.difficulty,
    interviewMeta: mergeInterviewMeta(a.slug, a.interviewMeta, b.interviewMeta),
    references: b.references ?? a.references,
  };
}

export async function collectSdProblems(): Promise<NormalizedSd[]> {
  const bySlug = new Map<string, SdProblemSeed>();

  for (const p of sdSeed as SdProblemSeed[]) {
    bySlug.set(p.slug, { ...p });
  }

  for (const u of await fetchUpstreamSd()) {
    const cur = bySlug.get(u.slug);
    if (cur) {
      bySlug.set(u.slug, mergeSd(cur, u));
    } else {
      bySlug.set(u.slug, {
        slug: u.slug,
        title: u.title,
        companies: u.companies ?? [],
        category: u.category ?? "",
        difficulty: u.difficulty,
        interviewMeta: mergeInterviewMeta(u.slug, undefined, u.interviewMeta),
        references: u.references ?? refsForSd(u),
      });
    }
  }

  return Array.from(bySlug.values()).map((p) => {
    const meta = mergeInterviewMeta(p.slug, p.interviewMeta, undefined);
    return {
      slug: p.slug,
      title: p.title,
      companies: p.companies,
      category: p.category ?? null,
      difficulty: p.difficulty ?? null,
      interviewMetaJson: JSON.stringify(meta),
      referencesJson: JSON.stringify(p.references ?? refsForSd(p)),
    };
  });
}
