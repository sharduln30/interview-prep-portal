"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  content: string;
  className?: string;
};

export function MarkdownBody({ content, className }: Props) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { children, className: cn, ...rest } = props;
            const match = /language-(\w+)/.exec(cn || "");
            const inline = !match && !String(children).includes("\n");
            if (inline) {
              return (
                <code className="bg-muted rounded px-1 py-0.5 text-sm" {...rest}>
                  {children}
                </code>
              );
            }
            const language = match?.[1] ?? "text";
            return (
              <SyntaxHighlighter
                style={oneDark}
                language={language}
                PreTag="div"
                className="rounded-md text-sm"
              >
                {String(children).replace(/\n$/, "")}
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
