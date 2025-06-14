// src/components/chat/Markdown.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      className="
        prose dark:prose-invert max-w-none
        text-[15px] sm:text-base
        leading-relaxed
        prose-p:my-3
        prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
        prose-h1:mt-6 prose-h1:mb-3
        prose-h2:mt-5 prose-h2:mb-2
        prose-ul:my-3 prose-ol:my-3 prose-li:my-1
        prose-img:my-2 prose-table:my-4
        prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:rounded-md prose-pre:p-4
        prose-code:before:content-none prose-code:after:content-none
      "
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
      linkTarget="_blank"
      components={{
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {children}
          </a>
        ),
        code({ inline, className, children, ...props }) {
          return !inline ? (
            <pre>
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          ) : (
            <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
