import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import Loader from "@components/ui/Loader";
const Home = () => {
    const { user, logout, isAuthenticated, initializing } = useAuth();
    if (initializing) {
        return _jsx(Loader, {});
    }
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-100", children: _jsx("div", { className: "mx-auto max-w-lg px-4", children: _jsxs("main", { className: "p-4", children: [_jsx("h1", { className: "text-2xl font-semibold mb-4", children: "Welcome to Your Dashboard" }), _jsx("div", { className: "flex items-center justify-between", children: user && (_jsxs(_Fragment, { children: [_jsxs("span", { className: "text-gray-800 dark:text-gray-200", children: ["Hello, ", user.name] }), _jsx("button", { onClick: () => logout(), className: "bg-red-500 text-white px-3 py-1 rounded", children: "Logout" })] })) })] }) }) }));
};
export default Home;
