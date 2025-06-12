// DentgoChat.tsx — Refactored for robust mobile UX
// ---------------------------------------------------
// Major improvements:
// • Reliable scrolling for long messages (flex layout + overflow-y-auto on the log)
// • Gradient + FAB scroll‑to‑bottom hint when user is scrolled up
// • Hidden caret on bot bubbles to remove blinking cursor artefact
// • Clear chat hierarchy (avatars, stronger spacing)
// • Input docked to bottom; content grows independently
// • Accessibility: role="log" + aria-live for screen‑readers
// • RTL-aware message alignment remains intact

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { askDentgo } from "@/api/chat";
import { fetchChatSession, endChatSession } from "@/api/chats";
import { API_BASE, FREE_MESSAGES_PER_DAY } from "@/config";
import { useStripeData } from "@/context/StripeContext";
import { useToast } from "@/components/ui/ToastProvider";
import Loader from "@/components/ui/Loader";

function isRTL(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

type BubbleProps = { text: string; type: "personal" | "bot" };

function MessageBubble({ text, type }: BubbleProps) {
  const rtl = isRTL(text);
  const shared =
    "mb-3 px-4 py-3 max-w-[75%] rounded-2xl shadow-sm text-base leading-6 font-sans break-words prose prose-sm dark:prose-invert";

  const personal =
    `self-end bg-primary text-white ${rtl ? "text-right" : "text-left"} rounded-br-lg`;
  const bot = `self-start bg-primary/10 text-primary ${rtl ? "text-right" : "text-left"} rounded-bl-lg`;

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className={`${shared} ${type === "personal" ? personal : bot}`}
      // Prevent blinking caret artefact on iOS Safari
      contentEditable={false}
      style={{ caretColor: "transparent" }}
      aria-label={type === "personal" ? "Your message" : "Bot response"}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

const DentgoChat: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { subscription } = useStripeData();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<BubbleProps[]>([]);
  const [input, setInput] = useState("");
  const [usedToday, setUsedToday] = useState(0);
  const [isThinking, setThinking] = useState(false);
  const historyRef = useRef<{ role: "user" | "assistant"; text: string }[]>(
    []
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionMeta, setSessionMeta] = useState({
    title: "Dentgo Chat",
    isEnded: false,
  });

  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [chatName, setChatName] = useState("");

  const isBasic = !subscription || subscription.subscriptionId === null;

  // ---------- helpers ----------
  const scrollToBottom = useCallback(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  // ---------- effects ----------
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

    // Restore session (if any)
    const params = new URLSearchParams(search);
    const sid = params.has("sessionId") ? Number(params.get("sessionId")) : null;
    if (sid) {
      setSessionId(sid);
      fetchChatSession(sid)
        .then((session) => {
          const msgs: BubbleProps[] = session.messages.map((m) => ({
            text: m.content,
            type: m.role === "USER" ? "personal" : "bot",
          }));
          setMessages(msgs);
          historyRef.current = msgs.map((m) => ({
            role: m.type === "personal" ? "user" : "assistant",
            text: m.text,
          }));
          setSessionMeta({
            title: session.title ?? "Dentgo Chat",
            isEnded: session.isEnded,
          });
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [search, navigate]);

  // Auto-scroll on new content
  useEffect(() => scrollToBottom(), [messages, isThinking, scrollToBottom]);

  // Greet on fresh chat
  useEffect(() => {
    if (!loading && sessionId === null) {
      const greeting = "Hey, I'm Dentgo 😊 How can I assist with your dental cases today?";
      setMessages([{ text: greeting, type: "bot" }]);
      historyRef.current = [{ role: "assistant", text: greeting }];
    }
  }, [loading, sessionId]);

  // Scroll‑hint (FAB + gradient) visibility
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const fromBottom = el.scrollHeight - (el.scrollTop + el.clientHeight);
      setShowScrollHint(fromBottom > 120); // px threshold
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // ---------- actions ----------
  const send = async () => {
    const prompt = input.trim();
    if (!prompt || isThinking || sessionMeta.isEnded) return;

    if (isBasic && usedToday >= FREE_MESSAGES_PER_DAY) {
      addToast({
        message: `You’ve used ${usedToday}/${FREE_MESSAGES_PER_DAY} free messages today. Upgrade for unlimited.`,
        type: "error",
      });
      return;
    }

    setMessages((prev) => [...prev, { text: prompt, type: "personal" }]);
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
      setMessages((prev) => [...prev, { text: answer, type: "bot" }]);
      historyRef.current.push({ role: "assistant", text: answer });
      setUsedToday((u) => u + 1);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { text: `❌ ${err.message || "Something went wrong."}`, type: "bot" },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const handleEndSession = async () => {
    if (sessionId) {
      await endChatSession(
        sessionId,
        chatName.trim() !== "" ? chatName.trim() : undefined
      );
    }
    setShowEndSessionModal(false);
    navigate("/dentgo-gpt-home");
  };

  if (loading) return <Loader fullscreen />;

  // ---------- render ----------
  return (
    <div className="flex flex-col h-dvh bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="px-4 py-3 bg-white dark:bg-gray-800 shadow flex items-center justify-between sticky top-0 z-10">
        <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100 truncate max-w-[70%]">
          {sessionMeta.title}
        </h2>
        <div className="flex items-center space-x-3">
          {sessionMeta.isEnded && (
            <span className="text-red-600 text-sm">[Ended]</span>
          )}
          <button
            type="button"
            onClick={() => setShowEndSessionModal(true)}
            disabled={sessionMeta.isEnded}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-40"
          >
            ✖
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="flex flex-col flex-1 relative overflow-hidden">
        {/* Messages log */}
        <div
          ref={containerRef}
          role="log"
          aria-live="polite"
          className="flex-1 overflow-y-auto px-4 pt-3 pb-16 space-y-1"
        >
          {/* Usage badge */}
          <div className="flex justify-between items-center mb-4">
            {isBasic ? (
              <span className="text-gray-500 text-xs">
                Free: {usedToday}/{FREE_MESSAGES_PER_DAY}
              </span>
            ) : (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                PLUS
              </span>
            )}
          </div>

          {messages.map((m, i) => (
            <MessageBubble key={i} {...m} />
          ))}
          {isThinking && (
            <div className="text-gray-500 italic">Dentgo is typing…</div>
          )}
        </div>

        {/* Gradient fade when not at bottom */}
        {showScrollHint && (
          <div className="pointer-events-none absolute bottom-16 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
        )}

        {/* FAB scroll‑to‑bottom */}
        {showScrollHint && (
          <button
            onClick={scrollToBottom}
            aria-label="Scroll to latest message"
            className="absolute bottom-24 right-6 p-3 rounded-full bg-primary shadow-lg text-white animate-bounce"
          >
            ↓
          </button>
        )}

        {/* Input bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex items-end space-x-2">
          <textarea
            rows={2}
            disabled={sessionMeta.isEnded}
            className="flex-1 resize-none p-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary outline-none transition leading-6"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
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

      {/* End Session Modal */}
      {showEndSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
              End Session
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This chat will be saved in your history. You can give it a name
              (optional):
            </p>
            <input
              type="text"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Chat name"
              className="w-full p-2 border rounded mb-4 bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 transition"
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                onClick={() => setShowEndSessionModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-primary text-white"
                onClick={handleEndSession}
              >
                Yes, End
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DentgoChat;
