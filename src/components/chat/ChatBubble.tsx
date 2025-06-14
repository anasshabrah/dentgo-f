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
  collapsed = false,
  onToggle,
}: Props) {
  const isUser = role === 'user';
  const time = new Date(timestamp).toLocaleTimeString();

  return (
    <div
      className={clsx(
        'peer group my-2 flex px-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
      dir="auto"
    >
      {/* Avatar for assistant only */}
      {!isUser && (
        <img
          src="/favicon.png"
          alt="Assistant avatar"
          className="w-7 h-7 self-start rounded me-2 mt-1"
        />
      )}

      <motion.div
        className={clsx(
          'relative max-w-[85%] md:max-w-[80%] rounded-xl px-4 py-2 shadow-sm',
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-muted text-foreground rounded-bl-none dark:bg-gray-800 dark:text-gray-100'
        )}
        layout
        transition={{ layout: { duration: 0.2 } }}
      >
        {/* Collapse/expand toggle */}
        {onToggle && (
          <button
            onClick={onToggle}
            className={clsx(
              'absolute top-1 text-xs transition text-gray-400 hover:text-gray-600',
              isUser ? '-left-6' : '-right-6'
            )}
            aria-label={collapsed ? 'Expand message' : 'Collapse message'}
          >
            {collapsed ? '▸' : '▾'}
          </button>
        )}

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="message"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Markdown>{html}</Markdown>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timestamp tooltip */}
        <span
          className={clsx(
            'absolute text-[10px] transition-opacity duration-200 opacity-0 group-hover:opacity-100',
            isUser ? 'bottom-[-18px] right-0' : 'bottom-[-18px] left-0',
            'text-gray-500 dark:text-gray-400'
          )}
          aria-label="Message timestamp"
        >
          {time}
        </span>
      </motion.div>
    </div>
  );
}
