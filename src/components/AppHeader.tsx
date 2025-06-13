// src/components/AppHeader.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useModal } from "@/context/ModalContext";
import SideMenu from "./SideMenu";

// Chat‑specific imports
import { useStripeData } from "@/context/StripeContext";
import {
  API_BASE,
  FREE_MESSAGES_PER_DAY,
} from "@/config";
import EndSessionModal from "@/components/modal/EndSessionModal";

interface Props {
  /** Primary label shown in the middle of the header */
  title: string;
  /** Show burger menu button on the left */
  showMenu?: boolean;
  /** Show back button on the left */
  showBack?: boolean;
  /** Show notifications bell on the right */
  showNotifications?: boolean;
  /** Custom callback for menu button (otherwise opens SideMenu) */
  onMenuClick?: () => void;
  /** Custom callback for back button (otherwise navigate -1) */
  onBack?: () => void;
}

const AppHeader: React.FC<Props> = ({
  title,
  showMenu = false,
  showBack = false,
  showNotifications = false,
  onMenuClick,
  onBack,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { open } = useModal();

  /* ----------------------------------------------------------------------- */
  /* Chat‑specific state – rendered only on the /dentgo-chat route            */
  /* ----------------------------------------------------------------------- */
  const isChat = location.pathname.startsWith("/dentgo-chat");
  const query = new URLSearchParams(location.search);
  const chatSessionId = query.has("sessionId")
    ? Number(query.get("sessionId"))
    : null;

  const { subscription } = useStripeData();
  const [usedToday, setUsedToday] = useState<number>(0);

  // Fetch today’s usage count when landing on the chat route
  useEffect(() => {
    if (!isChat) return;
    const today = new Date().toISOString().slice(0, 10);
    fetch(`${API_BASE}/api/chat/count?date=${today}`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : { count: 0 }))
      .then(({ count }) => setUsedToday(count as number))
      .catch(() => {});
  }, [isChat]);

  /* ----------------------------------------------------------------------- */
  /* Generic handlers                                                         */
  /* ----------------------------------------------------------------------- */
  const handleMenuClick = () => {
    if (onMenuClick) return onMenuClick();
    open(<SideMenu />);
  };

  const handleBackClick = () => {
    if (onBack) return onBack();
    navigate(-1);
  };

  const handleTitleClick = () => {
    navigate("/dentgo-gpt-home");
  };

  /* ----------------------------------------------------------------------- */
  /* Chat End‑session button                                                  */
  /* ----------------------------------------------------------------------- */
  const endSessionBtn = isChat ? (
    <button
      aria-label="End chat session"
      onClick={() => open(<EndSessionModal sessionId={chatSessionId} />)}
      className="p-1 rounded hover:bg-primary/80 disabled:opacity-50"
    >
      {/* ✖ icon */}
      <span className="text-lg leading-none">✖</span>
    </button>
  ) : null;

  /* ----------------------------------------------------------------------- */
  /* Chat badge / counter                                                     */
  /* ----------------------------------------------------------------------- */
  const chatStatus = isChat ? (
    subscription?.subscriptionId ? (
      <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-[10px] font-semibold rounded-full">
        PLUS
      </span>
    ) : (
      <span className="text-gray-100 text-[10px]">
        Free: {usedToday}/{FREE_MESSAGES_PER_DAY}
      </span>
    )
  ) : null;

  /* ----------------------------------------------------------------------- */
  /* Render                                                                   */
  /* ----------------------------------------------------------------------- */
  return (
    <header className="bg-primary text-white p-4 flex items-center gap-3 shadow-sm select-none">
      {/* Back button */}
      {showBack && (
        <button
          aria-label="Go back"
          onClick={handleBackClick}
          className="p-1 rounded hover:bg-primary/80"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Menu burger */}
      {showMenu && (
        <button
          aria-label="Open menu"
          onClick={handleMenuClick}
          className="p-1 rounded hover:bg-primary/80"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      {/* Title – click to go home */}
      <h1
        onClick={handleTitleClick}
        className="text-lg font-medium flex-1 truncate cursor-pointer"
      >
        {isChat ? "Dentgo Chat" : title}
      </h1>

      {/* Chat badge / counter */}
      {chatStatus}

      {/* Notifications bell */}
      {showNotifications && !isChat && (
        <button
          aria-label="Notifications"
          onClick={() => navigate("/notification")}
          className="p-1 rounded hover:bg-primary/80 relative"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 5a2 2 0 014 0c4 1 6 4 6 8v3l2 2H4l2-2v-3c0-4 2-7 6-8zm1 13h2a2 2 0 11-4 0"
            />
          </svg>
        </button>
      )}

      {/* End‑session button (chat only) */}
      {endSessionBtn}
    </header>
  );
};

export default AppHeader;
