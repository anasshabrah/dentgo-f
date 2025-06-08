import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import Loader from "@components/ui/Loader";
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, initializing } = useAuth();
    // While auth is initializing, show a full-screen spinner
    if (initializing)
        return _jsx(Loader, { fullscreen: true });
    return isAuthenticated ? children : _jsx(Navigate, { to: "/login", replace: true });
};
export default ProtectedRoute;
