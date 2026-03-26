import { HomeCompanies } from "@/components/HomeCompanies";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getCompaniesWithCounts } from "@/lib/data/queries";

export default function Home() {
  const companies = getCompaniesWithCounts();

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:py-12">
      <section className="rounded-2xl border bg-card px-6 py-7 shadow-sm">
        <div className="space-y-3">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.12em]">Interview prep OS</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Prepare by company, not by random list</h1>
          <p className="text-muted-foreground max-w-3xl text-base sm:text-lg">
            Practice high-signal DSA problems, run structured system design mocks, and review LLD scenarios with
            curated references and your preferred AI provider.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 pt-4">
          <Link href="/system-design" className={cn(buttonVariants())}>
            Explore system design
          </Link>
          <Link href="/lld" className={cn(buttonVariants({ variant: "secondary" }))}>
            Explore LLD
          </Link>
        </div>
      </section>

      <HomeCompanies companies={companies} />
    </div>
  );
}
