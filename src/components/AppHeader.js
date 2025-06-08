import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { useModal } from "../context/ModalContext";
import SideMenu from "./SideMenu";
const AppHeader = ({ title, showMenu = false, showBack = false, showNotifications = false, onMenuClick, onBack, }) => {
    const navigate = useNavigate();
    const { open } = useModal();
    const handleMenuClick = () => {
        if (onMenuClick) {
            onMenuClick();
        }
        else {
            open(_jsx(SideMenu, {}));
        }
    };
    const handleBackClick = () => {
        if (onBack) {
            onBack();
        }
        else {
            navigate(-1);
        }
    };
    return (_jsxs("header", { className: "bg-primary text-white p-4 flex items-center gap-3", children: [showBack && (_jsx("button", { "aria-label": "Go back", onClick: handleBackClick, className: "p-1 rounded hover:bg-primary/80", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 19l-7-7 7-7" }) }) })), showMenu && (_jsx("button", { "aria-label": "Open menu", onClick: handleMenuClick, className: "p-1 rounded hover:bg-primary/80", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 6h16M4 12h16M4 18h16" }) }) })), _jsx("h1", { className: "text-lg font-medium flex-1", children: title }), showNotifications && (_jsx("button", { "aria-label": "Notifications", onClick: () => navigate("/notification"), className: "p-1 rounded hover:bg-primary/80 relative", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M10 5a2 2 0 014 0c4 1 6 4 6 8v3l2 2H4l2-2v-3c0-4 2-7 6-8zm1 13h2a2 2 0 11-4 0" }) }) }))] }));
};
export default AppHeader;
