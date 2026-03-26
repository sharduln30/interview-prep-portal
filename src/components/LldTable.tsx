"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LldProblemRow } from "@/types";

type Props = {
  problems: LldProblemRow[];
  companySlug?: string;
};

type SortKey = "title" | "difficulty";

export function LldTable({ problems, companySlug }: Props) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("title");

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    const rows = qq
      ? problems.filter((p) => p.title.toLowerCase().includes(qq) || p.slug.includes(qq))
      : [...problems];
    rows.sort((a, b) => {
      if (sort === "difficulty") return (a.difficulty ?? "").localeCompare(b.difficulty ?? "");
      return a.title.localeCompare(b.title);
    });
    return rows;
  }, [problems, q, sort]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search prompts…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9 h-9" />
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="difficulty">Difficulty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="hidden sm:block rounded-xl border border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold">Prompt</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Difficulty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.slug} className="group hover:bg-muted/30 transition-colors">
                <TableCell>
                  <Link
                    href={`/lld/${p.slug}${companySlug ? `?from=${companySlug}` : ""}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {p.title}
                  </Link>
                </TableCell>
                <TableCell>
                  {p.category ? (
                    <Badge variant="outline" className="text-xs border-border/60">{p.category}</Badge>
                  ) : "—"}
                </TableCell>
                <TableCell><DifficultyBadge difficulty={p.difficulty} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 sm:hidden">
        {filtered.map((p) => (
          <Link
            key={p.slug}
            href={`/lld/${p.slug}${companySlug ? `?from=${companySlug}` : ""}`}
            className="rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/20"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium text-sm">{p.title}</span>
              <DifficultyBadge difficulty={p.difficulty} />
            </div>
            {p.category && <p className="mt-1.5 text-xs text-muted-foreground">{p.category}</p>}
          </Link>
        ))}
      </div>

      <p className="text-muted-foreground text-xs">{filtered.length} LLD prompts</p>
    </div>
  );
}
