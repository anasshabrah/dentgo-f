// src/layouts/PublicLayout.tsx
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppHeader from "@components/AppHeader";

const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isFullScreenPublicPage = pathname === "/" || pathname === "/login";

  const titleMap: Record<string, string> = {
    "/": "Dentgo",
    "/login": "Login",
  };
  const title = titleMap[pathname] ?? "Dentgo";

  const showBack = !isFullScreenPublicPage;

  if (isFullScreenPublicPage) {
    return (
      <main>
        <Outlet />
      </main>
    );
  }

  return (
    <>
      <AppHeader
        title={title}
        showBack={showBack}
        onBack={() => navigate(-1)}
      />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default PublicLayout;
