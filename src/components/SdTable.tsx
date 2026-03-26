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
    if (category !== "all") {
      rows = rows.filter((p) => p.category === category);
    }
    if (onlyNew) {
      rows = rows.filter((p) => isNewItem(p.firstSeenAt));
    }
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
        <div className="space-y-1">
          <Label>Search</Label>
          <Input placeholder="Prompt" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Category</Label>
          <Select
            value={category}
            onValueChange={(v) => {
              if (v) setCategory(v);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
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
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="recent">Recently added</SelectItem>
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
              <TableHead>Prompt</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.slug}>
                <TableCell>
                  <Link
                    href={`/system-design/${p.slug}?from=${companySlug}`}
                    className="font-medium hover:underline"
                  >
                    {p.title}
                  </Link>
                  {isNewItem(p.firstSeenAt) ? (
                    <Badge variant="secondary" className="ml-2">
                      New
                    </Badge>
                  ) : null}
                </TableCell>
                <TableCell>{p.category ?? "—"}</TableCell>
                <TableCell>{p.difficulty ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-muted-foreground text-sm">{filtered.length} prompts for {companySlug}</p>
    </div>
  );
}
