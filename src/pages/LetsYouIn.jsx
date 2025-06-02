import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import buttonBack from "../assets/images/Button-Back.png";
import logo from "../assets/images/logo-w.png";
import AppleIcon from "../assets/images/Icon-apple.png";
import GoogleIcon from "../assets/images/Icon-google.png";
import dentaiBottom from "../assets/images/dentaiBottom.png";

import { useAuth } from "../context/AuthContext";
import { loginWithApple } from "../api/auth";

export default function LetsYouIn() {
  const navigate = useNavigate();
  const { isAuthenticated, error, setError } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/DentgoGptHome", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (loading) return <Loader />;

  return (
    <div className="bg-white h-screen w-full overflow-hidden flex flex-col relative">
      {/* ========== BLUE HEADER ========== */}
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

      {/* ========== WELCOME & BUTTONS ========== */}
      <div className="flex-1 w-full flex flex-col items-center justify-start px-4 pt-4 relative z-10">
        <div className="w-full">
          <h2 className="text-center text-gray-800 text-2xl font-semibold mb-4">
            Welcome
          </h2>

          {error && (
            <div
              role="alert"
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
            {/* ===== GOOGLE BUTTON ===== */}
            <button
              type="button"
              className="flex items-center justify-center gap-3 w-full py-3 border border-gray-300 rounded-lg bg-white font-semibold text-base text-black transition hover:bg-gray-100"
              onClick={() => {
                // Always fallback to server-side OAuth for consistency
                window.location.href = "/api/auth/google";
              }}
            >
              <img src={GoogleIcon} alt="Google logo" className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>

            {/* ===== APPLE BUTTON ===== */}
            <button
              type="button"
              className="flex items-center justify-center gap-3 w-full py-3 border border-gray-300 rounded-lg bg-white font-semibold text-base text-black transition hover:bg-gray-100"
              onClick={() => {
                window.location.href = "/api/auth/apple";
              }}
            >
              <img src={AppleIcon} alt="Apple logo" className="w-5 h-5" />
              <span>Continue with Apple</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========== BOTTOM IMAGE (lower third) ========== */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 overflow-hidden">
        <img
          src={dentaiBottom}
          alt="Dental AI graphic"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
