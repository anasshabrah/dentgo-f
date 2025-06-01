import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { askDentgo } from "../api/chat";
import { fetchChatSession, endChatSession } from "../api/chats";
import buttonBack from "../assets/images/Button-Back.png";
import chatMenuImg from "../assets/images/chat-menu-img.png";
import Loader from "../components/Loader";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";

// Detect Arabic characters for RTL support
function isRTL(text) {
  return /[\u0600-\u06FF]/.test(text);
}

function MessageBubble({ text, type }) {
  const rtl = isRTL(text);
  if (type === "personal") {
    return (
      <div
        className={`float-right my-3 max-w-[80%] bg-blue-800 text-white p-3 text-sm leading-5 font-sans ${
          rtl ? "text-right" : "text-left"
        } rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl`}
        style={{ direction: rtl ? "rtl" : "ltr" }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
          {text}
        </ReactMarkdown>
      </div>
    );
  }
  return (
    <div
      className={`float-left my-3 max-w-[80%] bg-blue-100 text-blue-800 p-3 text-sm leading-5 font-sans ${
        rtl ? "text-right" : "text-left"
      } rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br`}
      style={{ direction: rtl ? "rtl" : "ltr" }}
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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setThinking] = useState(false);
  const historyRef = useRef([]);
  const containerRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const sid = params.has("sessionId") ? Number(params.get("sessionId")) : null;
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
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
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

    setMessages((m) => [...m, { text: prompt, type: "personal" }]);
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

      setMessages((m) => [...m, { text: answer, type: "bot" }]);
      historyRef.current.push({ role: "assistant", text: answer });
    } catch (err) {
      setMessages((m) => [...m, { text: `❌ ${err.message}`, type: "bot" }]);
    } finally {
      setThinking(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-gray-100 min-h-screen pb-4 flex flex-col">
      <div className="bg-blue-800 pt-4 pb-8">
        <div className="mx-auto max-w-lg px-4">
          <div className="flex items-center px-3 py-2">
            <button onClick={() => navigate(-1)} className="p-0 mr-2 text-white">
              <img src={buttonBack} alt="Back" className="h-8 w-auto" />
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-white text-lg font-medium">Dentgo</h1>
            </div>
            <div className="flex items-center">
              <button
                className="p-0 text-white"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasRight"
              >
                <img src={chatMenuImg} alt="Menu" className="h-6 w-auto mr-2" />
              </button>
            </div>
          </div>

          <div className="bg-white mt-3 rounded-t-2xl pt-3 px-4 flex flex-col h-[calc(100vh-85px)]">
            <div className="flex-1 flex flex-col">
              <div className="offcanvas offcanvas-end" id="offcanvasRight" tabIndex="-1">
                <div className="offcanvas-body bg-gray-100 p-0">
                  <Link to="#" className="block border-b border-gray-200 py-3 text-gray-800">
                    Rename
                  </Link>
                  <Link to="#" className="block border-b border-gray-200 py-3 text-gray-800">
                    Clear Chat
                  </Link>
                  <Link to="#" className="block border-b border-gray-200 py-3 text-gray-800">
                    Export Chat
                  </Link>
                  <Link
                    to="#finger-print-modal"
                    data-bs-toggle="modal"
                    className="block py-3 text-gray-800"
                  >
                    End Session
                  </Link>
                </div>
              </div>

              <div className="flex-1 overflow-y-hidden relative">
                <div className="overflow-y-auto max-h-[70vh] pr-2" ref={containerRef}>
                  {messages.map((m, i) => (
                    <MessageBubble key={i} {...m} />
                  ))}
                  {isThinking && (
                    <div className="italic text-gray-500 mt-2 bg-blue-100 text-blue-800 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br p-3 my-3 max-w-[80%] float-left">
                      <em>Dentgo is typing…</em>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-2 pb-4">
                <div className="flex-1">
                  <textarea
                    className="w-full h-12 p-2 rounded border border-transparent bg-gray-100 text-base text-gray-500 resize-none focus:border-blue-800 focus:bg-blue-100"
                    placeholder="Write here…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                  />
                </div>
                <button
                  className="w-12 h-12 rounded bg-gray-800 text-white flex items-center justify-center"
                  onClick={send}
                  disabled={isThinking}
                  aria-label="Send"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="finger-print-modal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center p-4">
              <h2 className="text-gray-800 text-2xl font-semibold leading-10 pb-2">End Session</h2>
              <p className="text-gray-500 text-sm leading-5">
                This session will be saved in history and can be retrieved anytime.
              </p>
            </div>
            <div className="flex justify-center gap-3 pb-4">
              <button
                className="bg-blue-800 text-white px-6 py-3 rounded-xl text-lg font-medium"
                onClick={async () => {
                  if (sessionId) {
                    await endChatSession(sessionId);
                  }
                  const modalEl = document.getElementById("finger-print-modal");
                  if (modalEl) {
                    const bsModal = bootstrap.Modal.getInstance(modalEl);
                    if (bsModal) bsModal.hide();
                  }
                  navigate("/DentgoGptHome");
                }}
              >
                Yes, End
              </button>
              <button
                className="bg-gray-100 text-blue-800 px-6 py-3 rounded-xl text-lg font-medium"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
