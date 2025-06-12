// src/components/modal/EndSessionModal.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { endChatSession } from "@/api/chats";
import { useModal } from "@/context/ModalContext";

export default function EndSessionModal({ sessionId }: { sessionId: number | null }) {
  const navigate = useNavigate();
  const { close } = useModal();
  const [chatName, setChatName] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl animate-fade-in">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">End Session</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          This chat will be saved in your history. You can give it a name (optional):
        </p>
        <input
          type="text"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          placeholder="Chat name"
          className="w-full p-2 text-sm border rounded bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 transition mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1.5 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            onClick={close}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1.5 rounded text-sm bg-primary text-white"
            onClick={async () => {
              if (sessionId != null) {
                await endChatSession(sessionId, chatName.trim() || undefined);
              }
              close();
              navigate("/dentgo-gpt-home");
            }}
          >
            Yes, End
          </button>
        </div>
      </div>
    </div>
  );
}
