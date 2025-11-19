// src/components/MarkdownRenderer.jsx
import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

/*
  Robust MarkdownRenderer
  - content: markdown string
  - onImageClick(src) optional
  NOTE: For safety you should add sanitization server-side or re-enable rehype-sanitize with a restricted schema.
*/

export default function MarkdownRenderer({ content, onImageClick }) {
  const safeContent = typeof content === "string" ? content : String(content || "");

  // quick debug log so you can inspect exactly what's being rendered
  // remove this in production if noisy
  // eslint-disable-next-line no-console
  console.debug("[MarkdownRenderer] content preview:", safeContent.slice(0, 200));

  // Code block renderer with copy button
  // replace your CodeBlock with this
const CodeBlock = ({ inline, className, children, ...props }) => {
  const codeText = String(children).replace(/\n$/, "");
  const langMatch = /language-(\w+)/.exec(className || "");
  const lang = langMatch ? langMatch[1] : "";

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(codeText); }
    catch (e) { console.warn("Copy failed", e); }
  };

  if (inline) {
    return <code className="px-1 py-0.5 rounded bg-muted/30 text-sm">{children}</code>;
  }

  // children may contain highlighted HTML injected by rehype-highlight
  const maybeHtml = typeof children === 'string' ? children : String(children);
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(maybeHtml);

  return (
    <div className="relative my-3">
      {looksLikeHtml ? (
        <pre className={`rounded-lg overflow-auto p-4 bg-surface border border-border text-sm language-${lang}`}>
          <code
            className={className}
            dangerouslySetInnerHTML={{ __html: maybeHtml }}
          />
        </pre>
      ) : (
        <pre className={`rounded-lg overflow-auto p-4 bg-surface border border-border text-sm language-${lang}`}>
          <code className={className}>{codeText}</code>
        </pre>
      )}

      <div className="absolute right-2 top-2 flex gap-2">
        <Button size="icon" variant="ghost" onClick={handleCopy} title="Copy code">
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};


  // Image renderer (clickable)
  const ImageRenderer = ({ src, alt }) => {
    return (
      <div className="my-4">
        <img
          src={src}
          alt={alt || ""}
          className="max-w-full rounded-md cursor-pointer"
          onClick={() => onImageClick?.(src)}
        />
        {alt && <div className="text-xs text-muted-foreground mt-1">{alt}</div>}
      </div>
    );
  };

  // If ReactMarkdown fails for any reason, we render a fallback <pre> showing the raw markdown.
  try {
    return (
      <div className="markdown">
        <ReactMarkdown
          children={safeContent}
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]} 
          components={{
            code: CodeBlock,
            img: ({ node, ...props }) => <ImageRenderer {...props} />,
            a: ({ node, ...props }) => (
              <a {...props} className="text-primary underline" target="_blank" rel="noopener noreferrer" />
            ),
            table: ({ node, ...props }) => <div className="overflow-auto"><table {...props} /></div>,
          }}
        />
      </div>
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("MarkdownRenderer render error:", err);
    // fallback: show raw text so UI never appears empty
    return (
      <pre className="bg-surface p-3 rounded text-sm whitespace-pre-wrap break-words">
        {safeContent || "<empty content>"}
      </pre>
    );
  }
}
