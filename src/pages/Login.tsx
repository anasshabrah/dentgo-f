// src/pages/Login.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Loader from "../components/ui/Loader";
import logo from "../assets/images/logo-w.png";
import AppleIcon from "../assets/images/Icon-apple.png";
import GoogleIcon from "../assets/images/Icon-google.png";
import dentaiBottom from "../assets/images/dentaiBottom.png";

import useGoogleIdentity from "../hooks/useGoogleIdentity";
import { useAuth } from "../context/AuthContext";
import { loginWithGoogle as loginWithGoogleAPI, loginWithApple } from "../api/auth";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, initializing, error, setError } = useAuth();
  const [loading, setLoading] = useState(true);
  const [googleReady, setGoogleReady] = useState(false);

  // 1) Load Google Identity script
  useGoogleIdentity();

  // 2) If already authenticated, redirect to /dentgo-gpt-home
  useEffect(() => {
    if (!initializing && isAuthenticated) {
      navigate("/dentgo-gpt-home", { replace: true });
    }
  }, [initializing, isAuthenticated, navigate]);

  // 3) Handle credential response from Google One-Tap
  const handleCredentialResponse = useCallback(
    async (response: any) => {
      const { credential } = response;
      if (!credential) {
        setError("No credentials returned. Please try again.");
        return;
      }
      try {
        const user = await loginWithGoogleAPI(credential);
        login(user);
        navigate("/dentgo-gpt-home", { replace: true });
      } catch (err: any) {
        console.error("Google login error:", err);
        setError(
          err?.message ||
            "Authentication failed. Please try again or use a different browser mode."
        );
      }
    },
    [login, navigate, setError]
  );

  // 4) Initialize Google One-Tap once the script is loaded
  useEffect(() => {
    let retryTimeout: number | null = null;

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
      } else {
        // Retry if the script hasn’t loaded
        retryTimeout = window.setTimeout(tryInitialize, 100);
      }
    };

    tryInitialize();
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [handleCredentialResponse]);

  // 1a) If we’re waiting for auth or Google initialization, show loader
  if (initializing || loading) {
    return <Loader />;
  }

  // 2a) If authenticated, we’ve already redirected above, but just in case:
  if (!initializing && isAuthenticated) {
    return <Navigate to="/dentgo-gpt-home" replace />;
  }

  return (
    <div className="bg-white h-screen w-full overflow-hidden flex flex-col relative">
      {/* ===== LOGO AND TITLE ===== */}
      <div className="flex flex-col items-center justify-center bg-primary py-6">
        <img src={logo} alt="Dentgo logo" className="w-24 h-auto object-contain" />
        <h1 className="text-white text-2xl font-semibold mt-3 text-center">
          DentGo AI
        </h1>
      </div>

      {/* ===== MAIN LOGIN SECTION ===== */}
      <div className="flex-1 w-full flex flex-col items-center justify-start px-4 pt-4 relative z-10">
        <div className="w-full max-w-md">
          <h2 className="text-center text-gray-800 text-2xl font-semibold mb-4">
            Welcome
          </h2>

          {error && (
            <div
              role="alert"
              className="bg-yellow-100 text-yellow-700 p-3 mb-4 rounded cursor-pointer"
              onClick={() => setError(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setError(null);
                }
              }}
              tabIndex={0}
            >
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            {/* Google One-Tap / Button */}
            <button
              type="button"
              disabled={!googleReady}
              className={`
                flex items-center justify-center gap-3 w-full py-3 border border-gray-300 rounded-lg 
                bg-white font-semibold text-base text-black transition
                ${googleReady ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"}
              `}
              onClick={() => {
                if (window.google?.accounts?.id && googleReady) {
                  try {
                    window.google.accounts.id.prompt();
                  } catch (err: any) {
                    if (err.name !== "AbortError") {
                      console.error("Google prompt error:", err);
                      setError("Unexpected error when opening Google login. Please try again.");
                    }
                  }
                } else {
                  alert("Google login is not ready yet.");
                }
              }}
            >
              <img src={GoogleIcon} alt="Google logo" className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>

            {/* Apple Login */}
            <button
              type="button"
              className="
                flex items-center justify-center gap-3 w-full py-3 border border-gray-300 
                rounded-lg bg-white font-semibold text-base text-black transition hover:bg-gray-100
              "
              onClick={async () => {
                try {
                  await loginWithApple();
                } catch (err: any) {
                  console.error("Apple login error:", err);
                  setError(err?.message || "Apple authentication failed. Please try again.");
                }
              }}
            >
              <img src={AppleIcon} alt="Apple logo" className="w-5 h-5" />
              <span>Continue with Apple</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ILLUSTRATION ===== */}
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
