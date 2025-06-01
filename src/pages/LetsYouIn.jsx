import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import buttonBack from "../assets/images/Button-Back.png";
import logo from "../assets/images/logo.png";
import AppleIcon from "../assets/images/Icon-apple.png";
import GoogleIcon from "../assets/images/Icon-google.png";

import useGoogleIdentity from "../hooks/useGoogleIdentity";
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

  useGoogleIdentity();
  useEffect(() => {
    loadGoogle(() => {
      if (!window.google?.accounts?.id) {
        console.error("Google Identity not loaded.");
        setError(
          "Google login is not available at the moment. Please try again later."
        );
        return;
      }
      if (!CLIENT_ID) {
        console.error("Missing REACT_APP_GOOGLE_CLIENT_ID!");
        alert("Google Login misconfigured: missing client ID.");
        return;
      }
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredential,
        ux_mode: "popup",
      });
    });
  }, [handleCredential, setError]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-gray-100 min-h-screen pb-4">
      <div className="relative bg-white h-screen">
        <div className="bg-blue bg-no-repeat bg-top h-96 relative">
          <header className="pt-8 flex items-center px-3">
            <button onClick={() => navigate(-1)} className="p-0" aria-label="Go Back">
              <img src={buttonBack} alt="Go Back" className="w-6 h-auto" />
            </button>
          </header>
          <div className="flex flex-col items-center justify-center pt-5">
            <img
              src={logo}
              alt="Dentgo logo"
              className="max-w-full max-h-full object-contain"
            />
            <h1 className="text-white text-2xl font-semibold mt-3 text-center">
              DentGo AI
            </h1>
          </div>
        </div>

        <div className="flex items-center justify-center bg-white">
          <div className="-mt-10 p-8 px-4 bg-white rounded-3xl w-full max-w-lg mx-auto shadow-lg relative z-20">
            <h2 className="text-center text-gray-800 text-2xl font-semibold leading-9">
              Welcome
            </h2>

            {error && (
              <div
                className="bg-yellow-100 text-yellow-700 p-3 mb-4 rounded cursor-pointer"
                onClick={() => setError(null)}
              >
                {error}
              </div>
            )}

            <div className="flex justify-center items-center gap-4 mt-4 mb-10">
              <button
                type="button"
                className="flex items-center justify-center gap-3 w-full p-4 border border-gray-300 rounded-lg bg-white font-semibold text-base text-black transition hover:bg-gray-100"
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
                className="flex items-center justify-center gap-3 w-full p-4 border border-gray-300 rounded-lg bg-white font-semibold text-base text-black transition hover:bg-gray-100"
                onClick={() => loginWithApple()}
              >
                <img src={AppleIcon} alt="Apple logo" className="w-5 h-5" />
                <span>Continue with Apple</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
