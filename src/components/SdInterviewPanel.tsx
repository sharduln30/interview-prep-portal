import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { SdInterviewMeta } from "@/types";

type Props = {
  meta: SdInterviewMeta;
  title: string;
};

export function SdInterviewPanel({ meta, title }: Props) {
  const sorted = [...meta.experiences].sort((a, b) => b.reportedAt.localeCompare(a.reportedAt));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Interview signal · {title}</CardTitle>
        <CardDescription>
          <span className="text-foreground/90 font-medium">Last asked (summary):</span> {meta.lastAskedSummary}
        </CardDescription>
        <p className="text-muted-foreground text-xs">
          Reference snapshot: <Badge variant="outline">{meta.dataAsOf}</Badge>
        </p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <h3 className="mb-2 font-medium">Recent-style interview experiences</h3>
          <ul className="space-y-3">
            {sorted.map((e) => (
              <li key={e.id} className="bg-muted/40 rounded-md border p-3">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-semibold">{e.company}</span>
                  {e.roleOrLevel ? (
                    <span className="text-muted-foreground text-xs">{e.roleOrLevel}</span>
                  ) : null}
                  <span className="text-muted-foreground text-xs">· reported {e.reportedAt}</span>
                </div>
                <p className="text-muted-foreground mt-1 leading-snug">{e.summary}</p>
                {e.source ? (
                  <p className="text-muted-foreground mt-1 text-xs">Source: {e.source}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        <p className="text-muted-foreground text-xs leading-relaxed">{meta.disclaimer}</p>
        <p className="text-muted-foreground text-xs">
          <strong className="text-foreground">Tip:</strong> Claude (Anthropic) and larger OpenAI models usually
          produce cleaner structured HLD answers and Mermaid diagrams than smaller free models.
        </p>
      </CardContent>
    </Card>
  );
}
