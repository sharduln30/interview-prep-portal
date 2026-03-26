"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Company } from "@/types";

type Props = {
  company: Company & { dsaCount: number; sdCount: number; lldCount: number };
};

export function CompanyCard({ company }: Props) {
  const total = company.dsaCount + company.sdCount + company.lldCount;

  return (
    <Link href={`/company/${company.slug}`} className="group block">
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-5 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
      >
        <div className="flex items-start gap-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm"
            style={{ backgroundColor: company.accent ?? "#6366f1" }}
          >
            {company.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold group-hover:text-primary transition-colors">
              {company.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {total} problem{total !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {company.dsaCount > 0 && (
            <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
              {company.dsaCount} DSA
            </span>
          )}
          {company.sdCount > 0 && (
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
              {company.sdCount} HLD
            </span>
          )}
          {company.lldCount > 0 && (
            <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20">
              {company.lldCount} LLD
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
