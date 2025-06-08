import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, } from "react";
import { loginWithGoogle as loginWithGoogleAPI } from "../api/auth";
import { API_BASE } from "../config";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);
    const [error, setError] = useState(null);
    // 1) Try to fetch the current user; if 401, attempt refresh
    const fetchUser = async () => {
        try {
            // Call /api/users/me directly (no short‐circuit).
            let response = await fetch(`${API_BASE}/api/users/me`, {
                credentials: "include",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
            });
            if (response.status === 401) {
                // accessToken missing/expired → try refresh
                const refreshResp = await fetch(`${API_BASE}/api/auth/refresh`, {
                    method: "POST",
                    credentials: "include",
                    mode: "cors",
                    headers: { "Content-Type": "application/json" },
                });
                if (refreshResp.ok) {
                    // if refresh succeeded, try /api/users/me again
                    response = await fetch(`${API_BASE}/api/users/me`, {
                        credentials: "include",
                        mode: "cors",
                        headers: { "Content-Type": "application/json" },
                    });
                }
            }
            if (response.ok) {
                // — Instead of calling response.json() directly, first read response as text
                const text = await response.text();
                try {
                    const parsed = JSON.parse(text);
                    setUser(parsed.user || null);
                }
                catch {
                    // If parsing fails, assume no valid JSON user object → not authenticated
                    setUser(null);
                }
            }
            else {
                setUser(null);
            }
        }
        catch (err) {
            console.error("AuthContext: Error fetching user:", err);
            setUser(null);
        }
        finally {
            setInitializing(false);
        }
    };
    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const login = (userData) => {
        setUser(userData);
    };
    const loginWithGoogle = async (credential) => {
        setError(null);
        try {
            const userData = await loginWithGoogleAPI(credential);
            setUser(userData);
        }
        catch (err) {
            console.error("AuthContext: Google login error:", err);
            if (err.message.includes("AbortError") ||
                err.message.includes("NetworkError")) {
                setError("Google login may be blocked in Private Browsing Mode or due to browser settings. Please try using a standard browser window or allow third-party cookies.");
            }
            else {
                setError(err.message || "Google login failed. Please try again.");
            }
        }
    };
    const logout = async () => {
        try {
            const { logout: apiLogout } = await import("../api/auth");
            await apiLogout();
            setUser(null);
        }
        catch (err) {
            console.error("AuthContext: Error logging out:", err);
            setUser(null);
        }
    };
    const isAuthenticated = Boolean(user);
    return (_jsx(AuthContext.Provider, { value: {
            user,
            login,
            loginWithGoogle,
            logout,
            isAuthenticated,
            initializing,
            error,
            setError,
        }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
