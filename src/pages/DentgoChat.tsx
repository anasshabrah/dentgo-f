// src/pages/DentgoChat.tsx

import React, { useEffect, useRef, useState } from "react";
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

// RTL detection for Arabic (and similar scripts)
function isRTL(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

function MessageBubble({
  text,
  type,
}: {
  text: string;
  type: "personal" | "bot";
}) {
  const rtl = isRTL(text);
  const baseClasses =
    "mb-4 px-4 py-3 max-w-[75%] rounded-2xl shadow-sm text-base leading-6 font-sans break-words";
  const personalClasses = `self-end bg-primary text-white ${
    rtl ? "text-right" : "text-left"
  } rounded-br-lg`;
  const botClasses = `self-start bg-primary/10 text-primary ${
    rtl ? "text-right" : "text-left"
  } rounded-bl-lg`;

  return (
    <div
      className={`${baseClasses} ${
        type === "personal" ? personalClasses : botClasses
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
  const [messages, setMessages] = useState<
    { text: string; type: "personal" | "bot" }[]
  >([]);
  const [input, setInput] = useState("");
  const [usedToday, setUsedToday] = useState(0);
  const [isThinking, setThinking] = useState(false);
  const historyRef = useRef<{ role: "user" | "assistant"; text: string }[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionMeta, setSessionMeta] = useState<{
    title: string;
    isEnded: boolean;
  }>({ title: "Dentgo Chat", isEnded: false });

  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [chatName, setChatName] = useState("");

  // Treat any subscription with no Stripe ID as our free/basic plan
  const isBasic = !subscription || subscription.subscriptionId === null;

  // Load today's usage count & existing session (if any)
  useEffect(() => {
    async function loadCount() {
      const today = new Date().toISOString().slice(0, 10);
      try {
        const res = await fetch(
          `${API_BASE}/api/chat/count?date=${today}`,
          { credentials: "include" }
        );
        if (res.ok) {
          const { count } = await res.json();
          setUsedToday(count);
        }
      } catch {
        // ignore network errors silently
      }
    }
    loadCount();

    const params = new URLSearchParams(search);
    const sid = params.has("sessionId")
      ? Number(params.get("sessionId"))
      : null;
    if (sid) {
      setSessionId(sid);
      fetchChatSession(sid)
        .then((session) => {
          setSessionMeta({
            title: session.title || "Unnamed Chat",
            isEnded: session.isEnded,
          });
          const msgs = session.messages.map((m) => ({
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

  // Auto-scroll on new messages or while thinking
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  // Initial greeting if no session
  useEffect(() => {
    if (!loading && sessionId === null) {
      const greeting =
        "Hey, I'm Dentgo 😊 How can I assist with your dental cases today?";
      setMessages([{ text: greeting, type: "bot" }]);
      historyRef.current = [{ role: "assistant", text: greeting }];
    }
  }, [loading, sessionId]);

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
    // Optionally update UI to reflect closure, or navigate home
    navigate("/dentgo-gpt-home");
  };

  if (loading) return <Loader fullscreen />;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="p-4 bg-white shadow flex items-center justify-between">
        <h2 className="font-semibold text-lg">{sessionMeta.title}</h2>
        <div className="flex items-center space-x-2">
          {sessionMeta.isEnded && (
            <span className="text-red-600 text-sm">[Ended]</span>
          )}
          <button
            type="button"
            onClick={() => setShowEndSessionModal(true)}
            disabled={sessionMeta.isEnded}
          >
            ✖
          </button>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-grow overflow-hidden flex flex-col px-4">
        <div className="flex-grow bg-white rounded-xl shadow-inner p-4 flex flex-col">
          {/* Usage Badge */}
          <div className="flex justify-between items-center mb-4">
            {isBasic ? (
              <span className="text-gray-600 text-sm">
                Free: {usedToday}/{FREE_MESSAGES_PER_DAY}
              </span>
            ) : (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                PLUS
              </span>
            )}
          </div>

          {/* Messages */}
          <div ref={containerRef} className="flex-grow overflow-auto space-y-1">
            {messages.map((m, i) => (
              <MessageBubble key={i} {...m} />
            ))}
            {isThinking && (
              <div className="text-gray-500 italic">Dentgo is typing…</div>
            )}
          </div>

          {/* Input */}
          <div className="mt-4 flex items-center space-x-2">
            <textarea
              rows={2}
              disabled={sessionMeta.isEnded}
              className="flex-grow p-2 rounded-lg bg-gray-200 focus:bg-white focus:ring-2 focus:ring-primary transition"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey
                  ? (e.preventDefault(), send())
                  : undefined
              }
            />
            <button
              type="button"
              onClick={send}
              disabled={isThinking || sessionMeta.isEnded}
              className="p-3 bg-primary rounded-lg text-white disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      {/* End Session Modal */}
      {showEndSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              End Session
            </h2>
            <p className="text-gray-600 mb-4">
              This chat will be saved in your history. You can give it a name
              (optional):
            </p>
            <input
              type="text"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Chat name"
              className="w-full p-2 border rounded mb-4 bg-gray-100 focus:bg-white transition"
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-100 text-gray-800"
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
