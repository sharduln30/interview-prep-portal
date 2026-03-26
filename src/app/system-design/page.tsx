import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Layers, ArrowRight } from "lucide-react";
import { listSdForCompany } from "@/lib/data/queries";
import companies from "@/lib/data/companies.json";
import type { Company, SdProblemRow } from "@/types";

async function allSdPrompts(): Promise<SdProblemRow[]> {
  const bySlug = new Map<string, SdProblemRow>();
  for (const c of companies as Company[]) {
    const rows = await listSdForCompany(c.slug);
    for (const p of rows) {
      if (!bySlug.has(p.slug)) bySlug.set(p.slug, p);
    }
  }
  return Array.from(bySlug.values()).sort((a, b) => a.title.localeCompare(b.title));
}

export default async function SystemDesignHubPage() {
  const prompts = await allSdPrompts();

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:py-14">
      <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 via-card to-card px-6 py-10 sm:px-10 sm:py-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="flex items-start gap-4">
          <div className="hidden rounded-xl bg-primary/10 p-3 sm:block">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <div className="relative">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">System Design (HLD)</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Pick a classic prompt. Generate a structured design (requirements, capacity, APIs,
              deep dive) and explore curated deep-dive references.
            </p>
          </div>
        </div>
      </section>

      <ul className="grid gap-3 sm:grid-cols-2">
        {prompts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/system-design/${p.slug}`}
              className="group flex h-full items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-5 py-4 transition-all hover:shadow-md hover:shadow-primary/5 hover:border-primary/20"
            >
              <div className="space-y-1.5">
                <span className="font-semibold group-hover:text-primary transition-colors">{p.title}</span>
                <div className="flex flex-wrap items-center gap-2">
                  {p.category && (
                    <Badge variant="outline" className="text-xs border-border/60">
                      {p.category}
                    </Badge>
                  )}
                  {p.difficulty && (
                    <span className="text-xs text-muted-foreground">{p.difficulty}</span>
                  )}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
