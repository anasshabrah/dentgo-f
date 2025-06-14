// src/pages/DentgoChat.tsx

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MainContainer,
  ChatContainer,
  ConversationHeader,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  TypingIndicator
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

import { askDentgo } from "@/api/chat";
import { fetchChatSession } from "@/api/chats";
import { API_BASE, FREE_MESSAGES_PER_DAY } from "@/config";
import { useStripeData } from "@/context/StripeContext";
import { useToast } from "@/components/ui/ToastProvider";
import Loader from "@/components/ui/Loader";

function isRTL(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

interface ChatMessage {
  text: string;
  sender: "You" | "Dentgo";
}

const DentgoChat: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { subscription } = useStripeData();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setTyping] = useState(false);
  const [usedToday, setUsedToday] = useState(0);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);

  const historyRef = useRef<{ role: "user" | "assistant"; text: string }[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionMeta, setSessionMeta] = useState({
    title: "Dentgo Chat",
    isEnded: false
  });

  const isBasic = !subscription?.subscriptionId;
  const greetingPlaceholder = "Hey, I'm Dentgo 😊 How can I assist today?";

  // Initialize: fetch usage and, if sessionId present, load past messages
  useEffect(() => {
    (async () => {
      // Fetch today's usage count
      try {
        const today = new Date().toISOString().slice(0, 10);
        const res = await fetch(`${API_BASE}/api/chat/count?date=${today}`, {
          credentials: "include"
        });
        if (res.ok) {
          const { count } = await res.json();
          setUsedToday(count);
        }
      } catch {
        // ignore
      }

      // Check for existing session
      const params = new URLSearchParams(search);
      const sid = params.has("sessionId") ? Number(params.get("sessionId")) : null;
      if (sid) {
        setSessionId(sid);
        try {
          const session = await fetchChatSession(sid);
          const loaded = session.messages.map((m) => ({
            text: m.content,
            sender: m.role === "USER" ? "You" : "Dentgo"
          }));
          setMessages(loaded);
          historyRef.current = loaded.map((m) => ({
            role: m.sender === "You" ? "user" : "assistant",
            text: m.text
          }));
          setSessionMeta({
            title: session.title ?? "Dentgo Chat",
            isEnded: session.isEnded
          });
        } catch {
          // ignore
        }
      }

      setLoading(false);
    })();
  }, [search]);

  const handleSend = useCallback(
    async (text: string) => {
      const prompt = text.trim();
      if (!prompt || isTyping || sessionMeta.isEnded) return;

      // Free-tier limit check
      if (isBasic && usedToday >= FREE_MESSAGES_PER_DAY) {
        addToast({
          message: `You’ve used ${usedToday}/${FREE_MESSAGES_PER_DAY} free messages today.`,
          type: "error"
        });
        setShowUpgradeBanner(true);
        return;
      }

      // Append user message
      setMessages((prev) => [...prev, { text: prompt, sender: "You" }]);
      historyRef.current.push({ role: "user", text: prompt });
      setTyping(true);

      try {
        const { sessionId: newSid, answer } = await askDentgo(
          prompt,
          historyRef.current.slice(0, -1),
          sessionId
        );

        // Save sessionId if newly created
        if (!sessionId) {
          setSessionId(newSid);
          navigate(`?sessionId=${newSid}`, { replace: true });
        }

        // Append assistant response
        setMessages((prev) => [...prev, { text: answer, sender: "Dentgo" }]);
        historyRef.current.push({ role: "assistant", text: answer });
        setUsedToday((u) => u + 1);
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          { text: `❌ ${err.message || "Something went wrong."}`, sender: "Dentgo" }
        ]);
      } finally {
        setTyping(false);
      }
    },
    [isTyping, sessionMeta.isEnded, isBasic, usedToday, addToast, sessionId, navigate]
  );

  if (loading) {
    return <Loader fullscreen />;
  }

  return (
    <MainContainer style={{ height: "100vh", background: "var(--background-color)" }}>
      <ChatContainer>
        <ConversationHeader
          title={sessionMeta.title}
          info={
            sessionMeta.isEnded
              ? "Session ended"
              : isTyping
              ? "Dentgo is typing..."
              : subscription?.subscriptionId
              ? "PLUS"
              : `Free: ${usedToday}/${FREE_MESSAGES_PER_DAY}`
          }
        />

        <MessageList
          scrollBehavior="smooth"
          typingIndicator={isTyping ? <TypingIndicator content="Dentgo is typing…" /> : null}
        >
          {messages.map((m, i) => {
            // Check for inline image markdown
            const match =
              m.text.match(/!\[[^\]]*]\((?<url>https?:\/\/[^\s)]+)\)/) ||
              m.text.match(/https?:\/\/[^\s]+\.(png|jpe?g|webp|gif)/);
            const imgUrl = match ? (match.groups?.url ?? match[0]) : undefined;
            const md = match ? m.text.replace(match[0], "") : m.text;

            return (
              <Message
                key={i}
                model={{
                  message: (
                    <>
                      {imgUrl && (
                        <div className="mb-2">
                          <img
                            src={imgUrl}
                            alt=""
                            className="max-w-full rounded-lg border border-black/5 dark:border-white/10 mb-2"
                          />
                        </div>
                      )}
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                        {md || "*Image*"}
                      </ReactMarkdown>
                    </>
                  ),
                  sentTime: "",
                  sender: m.sender,
                  direction: m.sender === "Dentgo" ? "incoming" : "outgoing"
                }}
              >
                {m.sender === "Dentgo" && <Avatar src="/favicon.png" name="Dentgo" />}
              </Message>
            );
          })}
        </MessageList>

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

        <MessageInput
          placeholder={greetingPlaceholder}
          disabled={sessionMeta.isEnded}
          attachButton={false}
          onSend={handleSend}
        />
      </ChatContainer>
    </MainContainer>
  );
};

export default DentgoChat;
