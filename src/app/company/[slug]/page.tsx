import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProblemTable } from "@/components/ProblemTable";
import { SdTable } from "@/components/SdTable";
import { LldTable } from "@/components/LldTable";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import companies from "@/lib/data/companies.json";
import { getLatestSuccessfulIngest, listDsaForCompany, listLldForCompany, listSdForCompany } from "@/lib/data/queries";
import type { Company } from "@/types";

type Props = { params: { slug: string } };

export default async function CompanyPage({ params }: Props) {
  const company = (companies as Company[]).find((c) => c.slug === params.slug);
  if (!company) notFound();

  const [dsa, sd, lld, ingest] = await Promise.all([
    listDsaForCompany(company.slug),
    listSdForCompany(company.slug),
    listLldForCompany(company.slug),
    getLatestSuccessfulIngest(),
  ]);
  const last = ingest?.finishedAt
    ? new Date(ingest.finishedAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:py-10">
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 via-card to-card p-6 shadow-sm">
        <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "mb-3 -ml-2 inline-flex gap-1.5 text-sm")}>
          <ArrowLeft className="h-3.5 w-3.5" /> Companies
        </Link>
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white shadow-sm"
            style={{ backgroundColor: company.accent ?? "#6366f1" }}
          >
            {company.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{company.name}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                {dsa.length} DSA
              </span>
              <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                {sd.length} HLD
              </span>
              <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20">
                {lld.length} LLD
              </span>
            </div>
            {last && (
              <p className="mt-2 text-xs text-muted-foreground">
                Last updated: {last}
              </p>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="dsa" className="space-y-4">
        <TabsList className="h-auto w-full justify-start rounded-xl border border-border/60 bg-muted/40 p-1">
          <TabsTrigger value="dsa" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            DSA problems
          </TabsTrigger>
          <TabsTrigger value="sd" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            System design
          </TabsTrigger>
          <TabsTrigger value="lld" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            LLD
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dsa" className="pt-2">
          <ProblemTable problems={dsa} companySlug={company.slug} />
        </TabsContent>
        <TabsContent value="sd" className="pt-2">
          <SdTable problems={sd} companySlug={company.slug} />
        </TabsContent>
        <TabsContent value="lld" className="pt-2">
          <LldTable problems={lld} companySlug={company.slug} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
