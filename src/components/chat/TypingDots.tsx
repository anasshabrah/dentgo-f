// src/components/chat/TypingDots.tsx

import { motion } from 'framer-motion';

export default function TypingDots() {
  return (
    <div className="flex items-end gap-1 pl-8">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
          animate={{ y: [0, -4, 0], opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}
