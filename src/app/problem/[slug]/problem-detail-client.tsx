"use client";

import parse from "html-react-parser";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AISolutionPanel } from "@/components/AISolutionPanel";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { LeetCodeProblemDetail, ReferenceLink } from "@/types";
import { htmlToPlainText } from "@/lib/html-to-text";

export function ProblemDetailClient({ slug, references }: { slug: string; references: ReferenceLink[] }) {
  const search = useSearchParams();
  const from = search.get("from");
  const [data, setData] = useState<LeetCodeProblemDetail | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/leetcode?slug=${encodeURIComponent(slug)}`);
        if (!res.ok) {
          setErr(res.status === 404 ? "Problem not found on LeetCode." : "Failed to load.");
          return;
        }
        const json = (await res.json()) as LeetCodeProblemDetail;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setErr("Network error.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const plain = data ? htmlToPlainText(data.content) : "";

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:py-10">
      <div className="flex flex-wrap gap-2">
        {from ? (
          <Link
            href={`/company/${from}`}
            className={cn(buttonVariants({ variant: "ghost" }), "inline-flex")}
          >
            ← Back to company
          </Link>
        ) : (
          <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "inline-flex")}>
            ← Home
          </Link>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
          {err && <p className="text-destructive">{err}</p>}
          {!data && !err && (
            <div className="space-y-2">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-64 w-full" />
            </div>
          )}
          {data && (
            <>
              <div className="flex flex-wrap items-baseline gap-3">
                <h1 className="text-2xl font-bold tracking-tight">{data.title}</h1>
                <span className="text-muted-foreground text-sm">{data.difficulty}</span>
              </div>
              <p className="text-muted-foreground text-xs">
                Topics: {data.topicTags.join(", ") || "—"} ·{" "}
                <a
                  className="underline"
                  href={`https://leetcode.com/problems/${data.titleSlug}/`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open on LeetCode
                </a>
              </p>
              <article className="prose prose-sm dark:prose-invert max-w-none [&_img]:max-w-full">
                {parse(data.content)}
              </article>
            </>
          )}
        </div>

        <div className="lg:sticky lg:top-20">
          {data ? <AISolutionPanel title={data.title} problemPlainText={plain} /> : null}
          {references.length ? (
            <div className="mt-4 rounded-xl border bg-card p-4 shadow-sm">
              <h2 className="text-base font-semibold">Curated references</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {references.map((ref) => (
                  <li key={`${ref.title}-${ref.url}`} className="rounded-md border p-2.5">
                    <p className="font-medium">{ref.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {ref.sourceKind} · {ref.type} · {ref.difficulty}
                    </p>
                    <a className="text-xs underline" href={ref.url} target="_blank" rel="noreferrer">
                      Open resource
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
