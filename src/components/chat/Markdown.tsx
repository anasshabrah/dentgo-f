// src/components/chat/Markdown.tsx

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import 'prismjs/themes/prism.min.css';

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      className="prose dark:prose-invert max-w-none text-[15px] prose-p:my-2 prose-h2:mt-4 prose-h2:mb-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1"
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
      linkTarget="_blank"
    >
      {children}
    </ReactMarkdown>
  );
}
