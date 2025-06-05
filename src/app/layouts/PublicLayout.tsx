// src/layouts/PublicLayout.tsx
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppHeader from "../../components/AppHeader";

const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Only show "Back" if we are neither on "/" nor on "/login"
  const showBack = pathname !== "/" && pathname !== "/login";

  // Simple map of path → title
  const titleMap: Record<string, string> = {
    "/": "Dentgo",
    "/login": "Login",
    // add other public‐facing paths here if needed
  };
  const title = titleMap[pathname] ?? "Dentgo";

  return (
    <>
      {/* AppHeader expects a title and a showBack flag */}
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
