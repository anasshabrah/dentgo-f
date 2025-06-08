import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Login.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Loader from "@components/ui/Loader";
import logo from "../assets/images/logo-w.png";
import AppleIcon from "../assets/images/Icon-apple.png";
import GoogleIcon from "../assets/images/Icon-google.png";
import dentaiBottom from "../assets/images/dentaiBottom.png";
import useGoogleIdentity from "@hooks/useGoogleIdentity";
import { useAuth } from "@context/AuthContext";
import { loginWithGoogle as loginWithGoogleAPI, loginWithApple } from "../api/auth";
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const Login = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated, initializing, error, setError } = useAuth();
    const [loading, setLoading] = useState(true);
    const [googleReady, setGoogleReady] = useState(false);
    // Initialize Google Identity script
    useGoogleIdentity();
    // If authenticated, redirect
    useEffect(() => {
        if (!initializing && isAuthenticated) {
            navigate("/dentgo-gpt-home", { replace: true });
        }
    }, [initializing, isAuthenticated, navigate]);
    // Handle Google One-Tap credential
    const handleCredentialResponse = useCallback(async (response) => {
        const { credential } = response;
        if (!credential) {
            setError("No credentials returned. Please try again.");
            return;
        }
        try {
            const user = await loginWithGoogleAPI(credential);
            login(user);
            navigate("/dentgo-gpt-home", { replace: true });
        }
        catch (err) {
            console.error("Google login error:", err);
            setError(err?.message ||
                "Authentication failed. Please try again or use a different browser mode.");
        }
    }, [login, navigate, setError]);
    // Initialize Google One-Tap
    useEffect(() => {
        let retryTimeout = null;
        const tryInitialize = () => {
            if (window.google?.accounts?.id) {
                if (!CLIENT_ID) {
                    console.error("Missing VITE_GOOGLE_CLIENT_ID!");
                    alert("Google Login misconfigured: missing client ID.");
                    setLoading(false);
                    return;
                }
                window.google.accounts.id.initialize({
                    client_id: CLIENT_ID,
                    callback: handleCredentialResponse,
                    ux_mode: "popup",
                });
                setGoogleReady(true);
                setLoading(false);
            }
            else {
                retryTimeout = window.setTimeout(tryInitialize, 100);
            }
        };
        tryInitialize();
        return () => {
            if (retryTimeout)
                clearTimeout(retryTimeout);
        };
    }, [handleCredentialResponse]);
    if (initializing || loading) {
        return _jsx(Loader, {});
    }
    if (!initializing && isAuthenticated) {
        return _jsx(Navigate, { to: "/dentgo-gpt-home", replace: true });
    }
    return (_jsxs("div", { className: "bg-white h-screen w-full overflow-hidden flex flex-col relative", children: [_jsxs("div", { className: "flex flex-col items-center justify-center bg-primary py-6", children: [_jsx("img", { src: logo, alt: "Dentgo logo", className: "w-24 h-auto object-contain" }), _jsx("h1", { className: "text-white text-2xl font-semibold mt-3 text-center", children: "DentGo AI" })] }), _jsx("div", { className: "flex-1 w-full flex flex-col items-center justify-start px-4 pt-4 relative z-10", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsx("h2", { className: "text-center text-gray-800 text-2xl font-semibold mb-4", children: "Welcome" }), error && (_jsx("div", { role: "alert", className: "bg-yellow-100 text-yellow-700 p-3 mb-4 rounded cursor-pointer", onClick: () => setError(null), onKeyDown: (e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    setError(null);
                                }
                            }, tabIndex: 0, children: error })), _jsxs("div", { className: "flex flex-col gap-4 w-full", children: [_jsxs("button", { type: "button", disabled: !googleReady, className: `flex items-center justify-center gap-3 w-full py-3 border border-gray-300 rounded-lg bg-white font-semibold text-base text-black transition ${googleReady ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"}`, onClick: () => {
                                        if (window.google?.accounts?.id && googleReady) {
                                            try {
                                                window.google.accounts.id.prompt();
                                            }
                                            catch (err) {
                                                if (err.name !== "AbortError") {
                                                    console.error("Google prompt error:", err);
                                                    setError("Unexpected error when opening Google login. Please try again.");
                                                }
                                            }
                                        }
                                        else {
                                            alert("Google login is not ready yet.");
                                        }
                                    }, children: [_jsx("img", { src: GoogleIcon, alt: "Google logo", className: "w-5 h-5" }), _jsx("span", { children: "Continue with Google" })] }), _jsxs("button", { type: "button", className: "flex items-center justify-center gap-3 w-full py-3 border border-gray-300 rounded-lg bg-white font-semibold text-base text-black transition hover:bg-gray-100", onClick: async () => {
                                        try {
                                            await loginWithApple();
                                        }
                                        catch (err) {
                                            console.error("Apple login error:", err);
                                            setError(err?.message ||
                                                "Apple authentication failed. Please try again.");
                                        }
                                    }, children: [_jsx("img", { src: AppleIcon, alt: "Apple logo", className: "w-5 h-5" }), _jsx("span", { children: "Continue with Apple" })] })] })] }) }), _jsx("div", { className: "absolute bottom-0 left-0 w-full h-1/3 overflow-hidden", children: _jsx("img", { src: dentaiBottom, alt: "Dental AI graphic", className: "w-full h-full object-cover" }) })] }));
};
export default Login;
