// src/app/layouts/RootLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import GlobalModals from "@components/modal/GlobalModals";

const RootLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
    <main className="flex-1">
      <Outlet />
    </main>
    <GlobalModals />
  </div>
);

export default RootLayout;