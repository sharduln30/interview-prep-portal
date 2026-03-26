"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MermaidDiagram } from "@/components/MermaidDiagram";

type Props = {
  content: string;
  className?: string;
};

export function DesignMarkdownBody({ content, className }: Props) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { children, className: cn, ...rest } = props;
            const match = /language-([\w-]+)/.exec(cn || "");
            const text = String(children).replace(/\n$/, "");
            const inline = !match && !text.includes("\n");
            if (inline) {
              return (
                <code className="bg-muted rounded px-1 py-0.5 text-sm" {...rest}>
                  {children}
                </code>
              );
            }
            const language = match?.[1] ?? "text";
            if (language === "mermaid") {
              return <MermaidDiagram chart={text} />;
            }
            return (
              <SyntaxHighlighter
                style={oneDark}
                language={language}
                PreTag="div"
                className="rounded-md text-sm"
              >
                {text}
              </SyntaxHighlighter>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
