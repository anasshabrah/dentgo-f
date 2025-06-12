import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { askDentgo } from "@/api/chat";
import { fetchChatSession, endChatSession } from "@/api/chats";
import { API_BASE, FREE_MESSAGES_PER_DAY } from "@/config";
import { useStripeData } from "@context/StripeContext";
import { useToast } from "@components/ui/ToastProvider";
import Loader from "@components/ui/Loader";

// RTL detection for Arabic and similar scripts
function isRTL(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

function MessageBubble({ text, type }: { text: string; type: "personal" | "bot" }) {
  const rtl = isRTL(text);
  return (
    <div
      className={`mb-3 px-4 py-3 max-w-[75%] rounded-2xl shadow-sm text-base leading-6 font-sans break-words
        ${type === "personal"
          ? `self-end bg-primary text-white ${rtl ? "text-right" : "text-left"} rounded-br-lg`
          : `self-start bg-primary/10 text-primary ${rtl ? "text-right" : "text-left"} rounded-bl-lg`
        }`}
      style={{ direction: rtl ? "rtl" : "ltr" }}
      aria-label={type === "personal" ? "Your message" : "Bot response"}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
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
  const [messages, setMessages] = useState<{ text: string; type: "personal" | "bot" }[]>([]);
  const [input, setInput] = useState("");
  const [usedToday, setUsedToday] = useState(0);
  const [isThinking, setThinking] = useState(false);
  const historyRef = useRef<{ role: "user" | "assistant"; text: string }[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [chatName, setChatName] = useState("");

  const isBasic = !subscription || subscription.subscriptionId === null;

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
        // ignore errors silently
      }
    }
    loadCount();

    const params = new URLSearchParams(search);
    const sid = params.has("sessionId") ? Number(params.get("sessionId")) : null;
    if (sid) {
      setSessionId(sid);
      fetchChatSession(sid)
        .then((session) => {
          const msgs = session.messages.map((m: any) => ({
            text: m.content,
            type: m.role === "USER" ? "personal" : "bot",
          }));
          setMessages(msgs);
          historyRef.current = msgs.map((m) => ({
            role: m.type === "personal" ? "user" : "assistant",
            text: m.text,
          }));
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  useEffect(() => {
    if (!loading && sessionId === null) {
      const greeting = "Hey, I'm Dentgo 😊 How can I assist with your dental cases today?";
      setMessages([{ text: greeting, type: "bot" }]);
      historyRef.current = [{ role: "assistant", text: greeting }];
    }
  }, [loading, sessionId]);

  const send = async () => {
    const prompt = input.trim();
    if (!prompt || isThinking) return;

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
    if (sessionId) await endChatSession(sessionId);
    navigate("/dentgo-gpt-home");
  };

  if (loading) return <Loader fullscreen />;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Sticky header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-semibold">Dentgo Chat</h1>
          {isBasic ? (
            <span className="text-gray-600 text-sm">
              Free: {usedToday}/{FREE_MESSAGES_PER_DAY}
            </span>
          ) : (
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
              PLUS
            </span>
          )}
        </div>
        <button
          aria-label="End chat session"
          onClick={() => setShowEndSessionModal(true)}
          className="text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary rounded"
        >
          ✖
        </button>
      </header>

      {/* Chat messages container */}
      <main
        ref={containerRef}
        className="flex-grow overflow-y-auto p-4 flex flex-col space-y-2 bg-white rounded-t-xl shadow-inner"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((m, i) => (
          <MessageBubble key={i} {...m} />
        ))}
        {isThinking && (
          <p className="self-start italic text-gray-500 select-none" aria-live="assertive">
            Dentgo is typing…
          </p>
        )}
      </main>

      {/* Input area fixed at bottom */}
      <footer className="bg-white p-4 shadow-inner sticky bottom-0 z-20 flex items-center space-x-2">
        <textarea
          rows={1}
          className="flex-grow resize-none rounded-lg bg-gray-200 px-3 py-2 text-base placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          aria-label="Message input"
          disabled={isThinking}
        />
        <button
          onClick={send}
          disabled={isThinking || !input.trim()}
          aria-label="Send message"
          className={`p-3 rounded-lg text-white ${
            isThinking || !input.trim() ? "bg-primary/60 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"
          } transition`}
          type="button"
        >
          {isThinking ? (
            <svg
              className="animate-spin h-5 w-5 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          ) : (
            "➤"
          )}
        </button>
      </footer>

      {/* End session modal */}
      {showEndSessionModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30"
          role="dialog"
          aria-modal="true"
          aria-labelledby="endSessionTitle"
        >
          <div className="bg-white rounded-lg p-6 w-80 max-w-full mx-4">
            <h2 id="endSessionTitle" className="text-xl font-semibold mb-2">
              End Session?
            </h2>
            <input
              type="text"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Chat name (optional)"
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Chat name"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowEndSessionModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEndSession}
                className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                End
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DentgoChat;
