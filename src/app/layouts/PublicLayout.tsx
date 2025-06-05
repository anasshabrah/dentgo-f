// src/layouts/PublicLayout.tsx
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppHeader from "../../components/AppHeader";

const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // If on Splash ("/") or Login ("/login"), do not render any header.
  const isFullScreenPublicPage = pathname === "/" || pathname === "/login";

  // A simple mapping from path → title, used when we do show the header.
  const titleMap: Record<string, string> = {
    "/": "Dentgo",
    "/login": "Login",
    // If you add other public routes that DO need a header, put them here:
    // "/allow-push": "Allow Notifications",
    // etc.
  };
  const title = titleMap[pathname] ?? "Dentgo";

  // Only show a back button on public pages other than "/" or "/login"
  const showBack = !isFullScreenPublicPage;

  if (isFullScreenPublicPage) {
    // Splash or Login: no header, full‐screen component
    return (
      <main>
        <Outlet />
      </main>
    );
  }

  // Otherwise, render the shared AppHeader + Outlet
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
