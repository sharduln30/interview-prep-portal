import { getLatestSuccessfulIngest } from "@/lib/data/queries";

export function Footer() {
  const ingest = getLatestSuccessfulIngest();
  const last = ingest?.finishedAt
    ? new Date(ingest.finishedAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <footer className="border-t border-border/70 bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-center text-sm sm:text-left">
        <p className="text-muted-foreground">
          Problem and design lists refresh via ingest (daily cron or{" "}
          <code className="text-foreground rounded bg-background px-1 text-xs">pnpm ingest</code>).
        </p>
        <p className="text-muted-foreground">
          {last ? (
            <>
              Last successful sync: <span className="text-foreground font-medium">{last}</span>
            </>
          ) : (
            <>No ingest run yet. Seed data is used until first sync.</>
          )}
        </p>
      </div>
    </footer>
  );
}
