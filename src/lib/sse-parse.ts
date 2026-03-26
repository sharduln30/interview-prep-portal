export async function consumeSseJsonStream(
  res: Response,
  handlers: {
    onText: (s: string) => void;
    onDone: () => void;
    onError: (message: string) => void;
  },
): Promise<void> {
  const reader = res.body?.getReader();
  if (!reader) {
    handlers.onError("No response body");
    handlers.onDone();
    return;
  }
  const decoder = new TextDecoder();
  let buffer = "";
  let completed = false;

  const finish = () => {
    if (completed) return;
    completed = true;
    handlers.onDone();
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";
    for (const block of chunks) {
      for (const line of block.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const raw = trimmed.slice(5).trim();
        try {
          const data = JSON.parse(raw) as { text?: string; done?: boolean; error?: string };
          if (data.error) {
            handlers.onError(data.error);
            finish();
            return;
          }
          if (data.text) handlers.onText(data.text);
          if (data.done) finish();
        } catch {
          /* ignore */
        }
      }
    }
  }
  finish();
}
