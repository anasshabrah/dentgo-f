import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import buttonBack from "../../assets/images/Button-Back.png";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = true }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const defaultTitle = pathname.replace("/", "") || "Dentgo";

  return (
    <header className="bg-primary pt-4 pb-4 shadow">
      <div className="mx-auto max-w-lg px-4 flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="p-0"
          >
            <img src={buttonBack} alt="Back" className="h-6 w-auto" />
          </button>
        )}
        <h1 className="text-white text-lg font-medium flex-1 truncate">
          {title ?? defaultTitle}
        </h1>
      </div>
    </header>
  );
};

export default Header;