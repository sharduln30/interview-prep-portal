"use client";

import parse from "html-react-parser";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, BookOpen, Video, FileText } from "lucide-react";
import { AISolutionPanel } from "@/components/AISolutionPanel";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { LeetCodeProblemDetail, ReferenceLink } from "@/types";
import { htmlToPlainText } from "@/lib/html-to-text";

const sourceIcon = (kind: string) => {
  if (kind === "video") return <Video className="h-3.5 w-3.5" />;
  if (kind === "blog") return <FileText className="h-3.5 w-3.5" />;
  return <BookOpen className="h-3.5 w-3.5" />;
};

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
      <div>
        {from ? (
          <Link href={`/company/${from}`} className={cn(buttonVariants({ variant: "ghost" }), "inline-flex gap-1.5 text-sm")}>
            <ArrowLeft className="h-3.5 w-3.5" /> Back to company
          </Link>
        ) : (
          <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "inline-flex gap-1.5 text-sm")}>
            <ArrowLeft className="h-3.5 w-3.5" /> Home
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          {err && <p className="text-destructive">{err}</p>}
          {!data && !err && (
            <div className="space-y-3">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-64 w-full" />
            </div>
          )}
          {data && (
            <>
              <div className="flex flex-wrap items-baseline gap-3">
                <h1 className="text-2xl font-extrabold tracking-tight">{data.title}</h1>
                <DifficultyBadge difficulty={data.difficulty} />
              </div>
              <p className="text-muted-foreground text-xs">
                Topics: {data.topicTags.join(", ") || "—"} ·{" "}
                <a
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                  href={`https://leetcode.com/problems/${data.titleSlug}/`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open on LeetCode <ExternalLink className="h-3 w-3" />
                </a>
              </p>
              <article className="prose prose-sm dark:prose-invert max-w-none [&_img]:max-w-full">
                {parse(data.content)}
              </article>
            </>
          )}
        </div>

        <div className="lg:sticky lg:top-20 space-y-4">
          {data ? <AISolutionPanel title={data.title} problemPlainText={plain} /> : null}
          {references.length > 0 && (
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
              <h2 className="text-base font-semibold">Curated references</h2>
              <ul className="mt-3 space-y-2">
                {references.map((ref) => (
                  <li key={`${ref.title}-${ref.url}`}>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-start gap-3 rounded-lg border border-border/40 p-3 transition-colors hover:bg-muted/50 hover:border-primary/20"
                    >
                      <div className="mt-0.5 text-muted-foreground group-hover:text-primary transition-colors">
                        {sourceIcon(ref.sourceKind)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">{ref.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {ref.sourceKind} · {ref.type} · {ref.difficulty}
                        </p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    Easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
    Hard: "bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20",
  };
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset", colors[difficulty] ?? "bg-muted text-muted-foreground ring-border")}>
      {difficulty}
    </span>
  );
}
