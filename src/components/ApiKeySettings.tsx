"use client";

import { KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AiProviderId } from "@/types";

const KEYS: { id: AiProviderId; label: string; hint: string }[] = [
  { id: "openai", label: "OpenAI", hint: "https://platform.openai.com/api-keys" },
  { id: "anthropic", label: "Anthropic (Claude)", hint: "https://console.anthropic.com/settings/keys" },
  { id: "groq", label: "Groq", hint: "https://console.groq.com" },
  { id: "gemini", label: "Google Gemini", hint: "https://aistudio.google.com/apikey" },
];

const STORAGE_PREFIX = "ipp_api_key_";

export function readStoredKey(provider: AiProviderId): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(STORAGE_PREFIX + provider) ?? "";
}

export function ApiKeySettings() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<AiProviderId, string>>({
    openai: "",
    anthropic: "",
    groq: "",
    gemini: "",
  });

  useEffect(() => {
    setValues({
      openai: readStoredKey("openai"),
      anthropic: readStoredKey("anthropic"),
      groq: readStoredKey("groq"),
      gemini: readStoredKey("gemini"),
    });
  }, [open]);

  function save() {
    for (const k of KEYS) {
      const v = values[k.id].trim();
      if (v) localStorage.setItem(STORAGE_PREFIX + k.id, v);
      else localStorage.removeItem(STORAGE_PREFIX + k.id);
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="API keys" />}>
        <KeyRound className="h-5 w-5" />
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API keys (BYOK)</DialogTitle>
          <DialogDescription>
            Keys stay in your browser&apos;s localStorage. They are sent only to this app&apos;s API routes,
            which forward requests to the provider you select. Nothing is stored on our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          {KEYS.map((k) => (
            <div key={k.id} className="space-y-2">
              <Label htmlFor={k.id}>{k.label}</Label>
              <Input
                id={k.id}
                type="password"
                autoComplete="off"
                placeholder={`Paste ${k.label} key`}
                value={values[k.id]}
                onChange={(e) => setValues((prev) => ({ ...prev, [k.id]: e.target.value }))}
              />
              <p className="text-muted-foreground text-xs">
                Get a key:{" "}
                <a href={k.hint} className="underline" target="_blank" rel="noreferrer">
                  {k.hint}
                </a>
              </p>
            </div>
          ))}
          <Button type="button" onClick={save}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
