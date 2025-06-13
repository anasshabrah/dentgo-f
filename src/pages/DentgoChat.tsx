// src/pages/DentgoChat.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { askDentgo } from "@/api/chat";
import { fetchChatSession } from "@/api/chats";
import { API_BASE, FREE_MESSAGES_PER_DAY } from "@/config";
import { useStripeData } from "@/context/StripeContext";
import { useToast } from "@/components/ui/ToastProvider";
import Loader from "@/components/ui/Loader";
import { useModal } from "@/context/ModalContext";
import EndSessionModal from "@/components/modal/EndSessionModal";
import AppHeader from "@/components/AppHeader";

const isRTL = (text: string) => /[\u0600-\u06FF]/.test(text);

type BubbleProps = { text: string; type: "personal" | "bot" };

function MessageBubble({ text, type }: BubbleProps) {
  const rtl = isRTL(text);
  const match =
    text.match(/!\[[^\]]*]\((?<url>https?:\/\/[^\s)]+)\)/) ??
    text.match(/https?:\/\/[^\s]+\.(png|jpe?g|webp|gif)/);
  const imgUrl = match ? (match.groups?.url ?? match[0]) : undefined;
  const md = match ? text.replace(match[0], "") : text;

  const shared = [
    "mb-3",
    "rounded-2xl",
    "shadow-sm",
    "max-w-[85%] sm:max-w-[80%]",
    "prose prose-sm dark:prose-invert break-words leading-6"
  ].join(" ");
  const palette =
    type === "personal"
      ? "self-end bg-[var(--color-primary)] text-white rounded-br-lg"
      : "self-start bg-[var(--color-primary-dark)]/5 text-[var(--color-primary)] rounded-bl-lg dark:bg-white/5";

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className={`${shared} ${palette} ${imgUrl ? "p-0" : "px-4 py-3"}`}
      aria-label={type === "personal" ? "Your message" : "Bot response"}
    >
      {imgUrl ? (
        <div className="flex flex-col sm:flex-row gap-4">
          <img
            src={imgUrl}
            alt=""
            className="w-full sm:w-48 h-auto object-contain rounded-lg border border-black/5 dark:border-white/10"
          />
          <div className="px-4 py-3">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
            >
              {md || "*Image attached*"}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
          {md}
        </ReactMarkdown>
      )}
    </div>
  );
}

const DentgoChat: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { subscription } = useStripeData();
  const { addToast } = useToast();
  const { open: openModal } = useModal();

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<BubbleProps[]>([]);
  const [input, setInput] = useState("");
  const [usedToday, setUsedToday] = useState(0);
  const [isThinking, setThinking] = useState(false);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
  const historyRef = useRef<{ role: "user" | "assistant"; text: string }[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionMeta, setSessionMeta] = useState({
    title: "Dentgo Chat",
    isEnded: false,
  });

  const isBasic = !subscription || subscription.subscriptionId === null;
  const greetingPlaceholder =
    "Hey, I'm Dentgo 😊 How can I assist with your dental cases today?";

  const scrollToBottom = useCallback(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    async function loadCount() {
      const today = new Date().toISOString().slice(0, 10);
      try {
        const res = await fetch(`${API_BASE}/api/chat/count?date=${today}`, {
          credentials: "include",
        });
        if (res.ok) {
          const { count } = await res.json();
          setUsedToday(count);
        }
      } catch {
        /* ignore */
      }
    }
    loadCount();

    const params = new URLSearchParams(search);
    const sid = params.has("sessionId") ? Number(params.get("sessionId")) : null;
    if (sid) {
      setSessionId(sid);
      fetchChatSession(sid)
        .then((session) => {
          const msgs = session.messages.map(m => ({
            text: m.content,
            type: m.role === "USER" ? "personal" : "bot"
          }));
          setMessages(msgs);
          historyRef.current = msgs.map(m => ({
            role: m.type === "personal" ? "user" : "assistant",
            text: m.text
          }));
          setSessionMeta({
            title: session.title || "Dentgo Chat",
            isEnded: session.isEnded
          });
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => scrollToBottom(), [messages, isThinking, scrollToBottom]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () =>
      setShowScrollHint(el.scrollHeight - (el.scrollTop + el.clientHeight) > 120);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const send = async () => {
    const prompt = input.trim();
    if (!prompt || isThinking || sessionMeta.isEnded) return;

    if (isBasic && usedToday >= FREE_MESSAGES_PER_DAY) {
      addToast({
        message: `You’ve used ${usedToday}/${FREE_MESSAGES_PER_DAY} free messages today.`,
        type: "error",
      });
      setShowUpgradeBanner(true);
      return;
    }

    setMessages(prev => [...prev, { text: prompt, type: "personal" }]);
    historyRef.current.push({ role: "user", text: prompt });
    setInput("");
    setThinking(true);

    try {
      const { sessionId: newSid, answer } = await askDentgo(
        prompt,
        historyRef.current.slice(0, -1),
        sessionId
      );
      if (!sessionId) {
        setSessionId(newSid);
        navigate(`?sessionId=${newSid}`, { replace: true });
      }
      setMessages(prev => [...prev, { text: answer, type: "bot" }]);
      historyRef.current.push({ role: "assistant", text: answer });
      setUsedToday(u => u + 1);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { text: `❌ ${err.message || "Something went wrong."}`, type: "bot" },
      ]);
    } finally {
      setThinking(false);
    }
  };

  if (loading) return <Loader fullscreen />;

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <AppHeader title={sessionMeta.title} showBack>
        {isBasic ? (
          <span className="text-white text-[12px]">
            Free: {usedToday}/{FREE_MESSAGES_PER_DAY}
          </span>
        ) : (
          <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-[10px] font-semibold rounded-full">
            PLUS
          </span>
        )}
        <button
          type="button"
          onClick={() => openModal(<EndSessionModal sessionId={sessionId} />)}
          disabled={sessionMeta.isEnded}
          aria-label="End Session"
          className="text-white hover:text-gray-200 disabled:opacity-40 p-1"
        >
          ✖
        </button>
      </AppHeader>

      <main className="flex flex-col flex-1 relative overflow-hidden">
        <div
          ref={containerRef}
          role="log"
          aria-live="polite"
          className="flex-1 overflow-y-auto px-4 pt-3 pb-2 space-y-1"
        >
          {messages.map((m, i) => (
            <MessageBubble key={i} {...m} />
          ))}
          {isThinking && (
            <div className="flex items-center gap-1 text-gray-400 px-4 py-1">
              <span>Dentgo is typing</span>
              <span className="flex gap-1 pl-1">
                {[0, 1, 2].map(d => (
                  <span
                    key={d}
                    style={{ animationDelay: `${d * 0.15}s` }}
                    className="w-2 h-2 bg-gray-400 rounded-full animate-[dg-pulse_1s_infinite]"
                  />
                ))}
              </span>
            </div>
          )}
        </div>

        {showScrollHint && (
          <>
            <div className="pointer-events-none absolute bottom-16 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
            <button
              onClick={scrollToBottom}
              aria-label="Scroll to latest message"
              className="absolute bottom-24 right-6 p-3 rounded-full bg-[var(--color-accent-mint)] text-white shadow-lg animate-bounce hover:scale-105 transition"
            >
              ↓
            </button>
          </>
        )}

        {showUpgradeBanner && (
          <div className="bg-yellow-100 text-yellow-900 p-3 text-center">
            You’ve reached your free message limit ({usedToday}/{FREE_MESSAGES_PER_DAY}).{" "}
            <button
              onClick={() => navigate("/subscribe")}
              className="underline font-semibold"
            >
              Upgrade to Plus
            </button>
          </div>
        )}

        <div className="sticky bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur border-t border-gray-200 dark:border-gray-700 p-4 flex items-end gap-2">
          <textarea
            rows={2}
            autoFocus
            disabled={sessionMeta.isEnded}
            className="flex-1 resize-none p-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary outline-none transition leading-6"
            placeholder={greetingPlaceholder}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button
            type="button"
            onClick={send}
            disabled={isThinking || sessionMeta.isEnded}
            className="p-3 bg-primary rounded-lg text-white disabled:opacity-50 shrink-0"
          >
            ➤
          </button>
        </div>
      </main>
    </div>
  );
};

export default DentgoChat;
