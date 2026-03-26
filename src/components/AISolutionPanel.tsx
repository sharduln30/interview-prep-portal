"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { AiProviderId } from "@/types";
import { DEFAULT_MODELS } from "@/lib/ai/providers";
import { consumeSseJsonStream } from "@/lib/sse-parse";
import { MarkdownBody } from "@/components/MarkdownBody";
import { readStoredKey } from "@/components/ApiKeySettings";

const LANGS = ["python", "java", "cpp", "javascript"] as const;

type Props = {
  title: string;
  problemPlainText: string;
};

export function AISolutionPanel({ title, problemPlainText }: Props) {
  const [provider, setProvider] = useState<AiProviderId>("openai");
  const [model, setModel] = useState(DEFAULT_MODELS.openai);
  const [language, setLanguage] = useState<string>("python");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canRun = useMemo(() => problemPlainText.length >= 10, [problemPlainText]);

  const run = useCallback(async () => {
    const apiKey = readStoredKey(provider);
    if (!apiKey) {
      setError(`Add your ${provider} API key in the key icon (navbar).`);
      return;
    }
    setError(null);
    setOutput("");
    setLoading(true);
    try {
      const res = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey,
          model,
          language,
          title,
          problemMarkdown: problemPlainText,
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        setError(t || `HTTP ${res.status}`);
        setLoading(false);
        return;
      }
      await consumeSseJsonStream(res, {
        onText: (t) => setOutput((prev) => prev + t),
        onDone: () => setLoading(false),
        onError: (m) => {
          setError(m);
          setLoading(false);
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
    }
  }, [provider, model, language, title, problemPlainText]);

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <h2 className="text-lg font-semibold">AI solution</h2>
      <p className="text-muted-foreground text-sm">
        Choose provider and language, then generate a step-by-step solution. Keys are stored in your browser only.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Provider</Label>
          <Select
            value={provider}
            onValueChange={(v) => {
              if (!v) return;
              const p = v as AiProviderId;
              setProvider(p);
              setModel(DEFAULT_MODELS[p]);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anthropic">Claude (Anthropic)</SelectItem>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="groq">Groq</SelectItem>
              <SelectItem value="gemini">Gemini</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Language</Label>
          <Select
            value={language}
            onValueChange={(v) => {
              if (v) setLanguage(v);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Model override</Label>
        <input
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
      </div>

      <Button onClick={run} disabled={loading || !canRun}>
        {loading ? "Generating…" : "Generate solution"}
      </Button>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <ScrollArea className="h-[min(70vh,640px)] rounded-md border p-3">
        {loading && !output && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}
        {output ? <MarkdownBody content={output} className="prose prose-sm dark:prose-invert max-w-none" /> : null}
      </ScrollArea>
    </div>
  );
}
