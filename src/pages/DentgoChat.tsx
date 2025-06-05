import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { askDentgo } from "../api/chat";
import { fetchChatSession, endChatSession } from "../api/chats";
import buttonBack from "../assets/images/Button-Back.png";
import chatMenuImg from "../assets/images/chat-menu-img.png";
import Loader from "../components/ui/Loader";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";

// Detect Arabic characters for RTL support
function isRTL(text) {
  return /[\u0600-\u06FF]/.test(text);
}

function MessageBubble({ text, type }) {
  const rtl = isRTL(text);

  // USER (personal) bubble: dark primary background, white text
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
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
        >
          {text}
        </ReactMarkdown>
      </div>
    );
  }

  // BOT bubble: light primary background, primary text
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
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

export default function DentgoChat() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setThinking] = useState(false);
  const historyRef = useRef([]);
  const containerRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);

  // On mount: check for sessionId in URL, fetch history if present
  useEffect(() => {
    const params = new URLSearchParams(search);
    const sid = params.has("sessionId")
      ? Number(params.get("sessionId"))
      : null;

    if (sid) {
      setSessionId(sid);
      fetchChatSession(sid)
        .then((session) => {
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
        .catch(() => {
          // If fetch fails, we just proceed without initial history
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
      const greeting =
        "Hey, I'm Dentgo 😊 How can I assist with your dental cases today?";
      setMessages([{ text: greeting, type: "bot" }]);
      historyRef.current = [{ role: "assistant", text: greeting }];
    }
  }, [loading, sessionId]);

  // Send a new prompt
  const send = async () => {
    const prompt = input.trim();
    if (!prompt || isThinking) return;

    // Append user message immediately
    setMessages((prev) => [
      ...prev,
      { text: prompt, type: "personal" },
    ]);
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
      setMessages((prev) => [
        ...prev,
        { text: answer, type: "bot" },
      ]);
      historyRef.current.push({ role: "assistant", text: answer });
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: `❌ ${err.message}`, type: "bot" },
      ]);
    } finally {
      setThinking(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-gray-100 min-h-screen pb-4 flex flex-col font-sans">
      {/* === HEADER === */}
      <header className="bg-primary pt-4 pb-8">
        <div className="mx-auto max-w-lg px-4">
          <div className="flex items-center px-2">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Go back"
            >
              <img
                src={buttonBack}
                alt="Back"
                className="h-8 w-auto"
              />
            </button>

            {/* Title */}
            <div className="flex-1 text-center">
              <h1 className="text-white text-lg font-medium">
                Dentgo
              </h1>
            </div>

            {/* Chat Menu Toggle */}
            <button
              className="p-2 rounded-full hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-white"
              data-bs-toggle="offcanvas"
              data-bs-target="#chatOffcanvas"
              aria-label="Open chat menu"
            >
              <img
                src={chatMenuImg}
                alt="Menu"
                className="h-6 w-auto"
              />
            </button>
          </div>

          {/* Chat area */}
          <div className="bg-white mt-3 rounded-t-2xl pt-3 px-4 flex flex-col h-[calc(100vh-85px)] shadow-md">
            <div className="flex-1 flex flex-col">
              {/* OFFCANVAS MENU (right side) */}
              <div
                className="offcanvas offcanvas-end"
                id="chatOffcanvas"
                tabIndex="-1"
                aria-labelledby="chatOffcanvasLabel"
              >
                <div className="offcanvas-body bg-gray-100 p-0">
                  <Link
                    to="#"
                    className="block border-b border-gray-200 py-3 text-gray-800 px-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  >
                    Rename
                  </Link>
                  <Link
                    to="#"
                    className="block border-b border-gray-200 py-3 text-gray-800 px-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  >
                    Clear Chat
                  </Link>
                  <Link
                    to="#"
                    className="block border-b border-gray-200 py-3 text-gray-800 px-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  >
                    Export Chat
                  </Link>
                  <Link
                    to="#end-session-modal"
                    data-bs-toggle="modal"
                    className="block py-3 text-gray-800 px-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  >
                    End Session
                  </Link>
                </div>
              </div>

              {/* MESSAGE LIST */}
              <div className="flex-1 overflow-y-hidden relative">
                <div
                  className="overflow-y-auto max-h-[70vh] pr-2"
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
      </header>

      {/* === END SESSION MODAL === */}
      <div
        className="modal fade"
        id="end-session-modal"
        tabIndex="-1"
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
                This session will be saved in history and can be retrieved
                anytime.
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
                    const modalEl = document.getElementById(
                      "end-session-modal"
                    );
                    if (modalEl) {
                      const bsModal =
                        bootstrap.Modal.getInstance(modalEl);
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
