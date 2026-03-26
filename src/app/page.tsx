import { HomeCompanies } from "@/components/HomeCompanies";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getCompaniesWithCounts } from "@/lib/data/queries";
import { Code2, Layers, Box } from "lucide-react";

export default async function Home() {
  const companies = await getCompaniesWithCounts();

  const totalDsa = companies.reduce((s, c) => s + c.dsaCount, 0);
  const totalSd = companies.reduce((s, c) => s + c.sdCount, 0);
  const totalLld = companies.reduce((s, c) => s + c.lldCount, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:py-14">
      <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 via-card to-card px-6 py-10 sm:px-10 sm:py-14">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Interview Prep OS
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Prepare by{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              company
            </span>
            , not by random list
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Practice high-signal DSA problems, run structured system design mocks, and review LLD
            scenarios with curated references and your preferred AI provider.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/system-design" className={cn(buttonVariants(), "shadow-sm shadow-primary/20")}>
              Explore system design
            </Link>
            <Link href="/lld" className={cn(buttonVariants({ variant: "secondary" }))}>
              Explore LLD
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={<Box className="h-4 w-4" />} label="Companies" value={companies.length} color="primary" />
        <StatCard icon={<Code2 className="h-4 w-4" />} label="DSA Problems" value={totalDsa} color="emerald" />
        <StatCard icon={<Layers className="h-4 w-4" />} label="HLD Prompts" value={totalSd} color="primary" />
        <StatCard icon={<Box className="h-4 w-4" />} label="LLD Prompts" value={totalLld} color="amber" />
      </section>

      <HomeCompanies companies={companies} />
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className={cn("mb-2 inline-flex rounded-lg p-2", colorMap[color] ?? colorMap.primary)}>
        {icon}
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
