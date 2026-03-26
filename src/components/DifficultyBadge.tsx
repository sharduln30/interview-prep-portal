"use client";

import { cn } from "@/lib/utils";

const colors: Record<string, string> = {
  Easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
  Hard: "bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20",
};

export function DifficultyBadge({ difficulty }: { difficulty: string | null | undefined }) {
  if (!difficulty) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        colors[difficulty] ?? "bg-muted text-muted-foreground ring-border",
      )}
    >
      {difficulty}
    </span>
  );
}
