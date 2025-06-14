// pages/DentgoChat.tsx
import {
  useState,
  useEffect,
  useCallback,
  useRef,
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

const DentgoChat = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { subscription } = useStripeData();
  const { addToast } = useToast();
  const { msgs, add, replaceLast, reset } = useMessageStore();

  const [isTyping, setTyping] = useState(false);
  const [usedToday, setUsedToday] = useState(0);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const PLUS = !!subscription?.subscriptionId;

  // ---------------- Initial Load ----------------
  useEffect(() => {
    const init = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const c = await fetch(`${API_BASE}/api/chat/count?date=${today}`, {
        credentials: 'include',
      })
        .then((r) => (r.ok ? r.json() : { count: 0 }))
        .then((d) => d.count);
      setUsedToday(c);

      const sid = new URLSearchParams(search).get('sessionId');
      if (sid) {
        try {
          const s = await fetchChatSession(Number(sid));
          reset();
          s.messages.forEach((m) =>
            add({
              id: uuid(),
              role: m.role === 'USER' ? 'user' : 'assistant',
              html: m.content,
              timestamp: Date.parse(m.role === 'USER' ? s.startedAt : s.endedAt ?? s.startedAt),
            })
          );
          setSessionId(s.id);
        } catch {
          addToast({ message: 'Failed to load session.', type: 'error' });
        }
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
      add({
        id,
        role: 'user',
        html: text,
        timestamp: Date.now(),
      });

      add({
        id: id + '-ai',
        role: 'assistant',
        html: '',
        timestamp: Date.now(),
      });

      setTyping(true);

      try {
        const { answer, sessionId: sid } = await askDentgo(
          text,
          msgs.map((m) => ({ role: m.role, text: m.html })),
          sessionId
        );
        if (!sessionId) {
          setSessionId(sid);
          navigate(`?sessionId=${sid}`, { replace: true });
        }
        replaceLast({ html: answer });
        setUsedToday((n) => n + 1);
      } catch (err: any) {
        replaceLast({ html: '❌ ' + (err?.message || 'Error'), error: true });
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
