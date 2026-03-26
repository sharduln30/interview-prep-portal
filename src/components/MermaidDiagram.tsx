"use client";

import { useEffect, useId, useState } from "react";

type Props = {
  chart: string;
};

export function MermaidDiagram({ chart }: Props) {
  const reactId = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        const dark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
        mermaid.initialize({
          startOnLoad: false,
          theme: dark ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "inherit",
        });
        const id = `mmd-${reactId}-${Math.random().toString(36).slice(2, 9)}`;
        const { svg: out } = await mermaid.render(id, chart.trim());
        if (!cancelled) {
          setErr(null);
          setSvg(out);
        }
      } catch (e) {
        if (!cancelled) {
          setSvg(null);
          setErr(e instanceof Error ? e.message : String(e));
        }
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  if (err) {
    return (
      <div className="bg-destructive/10 text-destructive rounded-md border p-3 text-xs">
        Mermaid could not render (incomplete while streaming?). {err}
      </div>
    );
  }
  if (!svg) {
    return <div className="text-muted-foreground py-6 text-center text-sm">Rendering diagram…</div>;
  }
  return <div className="my-4 overflow-x-auto [&_svg]:max-w-none" dangerouslySetInnerHTML={{ __html: svg }} />;
}
