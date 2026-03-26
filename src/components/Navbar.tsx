"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { ApiKeySettings } from "@/components/ApiKeySettings";

export function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0">
        <Link href="/" className="shrink-0">
          <p className="text-foreground text-base font-semibold tracking-tight">Interview Prep Portal</p>
          <p className="text-muted-foreground text-xs">DSA · HLD · LLD</p>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 sm:ml-auto sm:flex-nowrap sm:justify-end sm:gap-1.5">
          <div className="flex flex-wrap items-center gap-1">
            <Link
              href="/system-design"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "text-foreground h-9 px-3 whitespace-nowrap",
              )}
            >
              System Design
            </Link>
            <Link
              href="/lld"
              className={cn(buttonVariants({ variant: "ghost" }), "text-foreground h-9 px-3 whitespace-nowrap")}
            >
              LLD
            </Link>
          </div>
          <div className="mx-1 hidden h-6 w-px shrink-0 bg-border sm:block" aria-hidden />
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground relative size-8 shrink-0 overflow-hidden"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="pointer-events-none absolute inset-0 m-auto h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="pointer-events-none absolute inset-0 m-auto h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            </Button>
            <ApiKeySettings />
          </div>
        </nav>
      </div>
    </header>
  );
}
