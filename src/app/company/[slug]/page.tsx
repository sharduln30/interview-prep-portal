import Link from "next/link";
import { notFound } from "next/navigation";
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

export default function CompanyPage({ params }: Props) {
  const company = (companies as Company[]).find((c) => c.slug === params.slug);
  if (!company) notFound();

  const dsa = listDsaForCompany(company.slug);
  const sd = listSdForCompany(company.slug);
  const lld = listLldForCompany(company.slug);
  const ingest = getLatestSuccessfulIngest();
  const last = ingest?.finishedAt
    ? new Date(ingest.finishedAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:py-10">
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "mb-2 -ml-2 inline-flex")}>
            ← Companies
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
          <p className="text-muted-foreground text-sm">
            {dsa.length} coding problems · {sd.length} system design prompts · {lld.length} LLD prompts
            {last ? (
              <>
                {" "}
                · Lists last updated: {last}
              </>
            ) : null}
          </p>
        </div>
      </div>
      </div>

      <Tabs defaultValue="dsa" className="space-y-4">
        <TabsList className="h-auto w-full justify-start rounded-lg border bg-muted/50 p-1">
          <TabsTrigger value="dsa">DSA problems</TabsTrigger>
          <TabsTrigger value="sd">System design</TabsTrigger>
          <TabsTrigger value="lld">
            LLD
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dsa" className="pt-4">
          <ProblemTable problems={dsa} companySlug={company.slug} />
        </TabsContent>
        <TabsContent value="sd" className="pt-4">
          <SdTable problems={sd} companySlug={company.slug} />
        </TabsContent>
        <TabsContent value="lld" className="pt-4">
          <LldTable problems={lld} companySlug={company.slug} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
