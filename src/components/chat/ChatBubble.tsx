// src/components/chat/ChatBubble.tsx

import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from './Markdown';

interface Props {
  role: 'user' | 'assistant';
  html: string;
  timestamp: number;
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function ChatBubble({
  role,
  html,
  timestamp,
  collapsed,
  onToggle,
}: Props) {
  const isUser = role === 'user';
  const time = new Date(timestamp).toLocaleTimeString();

  return (
    <div
      className={clsx(
        'peer group my-2 flex',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* avatar for assistant */}
      {!isUser && (
        <img
          src="/favicon.png"
          alt="AI"
          className="w-7 h-7 mr-2 mt-1 rounded"
        />
      )}

      <div
        className={clsx(
          'max-w-[85%] rounded-xl px-4 py-2 shadow-sm relative',
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
        )}
      >
        {/* collapse bar */}
        {onToggle && (
          <button
            onClick={onToggle}
            className="absolute -right-6 top-1 text-xs text-gray-400 hover:text-gray-600"
            aria-label="Toggle collapse"
          >
            {collapsed ? '▸' : '▾'}
          </button>
        )}

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Markdown>{html}</Markdown>
            </motion.div>
          )}
        </AnimatePresence>

        {/* timestamp tooltip */}
        <span className="opacity-0 group-hover:opacity-100 absolute -bottom-5 right-0 text-[10px] text-gray-500 dark:text-gray-400 transition">
          {time}
        </span>
      </div>
    </div>
  );
}
