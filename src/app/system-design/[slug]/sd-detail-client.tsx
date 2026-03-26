"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SdInterviewPanel } from "@/components/SdInterviewPanel";
import { SystemDesignViewer } from "@/components/SystemDesignViewer";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import type { SdProblemRow } from "@/types";

export function SdDetailClient({ row }: { row: SdProblemRow }) {
  const search = useSearchParams();
  const from = search.get("from");

  const context = `Typical companies where this appears: ${row.companies.join(", ")}. Category: ${row.category ?? "general"}.`;

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
          <Link href="/system-design" className={cn(buttonVariants({ variant: "ghost" }), "inline-flex")}>
            ← All prompts
          </Link>
        )}
      </div>
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight">{row.title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {row.category ?? "System design"} · {row.difficulty ?? "—"}
        </p>
      </div>
      <SdInterviewPanel meta={row.interviewMeta} title={row.title} />
      <SystemDesignViewer title={row.title} context={context} />
      {row.references.length ? (
        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Curated references</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {row.references.map((r) => (
              <li key={`${r.title}-${r.url}`} className="rounded-md border p-3 text-sm">
                <p className="font-medium">{r.title}</p>
                <p className="text-muted-foreground text-xs">
                  {r.sourceKind} · {r.type} · {r.difficulty}
                </p>
                <a href={r.url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs underline">
                  Open resource
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
