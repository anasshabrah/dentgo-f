// src/layouts/PublicLayout.tsx
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppHeader from "@components/AppHeader";

const PUBLIC_NO_HEADER = ["/", "/login", "/allow-push"];

const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Treat any query or hash as the same route
  const basePath = pathname.split(/[?#]/)[0];

  const isFullScreen = PUBLIC_NO_HEADER.includes(basePath);

  const titleMap: Record<string, string> = {
    "/": "Dentgo",
    "/login": "Login",
    "/allow-push": "Enable Notifications",
  };

  const title = titleMap[basePath] ?? "Dentgo";
  const showBack = !isFullScreen;

  return (
    <>
      <AppHeader
        title={title}
        showBack={showBack}
        onBack={() => navigate(-1)}
      />
      <main className={isFullScreen ? "h-full" : ""}>
        <Outlet />
      </main>
    </>
  );
};

export default PublicLayout;
