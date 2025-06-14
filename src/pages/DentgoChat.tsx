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

import { askDentgo } from "@/api/chat";
import { fetchChatSession } from "@/api/chats";
import { API_BASE, FREE_MESSAGES_PER_DAY } from "@/config";
import { useStripeData } from "@/context/StripeContext";
import { useToast } from "@/components/ui/ToastProvider";
import Loader from "@/components/ui/Loader";

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

  // Load usage count and existing session (if any)
  useEffect(() => {
    (async () => {
      // fetch today's usage count
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

      // check for sessionId in URL
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

  // Send a message to Dentgo
  const handleSend = useCallback(
    async (text: string) => {
      const prompt = text.trim();
      if (!prompt || isTyping || sessionMeta.isEnded) return;

      if (isBasic && usedToday >= FREE_MESSAGES_PER_DAY) {
        addToast({
          message: `You’ve used ${usedToday}/${FREE_MESSAGES_PER_DAY} free messages today.`,
          type: "error"
        });
        setShowUpgradeBanner(true);
        return;
      }

      // add user message
      setMessages((prev) => [...prev, { text: prompt, sender: "You" }]);
      historyRef.current.push({ role: "user", text: prompt });
      setTyping(true);

      try {
        const { sessionId: newSid, answer } = await askDentgo(
          prompt,
          historyRef.current.slice(0, -1),
          sessionId
        );
        // set sessionId in URL if new
        if (!sessionId) {
          setSessionId(newSid);
          navigate(`?sessionId=${newSid}`, { replace: true });
        }
        // add bot response
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

  if (loading) return <Loader fullscreen />;

  return (
    <MainContainer style={{ height: "100vh", background: "var(--background-color)" }}>
      <ChatContainer>
        <ConversationHeader
          info={sessionMeta.title}
          status={
            sessionMeta.isEnded
              ? "Session ended"
              : isTyping
              ? "Dentgo is typing..."
              : "Online"
          }
          typingIndicator={
            isTyping ? <TypingIndicator content="Dentgo is typing…" /> : undefined
          }
        />

        <MessageList>
          {messages.map((m, i) => (
            <Message
              key={i}
              model={{
                message: m.text,
                sender: m.sender,
                direction: m.sender === "Dentgo" ? "incoming" : "outgoing"
              }}
            >
              <Avatar
                src={m.sender === "Dentgo" ? "/favicon.png" : undefined}
                name={m.sender}
              />
            </Message>
          ))}
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
          sendButton={!sessionMeta.isEnded}
          disabled={sessionMeta.isEnded}
          attachButton={false}
          typing={isTyping}
          onSend={handleSend}
        />
      </ChatContainer>
    </MainContainer>
  );
};

export default DentgoChat;
