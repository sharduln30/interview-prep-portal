import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Company } from "@/types";

type Props = {
  company: Company & { dsaCount: number; sdCount: number; lldCount: number };
};

export function CompanyCard({ company }: Props) {
  return (
    <Link href={`/company/${company.slug}`}>
      <Card className="h-full border-border/80 transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-muted/40">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white shadow-sm"
            style={{ backgroundColor: company.accent }}
          >
            {company.name.slice(0, 2).toUpperCase()}
          </div>
          <CardTitle className="text-lg">{company.name}</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          <p>
            {company.dsaCount} DSA · {company.sdCount} HLD · {company.lldCount} LLD
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
