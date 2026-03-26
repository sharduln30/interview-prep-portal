import type { ChatMessage } from "./providers";

export async function* streamAnthropicChat(params: {
  apiKey: string;
  model?: string;
  messages: ChatMessage[];
}): AsyncGenerator<string> {
  const systemParts = params.messages.filter((m) => m.role === "system");
  const rest = params.messages.filter((m) => m.role !== "system");
  const system = systemParts.map((m) => m.content).join("\n\n");

  const anthropicMessages = rest.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": params.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: params.model ?? "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      stream: true,
      system,
      messages: anthropicMessages,
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Anthropic error ${res.status}: ${t.slice(0, 500)}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const raw = trimmed.slice(5).trim();
      if (raw === "[DONE]") return;
      try {
        const json = JSON.parse(raw) as {
          type?: string;
          delta?: { type?: string; text?: string };
        };
        if (json.type === "content_block_delta" && json.delta?.type === "text_delta" && json.delta.text) {
          yield json.delta.text;
        }
      } catch {
        /* ignore non-JSON lines */
      }
    }
  }
}
