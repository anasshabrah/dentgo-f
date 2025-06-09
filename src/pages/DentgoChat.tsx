// src/pages/DentgoChat.tsx

import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { askDentgo } from "../api/chat";
import { fetchChatSession, endChatSession } from "../api/chats";
import Loader from "@components/ui/Loader";

// Detect Arabic characters for RTL support
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

  return (
    <div
      className={`my-3 max-w-[80%] p-3 text-sm leading-5 font-sans rounded-2xl ${
        type === "personal"
          ? `float-right bg-primary text-white ${
              rtl ? "text-right" : "text-left"
            } rounded-br`
          : `float-left bg-primary/10 text-primary ${
              rtl ? "text-right" : "text-left"
            } rounded-bl`
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

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<
    { text: string; type: "personal" | "bot" }[]
  >([]);
  const [input, setInput] = useState("");
  const [isThinking, setThinking] = useState(false);
  const historyRef = useRef<{ role: "user" | "assistant"; text: string }[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [chatName, setChatName] = useState("");

  // Load chat session if sessionId is in URL
  useEffect(() => {
    const params = new URLSearchParams(search);
    const sid = params.has("sessionId") ? Number(params.get("sessionId")) : null;

    if (sid) {
      setSessionId(sid);
      fetchChatSession(sid)
        .then((session) => {
          const msgs = session.messages.map((m: any) => ({
            text: m.content,
            type: m.role === "USER" ? "personal" as const : "bot" as const,
          }));
          setMessages(msgs);
          historyRef.current = msgs.map((m) => ({
            role: m.type === "personal" ? "user" : "assistant",
            text: m.text,
          }));
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [search]);

  // Scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isThinking]);

  // Show greeting if new session
  useEffect(() => {
    if (!loading && sessionId === null) {
      const greeting =
        "Hey, I'm Dentgo 😊 How can I assist with your dental cases today?";
      setMessages([{ text: greeting, type: "bot" }]);
      historyRef.current = [{ role: "assistant", text: greeting }];
    }
  }, [loading, sessionId]);

  // Send a message
  const send = async () => {
    const prompt = input.trim();
    if (!prompt || isThinking) return;

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
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { text: `❌ ${err.message || "Something went wrong."}`, type: "bot" },
      ]);
    } finally {
      setThinking(false);
    }
  };

  // End session handler
  const handleEndSession = async () => {
    if (sessionId) {
      await endChatSession(sessionId, chatName || undefined);
    }
    navigate("/dentgo-gpt-home");
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-gray-100 min-h-screen pb-4 flex flex-col font-sans">
      {/* Chat Container */}
      <div className="mx-auto max-w-lg px-4 flex-1 flex flex-col">
        <div className="bg-white mt-5 rounded-t-2xl flex flex-col flex-1 shadow-md">
          {/* Header */}
          <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-800">Dentgo Chat</h1>
            <button
              className="text-primary hover:text-primary-dark focus:outline-none"
              onClick={() => setShowEndSessionModal(true)}
              aria-label="End Chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 flex flex-col px-4">
            <div className="flex-1 overflow-y-hidden relative">
              <div
                className="overflow-y-auto max-h-full pr-2"
                ref={containerRef}
                aria-label="Chat messages"
              >
                {messages.map((m, idx) => (
                  <MessageBubble key={idx} {...m} />
                ))}

                {isThinking && (
                  <div
                    className="italic text-gray-500 mt-2 bg-primary/10 text-primary rounded-2xl p-3 my-3 max-w-[80%] float-left"
                    aria-label="Bot is typing"
                  >
                    <em>Dentgo is typing…</em>
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="flex gap-3 mt-2 pb-4">
              <div className="flex-1">
                <textarea
                  className="w-full h-12 p-2 rounded-lg border border-transparent bg-gray-100 text-base text-gray-500 resize-none focus:border-primary focus:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  placeholder="Write here…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  aria-label="Type your message"
                />
              </div>
              <button
                className="w-12 h-12 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                onClick={send}
                disabled={isThinking}
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="fill-current"
                  aria-hidden="true"
                >
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* End Session Modal */}
      {showEndSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              End Session
            </h2>
            <p className="text-gray-500 mb-4">
              This session will be saved in history and can be retrieved anytime.
            </p>
            <input
              type="text"
              className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              placeholder="Optional: Name this chat"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              aria-label="Chat name"
            />
            <div className="flex justify-center gap-3">
              <button
                className="bg-primary text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                onClick={handleEndSession}
                aria-label="Confirm end session"
              >
                Yes, End
              </button>
              <button
                className="bg-gray-100 text-primary px-6 py-3 rounded-xl text-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                onClick={() => setShowEndSessionModal(false)}
                aria-label="Cancel end session"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DentgoChat;
