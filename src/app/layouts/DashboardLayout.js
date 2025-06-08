import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import { useModal } from "@context/ModalContext";
import SideMenu from "@components/SideMenu";
import AppHeader from "@components/AppHeader";
const DashboardLayout = () => {
    const { open } = useModal();
    return (_jsxs(_Fragment, { children: [_jsx(AppHeader, { title: "Dentgo", showMenu: true, showNotifications: true, onMenuClick: () => open(_jsx(SideMenu, {})) }), _jsx("div", { className: "mx-auto max-w-lg px-4 pb-8", children: _jsx(Outlet, {}) })] }));
};
export default DashboardLayout;
