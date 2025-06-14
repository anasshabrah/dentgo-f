// src/pages/DentgoChat.tsx
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
import { API_BASE } from '@/config';
import { useStripeData } from '@/context/StripeContext';
import { useToast } from '@/components/ui/ToastProvider';
import ChatBubble from '@/components/chat/ChatBubble';
import TypingDots from '@/components/chat/TypingDots';
import ChatInput from '@/components/chat/ChatInput';

const withTokenRetry = async <T,>(fetchFn: () => Promise<T>): Promise<T> => {
  try {
    return await fetchFn();
  } catch (err: any) {
    if (err?.response?.status === 401 || err?.status === 401) {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        return await fetchFn();
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
  const [sessionId, setSessionId] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
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
                m.role === 'USER'
                  ? session.startedAt
                  : session.endedAt ?? session.startedAt
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

  const send = useCallback(
    async (text: string, images: File[]) => {
      if (!text.trim() && images.length === 0) return;

      const userMsgId = uuid();
      add({ id: userMsgId, role: 'user', html: text, timestamp: Date.now() });
      add({ id: userMsgId + '-ai', role: 'assistant', html: '', timestamp: Date.now() });
      setTyping(true);

      try {
        if (images.length > 0) {
          await Promise.all(
            images.map(async (file) => {
              const form = new FormData();
              form.append('image', file);
              const res = await fetch(`${API_BASE}/api/chat/analyze-image`, {
                method: 'POST',
                credentials: 'include',
                body: form,
              });
              if (!res.ok) throw new Error('Image analysis failed');
              return res.json();
            })
          );
        }

        const fetchFn = () =>
          askDentgo(
            text,
            msgs.map((m) => ({ role: m.role, text: m.html })),
            sessionId ?? undefined,
            images
          );

        const { answer, sessionId: sid } = await withTokenRetry(fetchFn);

        if (!sessionId && sid) {
          setSessionId(sid);
          navigate(`?sessionId=${sid}`, { replace: true });
        }

        replaceLast({ html: answer });
      } catch (err: any) {
        const msg = err?.message || 'Unexpected error occurred.';
        replaceLast({ html: `❌ ${msg}`, error: true });
      } finally {
        setTyping(false);
      }
    },
    [add, replaceLast, msgs, sessionId, navigate]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-gray-100 dark:bg-gray-900">
      {/* Chat Container */}
      <ScrollToBottom className="flex-1 overflow-y-auto mt-2 px-4 py-4 mx-auto w-full max-w-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
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

      {/* Input Container */}
      <div className="mx-auto w-full max-w-3xl px-4 pt-2 pb-4">
        <div className="bg-white dark:bg-gray-800 rounded-md px-4 py-4 shadow border border-gray-200 dark:border-gray-700">
          <ChatInput onSubmit={send} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
};

export default DentgoChat;
