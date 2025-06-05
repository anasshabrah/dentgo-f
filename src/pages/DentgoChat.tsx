import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { askDentgo } from "../api/chat";
import { fetchChatSession, endChatSession } from "../api/chats";
import Loader from "../components/ui/Loader";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";

// Detect Arabic characters for RTL support
function isRTL(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

function MessageBubble({ text, type }: { text: string; type: "personal" | "bot" }) {
  const rtl = isRTL(text);

  if (type === "personal") {
    return (
      <div
        className={`
          float-right 
          my-3 
          max-w-[80%] 
          bg-primary 
          text-white 
          p-3 
          text-sm 
          leading-5 
          font-sans 
          ${rtl ? "text-right" : "text-left"} 
          rounded-tl-2xl 
          rounded-tr-2xl 
          rounded-br-2xl 
          rounded-bl
        `}
        style={{ direction: rtl ? "rtl" : "ltr" }}
        aria-label="Your message"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
          {text}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div
      className={`
        float-left 
        my-3 
        max-w-[80%] 
        bg-primary/10 
        text-primary 
        p-3 
        text-sm 
        leading-5 
        font-sans 
        ${rtl ? "text-right" : "text-left"} 
        rounded-tl-2xl 
        rounded-tr-2xl 
        rounded-bl-2xl 
        rounded-br
      `}
      style={{ direction: rtl ? "rtl" : "ltr" }}
      aria-label="Bot response"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {text}
      </ReactMarkdown>
    </div>
  );
}

export default function DentgoChat() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<{ text: string; type: "personal" | "bot" }[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setThinking] = useState(false);
  const historyRef = useRef<{ role: "user" | "assistant"; text: string }[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);

  // On mount: check for sessionId in URL, fetch history if present
  useEffect(() => {
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
        .catch(() => {
          // Proceed without initial history if fetch fails
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [search]);

  // Scroll to bottom whenever messages or thinking state change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isThinking]);

  // If not loading and no existing session, show greeting
  useEffect(() => {
    if (!loading && sessionId === null) {
      const greeting = "Hey, I'm Dentgo 😊 How can I assist with your dental cases today?";
      setMessages([{ text: greeting, type: "bot" }]);
      historyRef.current = [{ role: "assistant", text: greeting }];
    }
  }, [loading, sessionId]);

  // Send a new prompt
  const send = async () => {
    const prompt = input.trim();
    if (!prompt || isThinking) return;

    // Append user message immediately
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

      // If this is the first question, update sessionId and URL
      if (!sessionId) {
        setSessionId(newSid);
        navigate(`?sessionId=${newSid}`, { replace: true });
      }

      // Append bot’s answer
      setMessages((prev) => [...prev, { text: answer, type: "bot" }]);
      historyRef.current.push({ role: "assistant", text: answer });
    } catch (err: any) {
      setMessages((prev) => [...prev, { text: `❌ ${err.message}`, type: "bot" }]);
    } finally {
      setThinking(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-gray-100 min-h-screen pb-4 flex flex-col font-sans">
      {/* === CHAT AREA === */}
      <div className="mx-auto max-w-lg px-4 flex-1 flex flex-col">
        <div className="bg-white mt-5 rounded-t-2xl pt-3 px-4 flex flex-col flex-1 shadow-md">
          <div className="flex-1 flex flex-col">
            {/* MESSAGE LIST */}
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
                    className="
                      italic 
                      text-gray-500 
                      mt-2 
                      bg-primary/10 
                      text-primary 
                      rounded-tl-2xl 
                      rounded-tr-2xl 
                      rounded-bl-2xl 
                      rounded-br 
                      p-3 
                      my-3 
                      max-w-[80%] 
                      float-left
                    "
                    aria-label="Bot is typing"
                  >
                    <em>Dentgo is typing…</em>
                  </div>
                )}
              </div>
            </div>

            {/* INPUT AREA */}
            <div className="flex gap-3 mt-2 pb-4">
              <div className="flex-1">
                <textarea
                  className="
                    w-full 
                    h-12 
                    p-2 
                    rounded-lg 
                    border 
                    border-transparent 
                    bg-gray-100 
                    text-base 
                    text-gray-500 
                    resize-none 
                    focus:border-primary 
                    focus:bg-primary/10 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-primary/50 
                    transition
                  "
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
                className="
                  w-12 
                  h-12 
                  rounded-lg 
                  bg-primary 
                  text-white 
                  flex 
                  items-center 
                  justify-center 
                  hover:bg-primary/90 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-primary/50 
                  transition
                "
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

      {/* === END SESSION MODAL === */}
      <div
        className="modal fade"
        id="end-session-modal"
        tabIndex={-1}
        aria-labelledby="endSessionModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center p-4">
              <h2
                id="endSessionModalLabel"
                className="text-gray-800 text-2xl font-semibold mb-2"
              >
                End Session
              </h2>
              <p className="text-gray-500 text-base mb-4">
                This session will be saved in history and can be retrieved anytime.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  className="
                    bg-primary 
                    text-white 
                    px-6 
                    py-3 
                    rounded-xl 
                    text-lg 
                    font-medium 
                    hover:bg-primary/90 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-primary/50 
                    transition
                  "
                  onClick={async () => {
                    if (sessionId) {
                      await endChatSession(sessionId);
                    }
                    const modalEl = document.getElementById("end-session-modal");
                    if (modalEl) {
                      const bsModal = bootstrap.Modal.getInstance(modalEl);
                      if (bsModal) bsModal.hide();
                    }
                    navigate("/dentgo-gpt-home");
                  }}
                  aria-label="Confirm end session"
                >
                  Yes, End
                </button>
                <button
                  className="
                    bg-gray-100 
                    text-primary 
                    px-6 
                    py-3 
                    rounded-xl 
                    text-lg 
                    font-medium 
                    hover:bg-gray-200 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-primary/50 
                    transition
                  "
                  data-bs-dismiss="modal"
                  aria-label="Cancel end session"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
