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
import type { SdProblemRow } from "@/types";
import { isNewItem } from "@/lib/ingest/diff";

type SortKey = "title" | "category" | "recent";

type Props = {
  problems: SdProblemRow[];
  companySlug: string;
};

export function SdTable({ problems, companySlug }: Props) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [onlyNew, setOnlyNew] = useState(false);
  const [sort, setSort] = useState<SortKey>("title");

  const categories = useMemo(() => {
    const s = new Set<string>();
    for (const p of problems) {
      if (p.category) s.add(p.category);
    }
    return Array.from(s).sort();
  }, [problems]);

  const filtered = useMemo(() => {
    let rows = [...problems];
    if (q.trim()) {
      const qq = q.toLowerCase();
      rows = rows.filter((p) => p.title.toLowerCase().includes(qq) || p.slug.includes(qq));
    }
    if (category !== "all") rows = rows.filter((p) => p.category === category);
    if (onlyNew) rows = rows.filter((p) => isNewItem(p.firstSeenAt));
    rows.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "category") return (a.category ?? "").localeCompare(b.category ?? "");
      return b.firstSeenAt - a.firstSeenAt;
    });
    return rows;
  }, [problems, q, category, onlyNew, sort]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search prompts…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9 h-9" />
        </div>
        <Select value={category} onValueChange={(v) => { if (v) setCategory(v); }}>
          <SelectTrigger className="h-9"><SelectValue placeholder="All categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => { if (v) setSort(v as SortKey); }}>
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="recent">Recently added</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
        <input
          type="checkbox"
          checked={onlyNew}
          onChange={(e) => setOnlyNew(e.target.checked)}
          className="rounded border-border accent-primary"
        />
        New (last 7 days)
      </label>

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
                  <Link href={`/system-design/${p.slug}?from=${companySlug}`} className="font-medium hover:text-primary transition-colors">
                    {p.title}
                  </Link>
                  {isNewItem(p.firstSeenAt) && (
                    <Badge className="ml-2 bg-primary/10 text-primary hover:bg-primary/10 text-[10px] px-1.5">New</Badge>
                  )}
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
            href={`/system-design/${p.slug}?from=${companySlug}`}
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

      <p className="text-muted-foreground text-xs">{filtered.length} of {problems.length} prompts</p>
    </div>
  );
}
