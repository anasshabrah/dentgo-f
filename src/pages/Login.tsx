// src/pages/Login.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Loader from "@components/ui/Loader";
import logo from "@/assets/images/logo-w.png";
import AppleIcon from "@/assets/images/Icon-apple.png";
import GoogleIcon from "@/assets/images/Icon-google.png";
import dentaiBottom from "@/assets/images/dentaiBottom.png";

import { useAuth } from "@context/AuthContext";
import { loginWithGoogle as loginWithGoogleAPI, loginWithApple } from "@/api/auth";
import { useToast } from "@components/ui/ToastProvider";
import { loadGoogle } from "@/lib/google";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Login: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { login, isAuthenticated, initializing } = useAuth();

  // New loading flags
  const [initializingGoogle, setInitializingGoogle] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!initializing && isAuthenticated) {
      navigate("/dentgo-gpt-home", { replace: true });
    }
  }, [initializing, isAuthenticated, navigate]);

  const handleCredentialResponse = useCallback(
    async (response: any) => {
      const { credential } = response;
      if (!credential) {
        setGoogleLoading(false);
        addToast({ message: "No credentials returned. Please try again.", type: "error" });
        return;
      }
      try {
        const user = await loginWithGoogleAPI(credential);
        login(user);
        navigate("/dentgo-gpt-home", { replace: true });
      } catch (err: any) {
        console.error("Google login error:", err);
        addToast({
          message:
            err?.message ||
            "Authentication failed. Please try again or use a different browser mode.",
          type: "error",
        });
      } finally {
        setGoogleLoading(false);
      }
    },
    [login, navigate, addToast]
  );

  // Load Google's One-Tap SDK and initialize
  useEffect(() => {
    let retryTimeout: number | null = null;

    loadGoogle(() => {
      const tryInitialize = () => {
        if ((window as any).google?.accounts?.id) {
          if (!CLIENT_ID) {
            console.error("Missing VITE_GOOGLE_CLIENT_ID!");
            addToast({ message: "Google Login misconfigured: missing client ID.", type: "error" });
            setInitializingGoogle(false);
            return;
          }

          (window as any).google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: handleCredentialResponse,
            ux_mode: "popup",
          });

          setInitializingGoogle(false);
        } else {
          retryTimeout = window.setTimeout(tryInitialize, 100);
        }
      };

      tryInitialize();
    });

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [handleCredentialResponse, addToast]);

  // If any login is in progress, show a full-screen loader
  if (initializing || initializingGoogle || googleLoading || appleLoading) {
    return <Loader fullscreen />;
  }

  if (!initializing && isAuthenticated) {
    return <Navigate to="/dentgo-gpt-home" replace />;
  }

  return (
    <div className="bg-white h-screen w-full overflow-hidden flex flex-col relative">
      {/* Header */}
      <div className="flex flex-col items-center justify-center bg-primary py-6">
        <img src={logo} alt="Dentgo logo" className="w-24 h-auto object-contain" />
        <h1 className="text-white text-2xl font-semibold mt-3 text-center">DentGo AI</h1>
      </div>

      {/* Main Login */}
      <div className="flex-1 w-full flex flex-col items-center justify-start px-4 pt-4 relative z-10">
        <div className="w-full max-w-md">
          <h2 className="text-center text-gray-800 text-2xl font-semibold mb-4">Welcome</h2>

          <div className="flex flex-col gap-4 w-full">
            {/* Google Login */}
            <button
              type="button"
              disabled={googleLoading}
              className={`flex items-center justify-center gap-3 w-full py-3 border border-gray-300 rounded-lg bg-white font-semibold text-base text-black transition active:scale-[.97] duration-150 ${
                googleLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
              onClick={() => {
                setGoogleLoading(true);
                try {
                  (window as any).google.accounts.id.prompt();
                } catch (err: any) {
                  setGoogleLoading(false);
                  if (err.name !== "AbortError") {
                    console.error("Google prompt error:", err);
                    addToast({
                      message: "Unexpected error when opening Google login. Please try again.",
                      type: "error",
                    });
                  }
                }
              }}
            >
              <img src={GoogleIcon} alt="Google logo" className="w-5 h-5" />
              <span>{googleLoading ? "Loading…" : "Continue with Google"}</span>
            </button>

            {/* Apple Login */}
            <button
              type="button"
              disabled={appleLoading}
              className={`flex items-center justify-center gap-3 w-full py-3 border border-gray-300 rounded-lg bg-white font-semibold text-base text-black transition active:scale-[.97] duration-150 ${
                appleLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
              onClick={async () => {
                setAppleLoading(true);
                try {
                  await loginWithApple();
                } catch (err: any) {
                  setAppleLoading(false);
                  console.error("Apple login error:", err);
                  addToast({
                    message: err?.message || "Apple authentication failed. Please try again.",
                    type: "error",
                  });
                }
              }}
            >
              <img src={AppleIcon} alt="Apple logo" className="w-5 h-5" />
              <span>{appleLoading ? "Redirecting…" : "Continue with Apple"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Illustration */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 overflow-hidden">
        <img
          src={dentaiBottom}
          alt="Dental AI graphic"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
