import { runIngest } from "@/lib/ingest/runner";

async function main() {
  const r = await runIngest();
  console.log("Ingest OK:", r);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
