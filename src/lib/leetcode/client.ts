import type { LeetCodeProblemDetail } from "@/types";

const LEETCODE_GQL = "https://leetcode.com/graphql";

const TOPIC_TAG_QUERY = `
query topicTag($slug: String!) {
  topicTag(slug: $slug) {
    name
    questions {
      difficulty
      title
      titleSlug
      isPaidOnly
    }
  }
}`;

const PROBLEM_QUERY = `
query questionData($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionId
    title
    titleSlug
    difficulty
    content
    topicTags { name slug }
    codeSnippets { lang langSlug code }
  }
}`;

type TopicQuestion = {
  difficulty: string;
  title: string;
  titleSlug: string;
  isPaidOnly: boolean;
};

export async function fetchTopicTagProblems(tagSlug: string): Promise<TopicQuestion[]> {
  const res = await fetch(LEETCODE_GQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "InterviewPrepPortal/1.0 (educational)",
    },
    body: JSON.stringify({
      query: TOPIC_TAG_QUERY,
      variables: { slug: tagSlug },
    }),
  });
  if (!res.ok) {
    return [];
  }
  const json = (await res.json()) as {
    data?: { topicTag?: { questions?: TopicQuestion[] } | null };
    errors?: unknown;
  };
  const qs = json.data?.topicTag?.questions;
  if (!qs) return [];
  return qs.filter((q) => !q.isPaidOnly);
}

export async function fetchProblemBySlug(titleSlug: string): Promise<LeetCodeProblemDetail | null> {
  const res = await fetch(LEETCODE_GQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "InterviewPrepPortal/1.0 (educational)",
    },
    body: JSON.stringify({
      query: PROBLEM_QUERY,
      variables: { titleSlug },
    }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    data?: {
      question?: {
        title: string;
        titleSlug: string;
        difficulty: string;
        content: string;
        topicTags: { name: string; slug: string }[];
        codeSnippets: { lang: string; langSlug: string; code: string }[];
      } | null;
    };
  };
  const q = json.data?.question;
  if (!q) return null;
  return {
    title: q.title,
    titleSlug: q.titleSlug,
    difficulty: q.difficulty,
    content: q.content,
    topicTags: q.topicTags.map((t) => t.name),
    codeSnippets: q.codeSnippets.map((c) => ({ lang: c.lang, code: c.code })),
  };
}
