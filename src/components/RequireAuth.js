import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import Loader from "@components/ui/Loader";
const RequireAuth = ({ children }) => {
    const { isAuthenticated, initializing } = useAuth();
    const location = useLocation();
    // While auth is initializing, show a full-screen spinner
    if (initializing)
        return _jsx(Loader, { fullscreen: true });
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true, state: { from: location } });
    }
    return children;
};
export default RequireAuth;
