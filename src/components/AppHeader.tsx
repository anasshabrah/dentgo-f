// src/components/layout/AppHeader.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../@context/ModalContext";
import SideMenu from "./SideMenu";

interface Props {
  title: string;
  showMenu?: boolean;
  showBack?: boolean;
  showNotifications?: boolean;
  onMenuClick?: () => void;
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
  const { open } = useModal();

  const handleMenuClick = () => {
    if (onMenuClick) {
      onMenuClick();
    } else {
      open(<SideMenu />);
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="bg-primary text-white p-4 flex items-center gap-3">
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

      <h1 className="text-lg font-medium flex-1">{title}</h1>

      {showNotifications && (
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
    </header>
  );
};

export default AppHeader;
