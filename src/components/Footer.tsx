import { getLatestSuccessfulIngest } from "@/lib/data/queries";

export async function Footer() {
  const ingest = await getLatestSuccessfulIngest();
  const last = ingest?.finishedAt
    ? new Date(ingest.finishedAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <footer className="border-t border-border/40 bg-muted/20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-xs text-muted-foreground">
          Data refreshes via daily cron or{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono text-foreground">
            pnpm ingest
          </code>
        </p>
        <p className="text-xs text-muted-foreground">
          {last ? (
            <>
              Last sync: <span className="font-medium text-foreground">{last}</span>
            </>
          ) : (
            "Using seed data"
          )}
        </p>
      </div>
    </footer>
  );
}
