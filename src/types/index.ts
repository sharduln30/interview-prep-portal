export type Company = {
  slug: string;
  name: string;
  /** LeetCode topic tag slug (e.g. `facebook` for Meta) */
  leetcodeTag: string;
  accent: string;
};

export type DsaProblemSeed = {
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
  companies: string[];
  frequency?: number;
  references?: ReferenceLink[];
};

export type SdInterviewExperience = {
  id: string;
  company: string;
  roleOrLevel?: string;
  reportedAt: string;
  summary: string;
  source?: string;
};

export type SdInterviewMeta = {
  lastAskedSummary: string;
  dataAsOf: string;
  experiences: SdInterviewExperience[];
  disclaimer: string;
};

export type SdProblemSeed = {
  slug: string;
  title: string;
  companies: string[];
  category: string;
  difficulty?: string;
  interviewMeta?: SdInterviewMeta;
  references?: ReferenceLink[];
};

export type LldProblemSeed = {
  slug: string;
  title: string;
  companies: string[];
  category: string;
  difficulty?: string;
  prompt: string;
  solutionMarkdown: string;
  references?: ReferenceLink[];
};

export type ReferenceLink = {
  type: "problem" | "solution" | "deep-dive";
  sourceKind: "blog" | "video" | "docs";
  title: string;
  url: string;
  topicTags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  qualityScore: number;
};

export type DsaProblemRow = {
  slug: string;
  title: string;
  difficulty: string;
  topics: string[];
  companies: string[];
  frequency: number;
  references: ReferenceLink[];
  firstSeenAt: number;
  lastSeenAt: number;
};

export type SdProblemRow = {
  slug: string;
  title: string;
  companies: string[];
  category: string | null;
  difficulty: string | null;
  interviewMeta: SdInterviewMeta;
  references: ReferenceLink[];
  firstSeenAt: number;
  lastSeenAt: number;
};

export type LldProblemRow = {
  slug: string;
  title: string;
  companies: string[];
  category: string | null;
  difficulty: string | null;
  prompt: string;
  solutionMarkdown: string;
  references: ReferenceLink[];
  firstSeenAt: number;
  lastSeenAt: number;
};

export type IngestRunRow = {
  id: number;
  startedAt: number;
  finishedAt: number | null;
  source: string;
  dsaCount: number;
  sdCount: number;
  lldCount: number;
  status: string;
  error: string | null;
};

export type AiProviderId = "openai" | "groq" | "gemini" | "anthropic";

export type LeetCodeProblemDetail = {
  title: string;
  titleSlug: string;
  difficulty: string;
  content: string;
  topicTags: string[];
  codeSnippets: { lang: string; code: string }[];
};
