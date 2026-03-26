"use client";

import { useMemo, useState } from "react";
import { CompanyCard } from "@/components/CompanyCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Company } from "@/types";

type Row = Company & { dsaCount: number; sdCount: number; lldCount: number };

export function HomeCompanies({ companies }: { companies: Row[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return companies;
    const qq = q.toLowerCase();
    return companies.filter((c) => c.name.toLowerCase().includes(qq) || c.slug.includes(qq));
  }, [companies, q]);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Company tracks</h2>
          <p className="text-muted-foreground text-sm">Pick a company to view tagged DSA and design prompts.</p>
        </div>
      </div>
      <div className="max-w-md space-y-2">
        <Label htmlFor="company-search">Find a company</Label>
        <Input
          id="company-search"
          placeholder="Uber, Google, Amazon…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <CompanyCard key={c.slug} company={c} />
        ))}
      </div>
      {!filtered.length ? (
        <div className="text-muted-foreground rounded-lg border border-dashed px-4 py-8 text-center text-sm">
          No companies matched your search.
        </div>
      ) : null}
    </div>
  );
}
