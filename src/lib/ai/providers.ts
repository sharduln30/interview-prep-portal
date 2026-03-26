import type { AiProviderId } from "@/types";
import { streamAnthropicChat } from "./anthropic";
import { streamGeminiChat } from "./gemini";
import { streamGroqChat } from "./groq";
import { streamOpenAiChat } from "./openai";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function* streamChat(
  provider: AiProviderId,
  apiKey: string,
  model: string | undefined,
  messages: ChatMessage[],
): AsyncGenerator<string> {
  switch (provider) {
    case "openai":
      yield* streamOpenAiChat({ apiKey, model, messages });
      break;
    case "groq":
      yield* streamGroqChat({ apiKey, model, messages });
      break;
    case "gemini":
      yield* streamGeminiChat({ apiKey, model, messages });
      break;
    case "anthropic":
      yield* streamAnthropicChat({ apiKey, model, messages });
      break;
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export const DEFAULT_MODELS: Record<AiProviderId, string> = {
  openai: "gpt-4o-mini",
  groq: "llama-3.3-70b-versatile",
  gemini: "gemini-1.5-flash",
  anthropic: "claude-3-5-sonnet-20241022",
};

export function encodeSse(data: object): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
}
