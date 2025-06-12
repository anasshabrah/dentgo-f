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
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">End Session</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        This chat will be saved in your history. You can give it a name (optional):
      </p>
      <input
        type="text"
        value={chatName}
        onChange={(e) => setChatName(e.target.value)}
        placeholder="Chat name"
        className="w-full p-2 border rounded mb-4 bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 transition"
      />
      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
          onClick={close}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded bg-primary text-white"
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
  );
}
