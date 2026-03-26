import type { LldProblemSeed, ReferenceLink } from "@/types";

const specific: Record<string, ReferenceLink[]> = {
  "parking-lot": [
    {
      type: "deep-dive",
      sourceKind: "video",
      title: "Parking Lot LLD - Concept & class diagram",
      url: "https://www.youtube.com/watch?v=DSGsa0pu8-k",
      topicTags: ["ood", "uml"],
      difficulty: "Intermediate",
      qualityScore: 8,
    },
  ],
  "elevator-system": [
    {
      type: "deep-dive",
      sourceKind: "blog",
      title: "Elevator system design notes",
      url: "https://www.educative.io/courses/grokking-the-object-oriented-design-interview",
      topicTags: ["scheduling", "ood"],
      difficulty: "Advanced",
      qualityScore: 8,
    },
  ],
};

const generic: ReferenceLink[] = [
  {
    type: "deep-dive",
    sourceKind: "blog",
    title: "Refactoring Guru - Design patterns",
    url: "https://refactoring.guru/design-patterns/catalog",
    topicTags: ["design-patterns"],
    difficulty: "Intermediate",
    qualityScore: 9,
  },
  {
    type: "deep-dive",
    sourceKind: "video",
    title: "Object-oriented design interview playlist",
    url: "https://www.youtube.com/results?search_query=object+oriented+design+interview",
    topicTags: ["lld", "ood"],
    difficulty: "Intermediate",
    qualityScore: 7,
  },
];

export function refsForLld(seed: LldProblemSeed): ReferenceLink[] {
  return [...(specific[seed.slug] ?? []), ...generic];
}

