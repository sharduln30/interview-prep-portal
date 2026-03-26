import { interviewMetaForSlug } from "@/lib/data/sd-interview-defaults";
import type { SdInterviewMeta } from "@/types";

function dedupeExperiences(a: SdInterviewMeta["experiences"]): SdInterviewMeta["experiences"] {
  const seen = new Set<string>();
  const out: SdInterviewMeta["experiences"] = [];
  for (const e of a) {
    const k = `${e.company}|${e.reportedAt}|${e.summary.slice(0, 80)}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(e);
  }
  return out;
}

export function mergeInterviewMeta(
  slug: string,
  a?: SdInterviewMeta,
  b?: SdInterviewMeta,
): SdInterviewMeta {
  const base = interviewMetaForSlug(slug);
  const left = a ?? base;
  if (!b) return left;
  const dataAsOf = b.dataAsOf > left.dataAsOf ? b.dataAsOf : left.dataAsOf;
  return {
    lastAskedSummary: b.lastAskedSummary || left.lastAskedSummary,
    dataAsOf,
    experiences: dedupeExperiences([...left.experiences, ...b.experiences]),
    disclaimer: left.disclaimer,
  };
}
