"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    if (topic !== "all") {
      rows = rows.filter((p) => p.topics.includes(topic));
    }
    if (difficulty !== "all") {
      rows = rows.filter((p) => p.difficulty === difficulty);
    }
    if (onlyNew) {
      rows = rows.filter((p) => isNewItem(p.firstSeenAt));
    }
    rows.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "difficulty")
        return (diffOrder[a.difficulty] ?? 9) - (diffOrder[b.difficulty] ?? 9);
      if (sort === "frequency") return (b.frequency ?? 0) - (a.frequency ?? 0);
      return b.firstSeenAt - a.firstSeenAt;
    });
    return rows;
  }, [problems, q, topic, difficulty, onlyNew, sort]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <Label>Search</Label>
          <Input placeholder="Title or slug" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Topic</Label>
          <Select
            value={topic}
            onValueChange={(v) => {
              if (v) setTopic(v);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All topics</SelectItem>
              {topics.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Difficulty</Label>
          <Select
            value={difficulty}
            onValueChange={(v) => {
              if (v) setDifficulty(v);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Sort</Label>
          <Select
            value={sort}
            onValueChange={(v) => {
              if (v) setSort(v as SortKey);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="frequency">Frequency</SelectItem>
              <SelectItem value="recent">Recently added</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} />
        New (last 7 days)
      </label>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Problem</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Topics</TableHead>
              <TableHead className="text-right">Freq</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.slug}>
                <TableCell>
                  <Link href={`/problem/${p.slug}?from=${companySlug}`} className="font-medium hover:underline">
                    {p.title}
                  </Link>
                  {isNewItem(p.firstSeenAt) ? (
                    <Badge variant="secondary" className="ml-2">
                      New
                    </Badge>
                  ) : null}
                </TableCell>
                <TableCell>{p.difficulty}</TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground text-xs">
                  {p.topics.join(", ")}
                </TableCell>
                <TableCell className="text-right">{p.frequency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-muted-foreground text-sm">{filtered.length} problems for {companySlug}</p>
    </div>
  );
}
