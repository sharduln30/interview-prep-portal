import Link from "next/link";
import { Box } from "lucide-react";
import { buttonVariants } from "@/lib/button-variants";
import { LldTable } from "@/components/LldTable";
import { listAllLld } from "@/lib/data/queries";
import { cn } from "@/lib/utils";

export default async function LldPage() {
  const problems = await listAllLld();

  return (
    <div className="min-h-[60vh] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-amber-500/5 via-card to-card px-6 py-10 sm:px-10 sm:py-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />
          <div className="flex items-start gap-4">
            <div className="hidden rounded-xl bg-amber-500/10 p-3 sm:block">
              <Box className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="relative">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Low-Level Design (LLD)</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Practice object-oriented design with previously asked questions, structured solutions,
                and curated references.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "text-sm")}>
                  Back to home
                </Link>
                <Link href="/system-design" className={cn(buttonVariants({ variant: "ghost" }), "text-sm")}>
                  Explore HLD
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <LldTable problems={problems} />
        </div>
      </div>
    </div>
  );
}
