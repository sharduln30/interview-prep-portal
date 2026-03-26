import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, BookOpen, Video, FileText } from "lucide-react";
import { MarkdownBody } from "@/components/MarkdownBody";
import { buttonVariants } from "@/lib/button-variants";
import { getLldBySlug } from "@/lib/data/queries";
import { cn } from "@/lib/utils";

const sourceIcon = (kind: string) => {
  if (kind === "video") return <Video className="h-3.5 w-3.5" />;
  if (kind === "blog") return <FileText className="h-3.5 w-3.5" />;
  return <BookOpen className="h-3.5 w-3.5" />;
};

type Props = { params: { slug: string } };

export default async function LldDetailPage({ params }: Props) {
  const row = await getLldBySlug(params.slug);
  if (!row) notFound();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:py-10">
      <div>
        <Link href="/lld" className={cn(buttonVariants({ variant: "ghost" }), "inline-flex gap-1.5 text-sm")}>
          <ArrowLeft className="h-3.5 w-3.5" /> All LLD prompts
        </Link>
      </div>

      <section className="rounded-2xl border border-border/60 bg-gradient-to-br from-amber-500/5 via-card to-card p-6 shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight">{row.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {row.category && (
            <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20">
              {row.category}
            </span>
          )}
          {row.difficulty && (
            <span className="text-xs text-muted-foreground">{row.difficulty}</span>
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Interview prompt</h2>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{row.prompt}</p>
          <div className="prose prose-sm dark:prose-invert mt-6 max-w-none">
            <MarkdownBody content={row.solutionMarkdown} />
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-20 self-start">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">References</h2>
            <ul className="mt-3 space-y-2">
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
          </div>
        </aside>
      </div>
    </div>
  );
}
