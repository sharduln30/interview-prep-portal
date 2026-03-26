"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AiProviderId } from "@/types";
import { DEFAULT_MODELS } from "@/lib/ai/providers";

type Props = {
  provider: AiProviderId;
  onProviderChange: (p: AiProviderId) => void;
  model: string;
  onModelChange: (m: string) => void;
};

const PROVIDERS: { id: AiProviderId; label: string }[] = [
  { id: "openai", label: "OpenAI" },
  { id: "groq", label: "Groq" },
  { id: "gemini", label: "Gemini" },
];

export function ModelSelector({ provider, onProviderChange, model, onModelChange }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label>Provider</Label>
        <Select
          value={provider}
          onValueChange={(v) => {
            if (!v) return;
            const p = v as AiProviderId;
            onProviderChange(p);
            onModelChange(DEFAULT_MODELS[p]);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROVIDERS.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Model</Label>
        <Input value={model} onChange={(e) => onModelChange(e.target.value)} placeholder="Model id" />
      </div>
    </div>
  );
}
