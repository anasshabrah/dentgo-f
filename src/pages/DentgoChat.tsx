// pages/DentgoChat.tsx
import {
  useState,
  useEffect,
  useCallback,
  Fragment,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useMessageStore } from '@/hooks/useMessageStore';
import { askDentgo } from '@/api/chat';
import { fetchChatSession } from '@/api/chats';
import { FREE_MESSAGES_PER_DAY, API_BASE } from '@/config';
import { useStripeData } from '@/context/StripeContext';
import { useToast } from '@/components/ui/ToastProvider';
import ChatBubble from '@/components/chat/ChatBubble';
import TypingDots from '@/components/chat/TypingDots';
import ChatInput from '@/components/chat/ChatInput';

// Retry a fetch call if 401, using /api/auth/refresh
const withTokenRetry = async <T,>(fetchFn: () => Promise<T>): Promise<T> => {
  try {
    return await fetchFn();
  } catch (err: any) {
    if (err?.response?.status === 401 || err?.status === 401) {
      // Attempt refresh
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        return await fetchFn(); // Retry original request
      }
    }
    throw err;
  }
};

const DentgoChat = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { subscription } = useStripeData();
  const { addToast } = useToast();
  const { msgs, add, replaceLast, reset } = useMessageStore();

  const [isTyping, setTyping] = useState(false);
  const [usedToday, setUsedToday] = useState(0);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const PLUS = Boolean(subscription?.subscriptionId);

  // ---------------- Initial Load ----------------
  useEffect(() => {
    const init = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const countRes = await fetch(`${API_BASE}/api/chat/count?date=${today}`, {
          credentials: 'include',
        });
        const countData = await (countRes.ok ? countRes.json() : { count: 0 });
        setUsedToday(countData.count);

        const sid = new URLSearchParams(search).get('sessionId');
        if (sid) {
          const session = await fetchChatSession(Number(sid));
          reset();
          session.messages.forEach((m) =>
            add({
              id: uuid(),
              role: m.role === 'USER' ? 'user' : 'assistant',
              html: m.content,
              timestamp: Date.parse(
                m.role === 'USER' ? session.startedAt : session.endedAt ?? session.startedAt
              ),
            })
          );
          setSessionId(session.id);
        }
      } catch {
        addToast({ message: 'Failed to load session.', type: 'error' });
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- Send Message ----------------
  const send = useCallback(
    async (text: string, images: File[]) => {
      if (!text.trim() && images.length === 0) return;

      if (!PLUS && usedToday >= FREE_MESSAGES_PER_DAY) {
        addToast({
          message: `Daily limit reached (${FREE_MESSAGES_PER_DAY}). Upgrade for unlimited chats.`,
          type: 'info',
        });
        return;
      }

      const id = uuid();
      add({ id, role: 'user', html: text, timestamp: Date.now() });
      add({ id: id + '-ai', role: 'assistant', html: '', timestamp: Date.now() });
      setTyping(true);

      try {
        const fetchFn = () =>
          askDentgo(
            text,
            msgs.map((m) => ({ role: m.role, text: m.html })),
            sessionId ?? undefined // Ensure it's undefined not null
          );

        const { answer, sessionId: sid } = await withTokenRetry(fetchFn);

        if (!sessionId && sid) {
          setSessionId(sid);
          navigate(`?sessionId=${sid}`, { replace: true });
        }

        replaceLast({ html: answer });
        setUsedToday((n) => n + 1);
      } catch (err: any) {
        const msg = err?.message || 'Unexpected error occurred.';
        replaceLast({ html: `❌ ${msg}`, error: true });
      } finally {
        setTyping(false);
      }
    },
    [add, replaceLast, msgs, PLUS, usedToday, sessionId, navigate, addToast]
  );

  // ---------------- Render ----------------
  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <ScrollToBottom className="flex-1 overflow-y-auto px-3 py-4 bg-background">
        {msgs.map((m) => (
          <Fragment key={m.id}>
            <ChatBubble
              role={m.role}
              html={m.html || '<em>…</em>'}
              timestamp={m.timestamp}
            />
          </Fragment>
        ))}
        {isTyping && <TypingDots />}
      </ScrollToBottom>

      <ChatInput onSubmit={send} disabled={isTyping} />
    </div>
  );
};

export default DentgoChat;
