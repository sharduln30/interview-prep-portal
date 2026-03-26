import { NextRequest, NextResponse } from "next/server";
import { fetchProblemBySlug } from "@/lib/leetcode/client";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }
  const problem = await fetchProblemBySlug(slug);
  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }
  return NextResponse.json(problem);
}
