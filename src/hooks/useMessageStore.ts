// src/hooks/useMessageStore.ts
import { create } from 'zustand';

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
  replaceLast: (m: Partial<ChatMsg>) => void;
  reset: () => void;
}

export const useMessageStore = create<Store>((set) => ({
  msgs: [],
  add: (m) => set((s) => ({ msgs: [...s.msgs, m] })),
  replaceLast: (patch) =>
    set((s) => ({
      msgs: s.msgs.map((m, i) =>
        i === s.msgs.length - 1 ? { ...m, ...patch } : m
      ),
    })),
  reset: () => set({ msgs: [] }),
}));
