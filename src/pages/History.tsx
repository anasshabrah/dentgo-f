// src/pages/History.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "@components/ui/Loader";
import chatMenuImg from "../assets/images/chat-menu-img.png";
import { fetchChatSessions } from "../api/chats";

interface ChatSession {
  id: number;
  title?: string;
  startedAt: string;
  endedAt?: string | null;
}

export default function History() {
  const [loading, setLoading] = useState<boolean>(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChatSessions()
      .then((data) => setSessions(data))
      .catch((err) => setError(err.message || "Failed to load history"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader fullscreen />;
  }

  if (error) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-4 flex flex-col">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-red-500 text-base font-medium mt-10">
            Error: {error}
          </h2>
        </div>
      </div>
    );
  }

  const renderList = (items: ChatSession[], isEnded: boolean) =>
    items.map((s) => (
      <Link
        key={s.id}
        to={`/dentgo-chat?sessionId=${s.id}`}
        className="flex items-center mb-4"
      >
        <img src={chatMenuImg} alt="Chat icon" className="w-6 h-6 mr-3" />
        <div>
          <h3 className="text-gray-800 dark:text-gray-200 text-base font-bold leading-6 pb-1">
            {s.title ?? `Chat #${s.id}`}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-5">
            {isEnded
              ? `Ended ${new Date(s.endedAt!).toLocaleString()}`
              : `Started ${new Date(s.startedAt).toLocaleString()}`}
          </p>
        </div>
      </Link>
    ));

  const active = sessions.filter((s) => !s.endedAt);
  const ended = sessions.filter((s) => !!s.endedAt);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-4 flex flex-col">
      <div className="mx-auto max-w-3xl px-4 w-full">
        <div className="bg-white dark:bg-gray-800 mt-5 rounded-t-3xl px-4 flex flex-col h-[calc(100vh-90px)] overflow-y-auto w-full">
          <div className="pt-4">
            <h2 className="text-gray-800 dark:text-gray-100 text-xl font-semibold leading-7">
              Active Chats
            </h2>
            {active.length > 0 ? (
              renderList(active, false)
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-5 mb-4">
                No active chats.
              </p>
            )}

            <h2 className="text-gray-800 dark:text-gray-100 text-xl font-semibold leading-7 pt-6">
              Ended Chats
            </h2>
            {ended.length > 0 ? (
              renderList(ended, true)
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-5">
                No ended chats.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
