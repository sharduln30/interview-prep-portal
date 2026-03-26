import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { listSdForCompany } from "@/lib/data/queries";
import companies from "@/lib/data/companies.json";
import type { Company } from "@/types";

/** Union of all SD rows (any company) — dedupe by slug */
function allSdPrompts() {
  const bySlug = new Map<string, ReturnType<typeof listSdForCompany>[0]>();
  for (const c of companies as Company[]) {
    for (const p of listSdForCompany(c.slug)) {
      if (!bySlug.has(p.slug)) bySlug.set(p.slug, p);
    }
  }
  return Array.from(bySlug.values()).sort((a, b) => a.title.localeCompare(b.title));
}

export default function SystemDesignHubPage() {
  const prompts = allSdPrompts();

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:py-12">
      <div className="rounded-2xl border bg-card px-6 py-7 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">System design (HLD)</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          Pick a classic prompt. On the detail page, generate a structured design (requirements → capacity → APIs →
          deep dive), then explore curated deep-dive references.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {prompts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/system-design/${p.slug}`}
              className="flex h-full flex-col items-start gap-2 rounded-xl border bg-card px-4 py-4 transition-colors hover:bg-muted/50"
            >
              <span className="font-medium">{p.title}</span>
              <div className="flex flex-wrap items-center gap-2">
                {p.category ? (
                  <Badge variant="outline" className="text-xs">
                    {p.category}
                  </Badge>
                ) : null}
                {p.difficulty ? <span className="text-muted-foreground text-xs">{p.difficulty}</span> : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
