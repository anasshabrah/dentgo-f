import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "../../components/layout/AppHeader";

const PublicLayout: React.FC = () => {
  // Crude path-to-title map – expand as needed
  const { pathname } = useLocation();
  const title = ({
    "/login": "Login",
    "/": "Dentgo",
  } as Record<string, string>)[pathname] ?? "Dentgo";

  return (
    <>
      {/* Shared header with back button */}
      <AppHeader
        title={title}
        showBack={pathname !== "/"}
      />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default PublicLayout;
