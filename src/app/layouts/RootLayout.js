import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import GlobalModals from "@components/modal/GlobalModals";
const RootLayout = () => (_jsxs("div", { className: "flex flex-col min-h-screen bg-gray-100 font-sans", children: [_jsx("main", { className: "flex-1", children: _jsx(Outlet, {}) }), _jsx(GlobalModals, {})] }));
export default RootLayout;
