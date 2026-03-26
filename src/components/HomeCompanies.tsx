"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { CompanyCard } from "@/components/CompanyCard";
import { Input } from "@/components/ui/input";
import { staggerContainer, staggerItem } from "@/lib/motion";
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Company tracks</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Pick a company to view tagged DSA and design prompts.
          </p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search companies…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        key={q}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((c) => (
          <motion.div key={c.slug} variants={staggerItem}>
            <CompanyCard company={c} />
          </motion.div>
        ))}
      </motion.div>

      {!filtered.length && (
        <div className="text-muted-foreground rounded-xl border border-dashed px-6 py-12 text-center text-sm">
          No companies matched your search.
        </div>
      )}
    </div>
  );
}
