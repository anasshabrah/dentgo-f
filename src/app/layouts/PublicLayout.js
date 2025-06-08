import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppHeader from "@components/AppHeader";
const PublicLayout = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const isFullScreenPublicPage = pathname === "/" || pathname === "/login";
    const titleMap = {
        "/": "Dentgo",
        "/login": "Login",
    };
    const title = titleMap[pathname] ?? "Dentgo";
    const showBack = !isFullScreenPublicPage;
    if (isFullScreenPublicPage) {
        return (_jsx("main", { children: _jsx(Outlet, {}) }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(AppHeader, { title: title, showBack: showBack, onBack: () => navigate(-1) }), _jsx("main", { children: _jsx(Outlet, {}) })] }));
};
export default PublicLayout;
