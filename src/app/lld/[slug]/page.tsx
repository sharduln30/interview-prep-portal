import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/MarkdownBody";
import { buttonVariants } from "@/lib/button-variants";
import { getLldBySlug } from "@/lib/data/queries";
import { cn } from "@/lib/utils";

type Props = { params: { slug: string } };

export default function LldDetailPage({ params }: Props) {
  const row = getLldBySlug(params.slug);
  if (!row) notFound();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:py-10">
      <div className="flex flex-wrap gap-2">
        <Link href="/lld" className={cn(buttonVariants({ variant: "ghost" }), "inline-flex")}>
          ← All LLD prompts
        </Link>
      </div>
      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight">{row.title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {row.category ?? "LLD"} · {row.difficulty ?? "—"}
        </p>
      </section>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Interview prompt</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{row.prompt}</p>
          <div className="prose prose-sm dark:prose-invert mt-5 max-w-none">
            <MarkdownBody content={row.solutionMarkdown} />
          </div>
        </section>
        <aside className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">References</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {row.references.map((r) => (
              <li key={`${r.title}-${r.url}`} className="rounded-md border p-3">
                <p className="font-medium">{r.title}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {r.sourceKind} · {r.type} · {r.difficulty}
                </p>
                <a href={r.url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs underline">
                  Open resource
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

