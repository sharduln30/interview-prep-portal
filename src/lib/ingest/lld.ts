import seedLld from "@/lib/data/lld.seed.json";
import { refsForLld } from "@/lib/data/lld-references";
import type { LldProblemSeed } from "@/types";

export type NormalizedLld = {
  slug: string;
  title: string;
  companies: string[];
  category: string | null;
  difficulty: string | null;
  prompt: string;
  solutionMarkdown: string;
  referencesJson: string;
};

export async function collectLldProblems(): Promise<NormalizedLld[]> {
  const list = seedLld as LldProblemSeed[];
  return list.map((p) => ({
    slug: p.slug,
    title: p.title,
    companies: p.companies,
    category: p.category ?? null,
    difficulty: p.difficulty ?? null,
    prompt: p.prompt,
    solutionMarkdown: p.solutionMarkdown,
    referencesJson: JSON.stringify(p.references ?? refsForLld(p)),
  }));
}

