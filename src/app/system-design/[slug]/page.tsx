import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getSdBySlug } from "@/lib/data/queries";
import { SdDetailClient } from "./sd-detail-client";

type Props = { params: { slug: string } };

export default function SystemDesignDetailPage({ params }: Props) {
  const row = getSdBySlug(params.slug);
  if (!row) notFound();

  return (
    <Suspense fallback={<div className="text-muted-foreground mx-auto max-w-6xl px-4 py-10">Loading…</div>}>
      <SdDetailClient row={row} />
    </Suspense>
  );
}
