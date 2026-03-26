import { Suspense } from "react";
import { ProblemDetailClient } from "./problem-detail-client";
import { getDsaBySlug } from "@/lib/data/queries";

type Props = { params: { slug: string } };

export default async function ProblemPage({ params }: Props) {
  const row = await getDsaBySlug(params.slug);
  return (
    <Suspense
      fallback={<div className="text-muted-foreground mx-auto max-w-6xl px-4 py-10">Loading problem…</div>}
    >
      <ProblemDetailClient slug={params.slug} references={row?.references ?? []} />
    </Suspense>
  );
}
