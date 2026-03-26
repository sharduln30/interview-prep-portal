"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { DesignMarkdownBody } from "@/components/DesignMarkdownBody";
import { readStoredKey } from "@/components/ApiKeySettings";

type ChatTurn = { role: "user" | "assistant"; content: string };

type Props = {
  title: string;
  context?: string;
};

export function SystemDesignViewer({ title, context }: Props) {
  const [provider, setProvider] = useState<AiProviderId>("anthropic");
  const [model, setModel] = useState(DEFAULT_MODELS.anthropic);
  const [mainDoc, setMainDoc] = useState("");
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [followUp, setFollowUp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runInitial = useCallback(async () => {
    const apiKey = readStoredKey(provider);
    if (!apiKey) {
      setError(`Add your ${provider} API key in the navbar.`);
      return;
    }
    setError(null);
    setMainDoc("");
    setHistory([]);
    setLoading(true);
    try {
      const res = await fetch("/api/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey,
          model,
          title,
          context,
        }),
      });
      if (!res.ok) {
        setError(await res.text());
        setLoading(false);
        return;
      }
      let acc = "";
      await consumeSseJsonStream(res, {
        onText: (t) => {
          acc += t;
          setMainDoc(acc);
        },
        onDone: () => {
          setLoading(false);
          setHistory([{ role: "assistant", content: acc }]);
        },
        onError: (m) => {
          setError(m);
          setLoading(false);
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
    }
  }, [provider, model, title, context]);

  const sendFollowUp = useCallback(async () => {
    const text = followUp.trim();
    if (!text || !mainDoc) return;
    const apiKey = readStoredKey(provider);
    if (!apiKey) {
      setError(`Add your ${provider} API key.`);
      return;
    }
    setError(null);
    setFollowUp("");
    const nextHistory: ChatTurn[] = [...history, { role: "user", content: text }];
    setHistory(nextHistory);
    setLoading(true);
    let acc = "";
    try {
      const messages = nextHistory.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey,
          model,
          title,
          messages,
        }),
      });
      if (!res.ok) {
        setError(await res.text());
        setLoading(false);
        return;
      }
      await consumeSseJsonStream(res, {
        onText: (t) => {
          acc += t;
        },
        onDone: () => {
          setHistory((h) => [...h, { role: "assistant", content: acc }]);
          setLoading(false);
        },
        onError: (m) => {
          setError(m);
          setLoading(false);
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
    }
  }, [followUp, mainDoc, history, provider, model, title]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-lg border p-4">
        <h2 className="text-lg font-semibold">AI system design</h2>
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
            <Label>Model</Label>
            <input
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={runInitial} disabled={loading}>
          {loading && !mainDoc ? "Generating…" : mainDoc ? "Regenerate full design" : "Generate design"}
        </Button>
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>

      <ScrollArea className="h-[min(65vh,560px)] rounded-md border p-4">
        {loading && !mainDoc && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
          </div>
        )}
        {mainDoc ? (
          <DesignMarkdownBody content={mainDoc} className="prose prose-sm dark:prose-invert max-w-none" />
        ) : null}
      </ScrollArea>

      {history.length > 0 && (
        <div className="space-y-3 rounded-lg border p-4">
          <h3 className="font-medium">Discussion</h3>
          <div className="max-h-64 space-y-3 overflow-y-auto text-sm">
            {history.slice(1).map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user" ? "bg-muted/50 rounded-md p-2" : "border-l-2 pl-3"
                }
              >
                <p className="text-muted-foreground text-xs font-semibold uppercase">{m.role}</p>
                <DesignMarkdownBody content={m.content} className="prose prose-sm dark:prose-invert max-w-none" />
              </div>
            ))}
          </div>
          <Textarea
            placeholder="Follow-up (e.g. How would you shard this?)"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            rows={3}
          />
          <Button onClick={sendFollowUp} disabled={loading || !followUp.trim()}>
            {loading && mainDoc ? "Thinking…" : "Send follow-up"}
          </Button>
        </div>
      )}
    </div>
  );
}
