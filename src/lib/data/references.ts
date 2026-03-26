import type { DsaProblemSeed, ReferenceLink, SdProblemSeed } from "@/types";

const dsaSpecificReferences: Record<string, ReferenceLink[]> = {
  "two-sum": [
    {
      type: "solution",
      sourceKind: "video",
      title: "NeetCode - Two Sum",
      url: "https://www.youtube.com/watch?v=KLlXCFG5TnA",
      topicTags: ["array", "hash-table"],
      difficulty: "Beginner",
      qualityScore: 9,
    },
    {
      type: "deep-dive",
      sourceKind: "blog",
      title: "LeetCode 1. Two Sum editorial",
      url: "https://leetcode.com/problems/two-sum/editorial/",
      topicTags: ["hash-table"],
      difficulty: "Beginner",
      qualityScore: 8,
    },
  ],
  "lru-cache": [
    {
      type: "solution",
      sourceKind: "video",
      title: "NeetCode - LRU Cache",
      url: "https://www.youtube.com/watch?v=7ABFKPK2hD4",
      topicTags: ["design", "linked-list", "hash-table"],
      difficulty: "Intermediate",
      qualityScore: 9,
    },
    {
      type: "deep-dive",
      sourceKind: "blog",
      title: "LRU cache design notes (GFG)",
      url: "https://www.geeksforgeeks.org/lru-cache-implementation/",
      topicTags: ["design", "cache"],
      difficulty: "Intermediate",
      qualityScore: 8,
    },
  ],
  "minimum-window-substring": [
    {
      type: "solution",
      sourceKind: "video",
      title: "NeetCode - Minimum Window Substring",
      url: "https://www.youtube.com/watch?v=jSto0O4AJbM",
      topicTags: ["sliding-window", "string"],
      difficulty: "Advanced",
      qualityScore: 9,
    },
  ],
};

const sdSpecificReferences: Record<string, ReferenceLink[]> = {
  "url-shortener": [
    {
      type: "deep-dive",
      sourceKind: "blog",
      title: "System Design Primer - URL shortener",
      url: "https://github.com/donnemartin/system-design-primer#design-a-url-shortener",
      topicTags: ["storage", "api"],
      difficulty: "Intermediate",
      qualityScore: 9,
    },
    {
      type: "solution",
      sourceKind: "video",
      title: "Gaurav Sen - TinyURL system design",
      url: "https://www.youtube.com/watch?v=JQDHz72OA3c",
      topicTags: ["url-shortener"],
      difficulty: "Intermediate",
      qualityScore: 9,
    },
  ],
  "news-feed": [
    {
      type: "deep-dive",
      sourceKind: "blog",
      title: "System Design Primer - Design Facebook news feed",
      url: "https://github.com/donnemartin/system-design-primer#design-the-facebook-news-feed-function",
      topicTags: ["feed", "ranking"],
      difficulty: "Advanced",
      qualityScore: 9,
    },
  ],
  "chat-system": [
    {
      type: "deep-dive",
      sourceKind: "video",
      title: "Design WhatsApp - Hussein Nasser",
      url: "https://www.youtube.com/watch?v=vvhC64hQZMk",
      topicTags: ["messaging", "realtime"],
      difficulty: "Advanced",
      qualityScore: 8,
    },
  ],
};

const genericDsa: ReferenceLink[] = [
  {
    type: "problem",
    sourceKind: "docs",
    title: "LeetCode editorial",
    url: "https://leetcode.com/problemset/",
    topicTags: ["leetcode"],
    difficulty: "Beginner",
    qualityScore: 7,
  },
  {
    type: "deep-dive",
    sourceKind: "video",
    title: "NeetCode roadmap",
    url: "https://neetcode.io/roadmap",
    topicTags: ["interview-prep"],
    difficulty: "Intermediate",
    qualityScore: 9,
  },
];

const genericSd: ReferenceLink[] = [
  {
    type: "deep-dive",
    sourceKind: "blog",
    title: "System Design Primer",
    url: "https://github.com/donnemartin/system-design-primer",
    topicTags: ["hld"],
    difficulty: "Intermediate",
    qualityScore: 10,
  },
  {
    type: "deep-dive",
    sourceKind: "video",
    title: "Grokking modern system design talks",
    url: "https://www.youtube.com/@ByteByteGo",
    topicTags: ["hld"],
    difficulty: "Intermediate",
    qualityScore: 8,
  },
];

export function refsForDsa(seed: DsaProblemSeed): ReferenceLink[] {
  const specific = dsaSpecificReferences[seed.slug] ?? [];
  return [...specific, ...genericDsa];
}

export function refsForSd(seed: SdProblemSeed): ReferenceLink[] {
  const specific = sdSpecificReferences[seed.slug] ?? [];
  return [...specific, ...genericSd];
}

