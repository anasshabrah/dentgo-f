import React from "react";
import { Outlet } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import SideMenu from "../../components/layout/SideMenu";

const DashboardLayout: React.FC = () => {
  const { open } = useModal();

  return (
    <>
      {/* Top bar with hamburger */}
      <div className="bg-primary text-white p-4 flex items-center gap-3">
        <button
          aria-label="Open menu"
          onClick={() => open(<SideMenu />)}
          className="p-1 rounded hover:bg-primary/80"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <h1 className="text-lg font-medium">Dentgo</h1>
      </div>

      {/* Page content */}
      <div className="mx-auto max-w-lg px-4 pb-8">
        <Outlet />
      </div>
    </>
  );
};
export default DashboardLayout;
