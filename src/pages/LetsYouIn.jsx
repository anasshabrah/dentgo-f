import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import buttonBack from "../assets/images/Button-Back.png";
import logo from "../assets/images/logo-w.png";
import AppleIcon from "../assets/images/Icon-apple.png";
import GoogleIcon from "../assets/images/Icon-google.png";
import dentaiBottom from "../assets/images/dentaiBottom.png";

import { loadGoogle } from "../lib/google";

import { useAuth } from "../context/AuthContext";
import { loginWithGoogle, loginWithApple } from "../api/auth";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function LetsYouIn() {
  const navigate = useNavigate();
  const { login, isAuthenticated, error, setError } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/DentgoGptHome", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleCredential = useCallback(
    async ({ credential }) => {
      try {
        const user = await loginWithGoogle(credential);
        login(user);
        navigate("/DentgoGptHome", { replace: true });
      } catch (err) {
        console.error("Google login error:", err);
        setError(
          "Authentication failed. Please try again or use a different browser mode."
        );
      }
    },
    [login, navigate, setError]
  );

  const handleApple = useCallback(async () => {
    try {
      const user = await loginWithApple();
      login(user);
      navigate("/DentgoGptHome", { replace: true });
    } catch (err) {
      console.error("Apple login error:", err);
      setError("Apple authentication failed. Please try again.");
    }
  }, [login, navigate, setError]);

  useEffect(() => {
    loadGoogle(() => {
      if (!window.google?.accounts?.id) {
        console.error("Google Identity not loaded.");
        setError(
          "Google login is not available at the moment. Please try again later."
        );
        setLoading(false);
        return;
      }
      if (!CLIENT_ID) {
        console.error("Missing REACT_APP_GOOGLE_CLIENT_ID!");
        alert("Google Login misconfigured: missing client ID.");
        setLoading(false);
        return;
      }
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredential,
        ux_mode: "popup",
      });
      setLoading(false);
    });
  }, [handleCredential, setError]);

  if (loading) return <Loader />;

  return (
    <div className="bg-white h-screen w-full overflow-hidden flex flex-col relative">
      {/* Blue Header */}
      <div className="flex-none bg-primary relative">
        <header className="pt-6 px-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-0"
            aria-label="Go Back"
          >
            <img src={buttonBack} alt="Go Back" className="w-6 h-auto" />
          </button>
        </header>
        <div className="flex flex-col items-center justify-center py-4">
          <img
            src={logo}
            alt="Dentgo logo"
            className="w-24 h-auto object-contain"
          />
          <h1 className="text-white text-2xl font-semibold mt-3 text-center">
            DentGo AI
          </h1>
        </div>
      </div>

      {/* Welcome + Buttons */}
      <div className="flex-1 w-full flex flex-col items-center justify-start px-4 pt-4 relative z-10">
        <div className="w-full">
          <h2 className="text-center text-gray-800 text-2xl font-semibold mb-4">
            Welcome
          </h2>

          {error && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => setError(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setError(null);
                }
              }}
              className="bg-yellow-100 text-yellow-700 p-3 mb-4 rounded cursor-pointer"
            >
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            <button
              type="button"
              className="flex items-center justify-center gap-3 w-full py-3 border border-gray-300 rounded-lg bg-white font-semibold text-base text-black transition hover:bg-gray-100"
              onClick={() => {
                if (window.google?.accounts?.id) {
                  window.google.accounts.id.prompt();
                } else {
                  alert("Google login is not ready yet.");
                }
              }}
            >
              <img src={GoogleIcon} alt="Google logo" className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-3 w-full py-3 border border-gray-300 rounded-lg bg-white font-semibold text-base text-black transition hover:bg-gray-100"
              onClick={handleApple}
            >
              <img src={AppleIcon} alt="Apple logo" className="w-5 h-5" />
              <span>Continue with Apple</span>
            </button>
          </div>
        </div>
      </div>

      {/* Display only the dotsPatternBottom image in the lower third */}
      <div className="absolute bottom-0 left-0 w-full h-40">
        <img
          src={dentaiBottom}
          alt="Dental AI graphic"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
