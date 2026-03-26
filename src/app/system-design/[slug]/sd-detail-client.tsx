"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ExternalLink, BookOpen, Video, FileText } from "lucide-react";
import { SdInterviewPanel } from "@/components/SdInterviewPanel";
import { SystemDesignViewer } from "@/components/SystemDesignViewer";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import type { SdProblemRow } from "@/types";

const sourceIcon = (kind: string) => {
  if (kind === "video") return <Video className="h-3.5 w-3.5" />;
  if (kind === "blog") return <FileText className="h-3.5 w-3.5" />;
  return <BookOpen className="h-3.5 w-3.5" />;
};

export function SdDetailClient({ row }: { row: SdProblemRow }) {
  const search = useSearchParams();
  const from = search.get("from");

  const context = `Typical companies where this appears: ${row.companies.join(", ")}. Category: ${row.category ?? "general"}.`;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:py-10">
      <div>
        {from ? (
          <Link href={`/company/${from}`} className={cn(buttonVariants({ variant: "ghost" }), "inline-flex gap-1.5 text-sm")}>
            <ArrowLeft className="h-3.5 w-3.5" /> Back to company
          </Link>
        ) : (
          <Link href="/system-design" className={cn(buttonVariants({ variant: "ghost" }), "inline-flex gap-1.5 text-sm")}>
            <ArrowLeft className="h-3.5 w-3.5" /> All prompts
          </Link>
        )}
      </div>

      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 via-card to-card p-6 shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight">{row.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {row.category && (
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
              {row.category}
            </span>
          )}
          {row.difficulty && (
            <span className="text-xs text-muted-foreground">{row.difficulty}</span>
          )}
        </div>
      </div>

      <SdInterviewPanel meta={row.interviewMeta} title={row.title} />
      <SystemDesignViewer title={row.title} context={context} />

      {row.references.length > 0 && (
        <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Curated references</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {row.references.map((r) => (
              <li key={`${r.title}-${r.url}`}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-3 rounded-lg border border-border/40 p-3 transition-colors hover:bg-muted/50 hover:border-primary/20"
                >
                  <div className="mt-0.5 text-muted-foreground group-hover:text-primary transition-colors">
                    {sourceIcon(r.sourceKind)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {r.sourceKind} · {r.type} · {r.difficulty}
                    </p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
