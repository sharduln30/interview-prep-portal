export async function* streamGeminiChat(params: {
  apiKey: string;
  model?: string;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
}): AsyncGenerator<string> {
  const model = params.model ?? "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(params.apiKey)}`;

  const system = params.messages.filter((m) => m.role === "system");
  const rest = params.messages.filter((m) => m.role !== "system");
  const systemInstruction =
    system.length > 0 ? { parts: [{ text: system.map((m) => m.content).join("\n") }] } : undefined;

  const contents = rest.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction,
      contents,
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gemini error ${res.status}: ${t.slice(0, 500)}`);
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
      const data = trimmed.slice(5).trim();
      try {
        const json = JSON.parse(data) as {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
        };
        const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("");
        if (text) yield text;
      } catch {
        /* skip */
      }
    }
  }
}
