import companies from "@/lib/data/companies.json";
import seedProblems from "@/lib/data/problems.seed.json";
import { refsForDsa } from "@/lib/data/references";
import { fetchTopicTagProblems } from "@/lib/leetcode/client";
import type { Company, DsaProblemSeed } from "@/types";

export type NormalizedDsa = {
  slug: string;
  title: string;
  difficulty: string;
  topics: string[];
  companies: string[];
  frequency: number;
  references: DsaProblemSeed["references"];
};

async function fetchUpstreamDsa(): Promise<DsaProblemSeed[]> {
  const url = process.env.UPSTREAM_DSA_URL;
  if (!url) return [];
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = (await res.json()) as { problems?: DsaProblemSeed[] } | DsaProblemSeed[];
    if (Array.isArray(data)) return data;
    return data.problems ?? [];
  } catch {
    return [];
  }
}

function mergeCompany(list: string[], c: string): string[] {
  const s = new Set(list);
  s.add(c);
  return Array.from(s).sort();
}

export async function collectDsaProblems(): Promise<NormalizedDsa[]> {
  const bySlug = new Map<string, NormalizedDsa>();

  const applySeed = (p: DsaProblemSeed) => {
    const cur = bySlug.get(p.slug);
    if (cur) {
      cur.companies = Array.from(new Set([...cur.companies, ...p.companies])).sort();
      cur.frequency = Math.max(cur.frequency, p.frequency ?? 0);
      cur.topics = p.topics.length ? p.topics : cur.topics;
      cur.references = p.references?.length ? p.references : cur.references;
    } else {
      bySlug.set(p.slug, {
        slug: p.slug,
        title: p.title,
        difficulty: p.difficulty,
        topics: p.topics,
        companies: [...p.companies].sort(),
        frequency: p.frequency ?? 0,
        references: p.references ?? refsForDsa(p),
      });
    }
  };

  for (const p of seedProblems as DsaProblemSeed[]) {
    applySeed(p);
  }

  for (const u of await fetchUpstreamDsa()) {
    applySeed(u);
  }

  const companyList = companies as Company[];
  for (const c of companyList) {
    const remote = await fetchTopicTagProblems(c.leetcodeTag);
    for (const q of remote) {
      const slug = q.titleSlug;
      const cur = bySlug.get(slug);
      if (cur) {
        cur.companies = mergeCompany(cur.companies, c.slug);
        cur.frequency = Math.max(cur.frequency, 1);
        if (!cur.title) cur.title = q.title;
        if (!cur.difficulty) cur.difficulty = q.difficulty;
      } else {
        bySlug.set(slug, {
          slug,
          title: q.title,
          difficulty: q.difficulty,
          topics: [],
          companies: [c.slug],
          frequency: 1,
          references: refsForDsa({
            slug,
            title: q.title,
            difficulty: q.difficulty as "Easy" | "Medium" | "Hard",
            topics: [],
            companies: [c.slug],
          }),
        });
      }
    }
  }

  return Array.from(bySlug.values());
}
