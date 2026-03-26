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
import type { DsaProblemRow } from "@/types";
import { isNewItem } from "@/lib/ingest/diff";

type SortKey = "title" | "difficulty" | "frequency" | "recent";

type Props = {
  problems: DsaProblemRow[];
  companySlug: string;
};

const diffOrder: Record<string, number> = { Easy: 0, Medium: 1, Hard: 2 };

export function ProblemTable({ problems, companySlug }: Props) {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [onlyNew, setOnlyNew] = useState(false);
  const [sort, setSort] = useState<SortKey>("frequency");

  const topics = useMemo(() => {
    const s = new Set<string>();
    for (const p of problems) for (const t of p.topics) s.add(t);
    return Array.from(s).sort();
  }, [problems]);

  const filtered = useMemo(() => {
    let rows = [...problems];
    if (q.trim()) {
      const qq = q.toLowerCase();
      rows = rows.filter((p) => p.title.toLowerCase().includes(qq) || p.slug.includes(qq));
    }
    if (topic !== "all") rows = rows.filter((p) => p.topics.includes(topic));
    if (difficulty !== "all") rows = rows.filter((p) => p.difficulty === difficulty);
    if (onlyNew) rows = rows.filter((p) => isNewItem(p.firstSeenAt));
    rows.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "difficulty") return (diffOrder[a.difficulty] ?? 9) - (diffOrder[b.difficulty] ?? 9);
      if (sort === "frequency") return (b.frequency ?? 0) - (a.frequency ?? 0);
      return b.firstSeenAt - a.firstSeenAt;
    });
    return rows;
  }, [problems, q, topic, difficulty, onlyNew, sort]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search problems…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9 h-9" />
        </div>
        <Select value={topic} onValueChange={(v) => { if (v) setTopic(v); }}>
          <SelectTrigger className="h-9"><SelectValue placeholder="All topics" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All topics</SelectItem>
            {topics.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={(v) => { if (v) setDifficulty(v); }}>
          <SelectTrigger className="h-9"><SelectValue placeholder="All difficulties" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All difficulties</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => { if (v) setSort(v as SortKey); }}>
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="frequency">Frequency</SelectItem>
            <SelectItem value="recent">Recently added</SelectItem>
            <SelectItem value="difficulty">Difficulty</SelectItem>
            <SelectItem value="title">Title</SelectItem>
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
              <TableHead className="font-semibold">Problem</TableHead>
              <TableHead className="font-semibold">Difficulty</TableHead>
              <TableHead className="font-semibold">Topics</TableHead>
              <TableHead className="text-right font-semibold">Freq</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.slug} className="group hover:bg-muted/30 transition-colors">
                <TableCell>
                  <Link href={`/problem/${p.slug}?from=${companySlug}`} className="font-medium hover:text-primary transition-colors">
                    {p.title}
                  </Link>
                  {isNewItem(p.firstSeenAt) && (
                    <Badge className="ml-2 bg-primary/10 text-primary hover:bg-primary/10 text-[10px] px-1.5">New</Badge>
                  )}
                </TableCell>
                <TableCell><DifficultyBadge difficulty={p.difficulty} /></TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground text-xs">{p.topics.join(", ")}</TableCell>
                <TableCell className="text-right tabular-nums">{p.frequency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 sm:hidden">
        {filtered.map((p) => (
          <Link
            key={p.slug}
            href={`/problem/${p.slug}?from=${companySlug}`}
            className="rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/20"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium text-sm">{p.title}</span>
              <DifficultyBadge difficulty={p.difficulty} />
            </div>
            {p.topics.length > 0 && (
              <p className="mt-1.5 text-xs text-muted-foreground truncate">{p.topics.join(", ")}</p>
            )}
          </Link>
        ))}
      </div>

      <p className="text-muted-foreground text-xs">{filtered.length} of {problems.length} problems</p>
    </div>
  );
}
