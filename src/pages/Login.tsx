// src/pages/Login.tsx

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Loader from "@components/ui/Loader";
import logo from "../assets/images/logo-w.png";
import AppleIcon from "../assets/images/Icon-apple.png";
import dentaiBottom from "../assets/images/dentaiBottom.png";

import useGoogleIdentity from "@hooks/useGoogleIdentity";
import { useAuth } from "@context/AuthContext";
import {
  loginWithGoogle as loginWithGoogleAPI,
  loginWithApple,
} from "../api/auth";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, initializing, error, setError } = useAuth();
  const [loading, setLoading] = useState(true);
  const [googleReady, setGoogleReady] = useState(false);

  // Load Google Identity script
  useGoogleIdentity();

  // Redirect if already logged in
  useEffect(() => {
    if (!initializing && isAuthenticated) {
      navigate("/dentgo-gpt-home", { replace: true });
    }
  }, [initializing, isAuthenticated, navigate]);

  // Handle the credential response from Google One-Tap
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

  // Initialize Google One-Tap and render the button
  useEffect(() => {
    let retry: number | null = null;

    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        if (!CLIENT_ID) {
          console.error("Missing VITE_GOOGLE_CLIENT_ID!");
          alert("Google Login misconfigured: missing client ID.");
          setLoading(false);
          return;
        }

        // 1) initialize
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleCredentialResponse,
          ux_mode: "popup",
          auto_select: false,
        });

        // 2) render the button into our container
        window.google.accounts.id.renderButton(
          // @ts-ignore
          document.getElementById("google-signin-button"),
          { theme: "outline", size: "large", width: "100%" }
        );

        setGoogleReady(true);
        setLoading(false);
      } else {
        retry = window.setTimeout(initGoogle, 100);
      }
    };

    initGoogle();
    return () => {
      if (retry) clearTimeout(retry);
    };
  }, [handleCredentialResponse]);

  if (initializing || loading) {
    return <Loader fullscreen />;
  }
  if (!initializing && isAuthenticated) {
    return <Navigate to="/dentgo-gpt-home" replace />;
  }

  return (
    <div className="bg-white h-screen w-full overflow-hidden flex flex-col relative">
      {/* Header */}
      <div className="flex flex-col items-center justify-center bg-primary py-6">
        <img src={logo} alt="Dentgo logo" className="w-24 h-auto" />
        <h1 className="text-white text-2xl font-semibold mt-3">
          DentGo AI
        </h1>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 pt-4 relative z-10">
        <div className="w-full max-w-md">
          <h2 className="text-center text-gray-800 text-2xl font-semibold mb-4">
            Welcome
          </h2>

          {error && (
            <div
              role="alert"
              className="bg-yellow-100 text-yellow-700 p-3 mb-4 rounded"
              onClick={() => setError(null)}
              tabIndex={0}
            >
              {error}
            </div>
          )}

          {/* Google-rendered button */}
          <div
            id="google-signin-button"
            className="w-full flex justify-center py-2"
          />

          {/* Fallback manual prompt button */}
          {!googleReady && (
            <button
              type="button"
              className="mt-4 w-full py-3 bg-gray-200 rounded-lg text-gray-700"
              onClick={() => {
                if (window.google?.accounts?.id) {
                  window.google.accounts.id.prompt();
                }
              }}
            >
              Continue with Google
            </button>
          )}

          {/* Apple Login */}
          <button
            type="button"
            className="mt-4 flex items-center justify-center gap-3 w-full py-3 border border-gray-300 rounded-lg bg-white font-semibold text-base text-black hover:bg-gray-100 transition"
            onClick={async () => {
              try {
                await loginWithApple();
              } catch (err: any) {
                console.error("Apple login error:", err);
                setError(
                  err?.message || "Apple authentication failed. Please try again."
                );
              }
            }}
          >
            <img src={AppleIcon} alt="Apple logo" className="w-5 h-5" />
            <span>Continue with Apple</span>
          </button>
        </div>
      </div>

      {/* Footer illustration */}
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
