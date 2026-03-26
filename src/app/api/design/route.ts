import { z } from "zod";
import { designSystemPrompt } from "@/lib/ai/prompts";
import { DEFAULT_MODELS, encodeSse, streamChat, type ChatMessage } from "@/lib/ai/providers";
import type { AiProviderId } from "@/types";

export const runtime = "nodejs";

const msgSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const bodySchema = z.object({
  provider: z.enum(["openai", "groq", "gemini", "anthropic"]),
  apiKey: z.string().min(8),
  model: z.string().optional(),
  title: z.string(),
  context: z.string().optional(),
  messages: z.array(msgSchema).optional(),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400 });
  }

  const { provider, apiKey, title, context, messages: prior } = parsed.data;
  const model = parsed.data.model || DEFAULT_MODELS[provider as AiProviderId];

  const messages: ChatMessage[] = [{ role: "system", content: designSystemPrompt }];

  if (prior && prior.length > 0) {
    if (prior[0].role === "assistant") {
      messages.push({
        role: "user",
        content: `Original system design question: **${title}**`,
      });
    }
    for (const m of prior) {
      messages.push({ role: m.role, content: m.content });
    }
  } else {
    messages.push({
      role: "user",
      content: `Design the following system at a senior interview depth.\n\n**${title}**${context ? `\n\nExtra context:\n${context}` : ""}`,
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const gen = streamChat(provider as AiProviderId, apiKey, model, messages);
        for await (const chunk of gen) {
          controller.enqueue(encodeSse({ text: chunk }));
        }
        controller.enqueue(encodeSse({ done: true }));
        controller.close();
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        controller.enqueue(encodeSse({ error: msg }));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
