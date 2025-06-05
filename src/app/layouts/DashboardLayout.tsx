import React from "react";
import { Outlet } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import SideMenu from "../../components/SideMenu";
import AppHeader from "../../components/AppHeader";

const DashboardLayout: React.FC = () => {
  const { open } = useModal();

  return (
    <>
      {/* Shared header with burger and notifications */}
      <AppHeader
        title="Dentgo"
        showMenu
        showNotifications
        onMenuClick={() => open(<SideMenu />)}
      />

      {/* Page content */}
      <div className="mx-auto max-w-lg px-4 pb-8">
        <Outlet />
      </div>
    </>
  );
};

export default DashboardLayout;
