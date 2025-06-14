// src/hooks/useMessageStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'user' | 'assistant';

export interface ChatMsg {
  id: string;
  role: Role;
  html: string;
  timestamp: number;
  images?: string[];
  error?: boolean;
}

interface Store {
  msgs: ChatMsg[];
  add: (m: ChatMsg) => void;
  replaceLast: (patch: Partial<ChatMsg>) => void;
  reset: () => void;
  load: (msgs: ChatMsg[]) => void;
}

export const useMessageStore = create<Store>()(
  persist(
    (set, get) => ({
      msgs: [],
      add: (msg) =>
        set((state) => ({
          msgs: [...state.msgs, msg],
        })),
      replaceLast: (patch) =>
        set((state) => {
          const msgs = [...state.msgs];
          if (msgs.length === 0) return { msgs };
          const last = msgs[msgs.length - 1];
          msgs[msgs.length - 1] = { ...last, ...patch };
          return { msgs };
        }),
      reset: () => set({ msgs: [] }),
      load: (msgs) => set({ msgs }),
    }),
    {
      name: 'chat-message-store', // storage key
      partialize: (state) => ({ msgs: state.msgs }), // only persist msgs
      version: 1,
    }
  )
);
