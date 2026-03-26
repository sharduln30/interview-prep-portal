"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
        <div className="space-y-1">
          <Label>Search</Label>
          <Input placeholder="Prompt title" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Sort</Label>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
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
                    href={`/lld/${p.slug}${companySlug ? `?from=${companySlug}` : ""}`}
                    className="font-medium hover:underline"
                  >
                    {p.title}
                  </Link>
                </TableCell>
                <TableCell>{p.category ?? "—"}</TableCell>
                <TableCell>{p.difficulty ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-muted-foreground text-sm">{filtered.length} LLD prompts</p>
    </div>
  );
}

