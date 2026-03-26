import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { LldTable } from "@/components/LldTable";
import { listAllLld } from "@/lib/data/queries";
import { cn } from "@/lib/utils";

export default function LldPage() {
  const problems = listAllLld();

  return (
    <div className="min-h-[60vh] px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border bg-card px-6 py-7 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Low-level design (LLD)</h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Practice object-oriented design with previously asked questions, structured solutions, and curated
            references.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
              Back to home
            </Link>
            <Link href="/system-design" className={cn(buttonVariants({ variant: "ghost" }))}>
              Explore HLD
            </Link>
          </div>
        </section>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <LldTable problems={problems} />
        </div>
      </div>
    </div>
  );
}
