import type { SdInterviewMeta } from "@/types";

const genericDisclaimer =
  "These dates and stories are illustrative seed data for this demo app, aggregated from common interview themes — not verified single-source reports. Use Blind, Levels.fyi, company-specific forums, and your network for real-time signal.";

function meta(
  lastAskedSummary: string,
  dataAsOf: string,
  experiences: SdInterviewMeta["experiences"],
): SdInterviewMeta {
  return {
    lastAskedSummary,
    dataAsOf,
    experiences,
    disclaimer: genericDisclaimer,
  };
}

/** Curated defaults per prompt slug — extend via ingest/seed JSON later */
export const SD_INTERVIEW_DEFAULTS: Record<string, SdInterviewMeta> = {
  "url-shortener": meta(
    "Still a top phone-screen and onsite classic at many companies through 2024–2025.",
    "2025-03-01",
    [
      {
        id: "1",
        company: "Google",
        roleOrLevel: "L5",
        reportedAt: "2025-02-10",
        summary: "30m sketch: encoding, DB choice, redirect path, collision handling; follow-up on analytics.",
        source: "Typical loop pattern",
      },
      {
        id: "2",
        company: "Amazon",
        roleOrLevel: "SDE II",
        reportedAt: "2024-11-20",
        summary: "Emphasis on rate limits and abuse prevention; asked to extend to custom domains.",
        source: "Community-style template",
      },
    ],
  ),
  "ride-matching": meta(
    "Very common at Uber/Lyft-style companies and occasionally at Big Tech for geo/real-time roles.",
    "2025-03-01",
    [
      {
        id: "1",
        company: "Uber",
        roleOrLevel: "Senior",
        reportedAt: "2025-01-18",
        summary: "Matching service, supply/demand, surge as a discussion; deep dive on consistency vs latency.",
        source: "Typical loop pattern",
      },
    ],
  ),
  "news-feed": meta(
    "Frequently used at Meta and other social/adjacent companies for senior IC tracks.",
    "2025-03-01",
    [
      {
        id: "1",
        company: "Meta",
        roleOrLevel: "E5",
        reportedAt: "2024-12-05",
        summary: "Fan-out on write vs read, ranking stack, cache layers; trade-offs on stale reads.",
        source: "Typical loop pattern",
      },
    ],
  ),
  "distributed-cache": meta(
    "Infrastructure-heavy shops (Amazon, Microsoft, cloud providers) use variants often.",
    "2025-03-01",
    [
      {
        id: "1",
        company: "Microsoft",
        roleOrLevel: "63",
        reportedAt: "2024-10-12",
        summary: "Eviction, replication, split-brain; asked how to expose a Redis-like API safely.",
        source: "Community-style template",
      },
    ],
  ),
  "chat-system": meta(
    "Messaging and collaboration companies; also appears as a twist on notifications.",
    "2025-03-01",
    [
      {
        id: "1",
        company: "Google",
        roleOrLevel: "L4",
        reportedAt: "2025-02-22",
        summary: "WebSocket gateways, presence, message ordering, offline sync at high level.",
        source: "Typical loop pattern",
      },
    ],
  ),
  "video-streaming": meta(
    "Media and CDN-heavy interviews; Netflix-style breakdown remains a standard.",
    "2025-03-01",
    [
      {
        id: "1",
        company: "Netflix",
        roleOrLevel: "Senior",
        reportedAt: "2024-09-30",
        summary: "Encoding pipeline, CDN edge, playback QoS; scalability of metadata service.",
        source: "Typical loop pattern",
      },
    ],
  ),
  "web-crawler": meta(
    "Search and indexing teams; medium frequency compared to feeds or KV stores.",
    "2025-03-01",
    [
      {
        id: "1",
        company: "Amazon",
        roleOrLevel: "SDE II",
        reportedAt: "2024-08-14",
        summary: "Politeness, dedup, frontier queue, distributed crawl; bottleneck on parsing.",
        source: "Community-style template",
      },
    ],
  ),
  "rate-limiter": meta(
    "Extremely common API/gateway question across FAANG and startups (2023–2025).",
    "2025-03-01",
    [
      {
        id: "1",
        company: "Stripe",
        roleOrLevel: "L3",
        reportedAt: "2025-01-08",
        summary: "Token bucket vs sliding window; distributed counters and hot keys.",
        source: "Typical loop pattern",
      },
    ],
  ),
  "notification-system": meta(
    "Often paired with mobile or growth teams; steady frequency.",
    "2025-03-01",
    [
      {
        id: "1",
        company: "Uber",
        roleOrLevel: "L5",
        reportedAt: "2024-12-18",
        summary: "Multi-channel fan-out, retries, idempotency, preference store.",
        source: "Community-style template",
      },
    ],
  ),
  "search-autocomplete": meta(
    "Search ads and marketplace companies ask typeahead variants regularly.",
    "2025-03-01",
    [
      {
        id: "1",
        company: "Google",
        roleOrLevel: "L5",
        reportedAt: "2025-02-01",
        summary: "Trie + ranking, prefix serving, personalization hooks, latency SLO.",
        source: "Typical loop pattern",
      },
    ],
  ),
  "payment-system": meta(
    "Fintech and super-apps; harder depth on consistency and reconciliation.",
    "2025-03-01",
    [
      {
        id: "1",
        company: "Apple",
        roleOrLevel: "ICT4",
        reportedAt: "2024-11-02",
        summary: "Ledger model, idempotent charges, dispute flow sketch.",
        source: "Community-style template",
      },
    ],
  ),
  "file-storage": meta(
    "Storage and sync products; Dropbox-style remains a canonical reference.",
    "2025-03-01",
    [
      {
        id: "1",
        company: "Microsoft",
        roleOrLevel: "63",
        reportedAt: "2024-10-28",
        summary: "Chunking, dedup, sync conflicts, metadata service scaling.",
        source: "Typical loop pattern",
      },
    ],
  ),
  "ticket-booking": meta(
    "Concurrency and inventory fairness; common in e-commerce / events verticals.",
    "2025-03-01",
    [
      {
        id: "1",
        company: "Amazon",
        roleOrLevel: "SDE II",
        reportedAt: "2024-07-19",
        summary: "Seat holds, overselling prevention, payment timeout coupling.",
        source: "Community-style template",
      },
    ],
  ),
  "location-service": meta(
    "Maps and logistics; deep geo questions at Uber, Google, etc.",
    "2025-03-01",
    [
      {
        id: "1",
        company: "Google",
        roleOrLevel: "L5",
        reportedAt: "2025-01-25",
        summary: "Tile serving, routing service boundaries, offline maps discussion.",
        source: "Typical loop pattern",
      },
    ],
  ),
  "metrics-monitoring": meta(
    "Observability is hot for platform/SRE-leaning loops (2024–2025).",
    "2025-03-01",
    [
      {
        id: "1",
        company: "Datadog",
        roleOrLevel: "Staff",
        reportedAt: "2024-12-12",
        summary: "Ingest path, cardinality explosion, query engine, retention tiers.",
        source: "Typical loop pattern",
      },
    ],
  ),
};

export function interviewMetaForSlug(slug: string): SdInterviewMeta {
  return (
    SD_INTERVIEW_DEFAULTS[slug] ??
    meta(
      "This design pattern appears regularly in senior system design interviews (exact frequency varies by company and quarter).",
      "2025-03-01",
      [
        {
          id: "1",
          company: "Various",
          roleOrLevel: "Senior IC",
          reportedAt: "2025-02-01",
          summary: "Expect requirements → APIs → storage → scaling → trade-offs; timebox to 45 minutes.",
          source: "Generic template",
        },
      ],
    )
  );
}
