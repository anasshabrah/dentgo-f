// src/components/layout/AppHeader.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../context/ModalContext";
import SideMenu from "./SideMenu";

interface Props {
  title: string;
  /** Hide burger on public pages that don’t have a menu */
  showMenu?: boolean;
  /** Show back button when the router can go back */
  showBack?: boolean;
  /** Show bell icon when user is authenticated */
  showNotifications?: boolean;
}

const AppHeader: React.FC<Props> = ({
  title,
  showMenu = false,
  showBack = false,
  showNotifications = false,
}) => {
  const navigate = useNavigate();
  const { open } = useModal();

  return (
    <header className="bg-primary text-white p-4 flex items-center gap-3">
      {showBack && (
        <button
          aria-label="Go back"
          onClick={() => navigate(-1)}
          className="p-1 rounded hover:bg-primary/80"
        >
          {/* ← icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {showMenu && (
        <button
          aria-label="Open menu"
          onClick={() => open(<SideMenu />)}
          className="p-1 rounded hover:bg-primary/80"
        >
          {/* ☰ icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      <h1 className="text-lg font-medium flex-1">{title}</h1>

      {showNotifications && (
        <button
          aria-label="Notifications"
          onClick={() => navigate("/notification")}
          className="p-1 rounded hover:bg-primary/80 relative"
        >
          {/* 🛎 icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M10 5a2 2 0 014 0c4 1 6 4 6 8v3l2 2H4l2-2v-3c0-4 2-7 6-8zm1 13h2a2 2 0 11-4 0" />
          </svg>
          {/* red dot – wire up later */}
          {/* <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-600" /> */}
        </button>
      )}
    </header>
  );
};

export default AppHeader;
