// src/pages/DentgoChat.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { askDentgo } from '../api/chat';
import { fetchChatSession, endChatSession } from '../api/chats';
import buttonBack from '../assets/images/Button-Back.png';
import chatMenuImg from '../assets/images/chat-menu-img.png';
import Loader from '../components/Loader';

// Detect Arabic characters for RTL support
function isRTL(text) {
  return /[\u0600-\u06FF]/.test(text);
}

function MessageBubble({ text, type }) {
  const rtl = isRTL(text);
  const className = type === 'personal' ? 'message-personal' : 'message-bot';
  return (
    <div
      className={className}
      style={{ direction: rtl ? 'rtl' : 'ltr', textAlign: rtl ? 'right' : 'left' }}
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
  const [input, setInput] = useState('');
  const [isThinking, setThinking] = useState(false);
  const historyRef = useRef([]);
  const containerRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);

  // On mount: read sessionId only from URL
  useEffect(() => {
    const params = new URLSearchParams(search);
    const sid = params.has('sessionId') ? Number(params.get('sessionId')) : null;
    if (sid) {
      setSessionId(sid);
      fetchChatSession(sid)
        .then(session => {
          const msgs = session.messages.map(m => ({
            text: m.content,
            type: m.role === 'USER' ? 'personal' : 'bot'
          }));
          setMessages(msgs);
          historyRef.current = msgs.map(m => ({
            role: m.type === 'personal' ? 'user' : 'assistant',
            text: m.text
          }));
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [search]);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isThinking]);

  // Initial greeting
  useEffect(() => {
    if (!loading && sessionId === null) {
      const greeting = "Hey, I'm Dentgo 😊 How can I assist with your dental cases today?";
      setMessages([{ text: greeting, type: 'bot' }]);
      historyRef.current = [{ role: 'assistant', text: greeting }];
    }
  }, [loading, sessionId]);

  const send = async () => {
    const prompt = input.trim();
    if (!prompt || isThinking) return;

    setMessages(m => [...m, { text: prompt, type: 'personal' }]);
    historyRef.current.push({ role: 'user', text: prompt });
    setInput('');
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

      setMessages(m => [...m, { text: answer, type: 'bot' }]);
      historyRef.current.push({ role: 'assistant', text: answer });
    } catch (err) {
      setMessages(m => [...m, { text: `❌ ${err.message}`, type: 'bot' }]);
    } finally {
      setThinking(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="site_content">
      <div className="verification-main">
        <div className="container verify-screen-main p-0">

          {/* Header */}
          <div className="Dentgo-chat-menu-main d-flex align-items-center px-3 py-2">
            <button onClick={() => navigate(-1)} className="btn btn-link p-0 me-2">
              <img src={buttonBack} alt="Back" className="profile-pic" />
            </button>
            <div className="flex-grow-1 text-center">
              <h1 className="m-0 text-white">Dentgo</h1>
            </div>
            <div className="d-flex align-items-center">
              <Link to="/Notification" className="me-3 position-relative">
                {/* notification icon */}
              </Link>
              <button className="btn btn-link p-0" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight">
                <img src={chatMenuImg} alt="Menu" className="chat-menu-img chat-menu-svg" />
              </button>
            </div>
          </div>

          {/* Chat */}
          <div className="Dentgo-chat-AI-main">
            <div className="chat">
              <div className="offcanvas offcanvas-end" id="offcanvasRight" tabIndex="-1">
                <div className="offcanvas-body sidenav">
                  <Link to="#" className="space">Rename</Link>
                  <Link to="#" className="space">Clear Chat</Link>
                  <Link to="#" className="space">Export Chat</Link>
                  <Link to="#finger-print-modal" data-bs-toggle="modal">End Session</Link>
                </div>
              </div>

              <div className="messages">
                <div
                  className="messages-content custom-scroll"
                  ref={containerRef}
                  style={{ overflowY: 'auto', maxHeight: '70vh' }}
                >
                  {messages.map((m, i) => <MessageBubble key={i} {...m} />)}
                  {isThinking && (
                    <div className="message-bot typing-indicator">
                      <em>Dentgo is typing…</em>
                    </div>
                  )}
                </div>
              </div>

              <div className="chat-input">
                <div className="message-box">
                  <textarea
                    className="message-input"
                    placeholder="Write here…"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                  />
                </div>
                <button
                  className="message-submit"
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

      {/* End-session modal */}
      <div className="modal fade" id="finger-print-modal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content finger-modal-content">
            <div className="modal-body text-center">
              <h2 className="congratulations">End Session</h2>
              <p>This session will be saved in history and can be retrieved anytime.</p>
            </div>
            <div className="modal-footer justify-content-center gap-3">
              <button
                className="end-session session-btn"
                onClick={async () => {
                  if (sessionId) {
                    await endChatSession(sessionId);
                    localStorage.removeItem("currentSession");
                  }
                  navigate("/DentgoGptHome");
                }}
              >
                Yes, End
              </button>
              <button className="end-session cancel-btn" data-bs-dismiss="modal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
