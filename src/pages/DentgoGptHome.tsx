// src/pages/DentgoGptHome.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import plusRobot from "@/assets/images/plus-robort.png";
import { useAuth } from "@context/AuthContext";
import { useStripeData } from "@/context/StripeContext";
import Loader from "@components/ui/Loader";
import { useMessageStore } from "@/hooks/useMessageStore";

const DentgoGptHome: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, initializing } = useAuth();
  const { subscription } = useStripeData();
  const resetMessages = useMessageStore((state) => state.reset);
  const [isVisible, setIsVisible] = useState(false);

  // Show loading while auth initializes
  if (initializing) {
    return <Loader />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Clean up any off-canvas backdrops left over
  useEffect(() => {
    const backdrop = document.querySelector(".offcanvas-backdrop.show");
    if (backdrop) {
      backdrop.remove();
      document.body.classList.remove("offcanvas-backdrop", "modal-open");
    }
  }, []);

  const handlePlusSubscription = () => {
    navigate("/subscribe");
  };

  const handleStartChat = () => {
    // subscription.plan will be "PLUS" for paid users
    if (subscription?.plan === "PLUS") {
      // Reset any existing chat state
      resetMessages();
      // Navigate to a fresh chat session
      navigate("/dentgo-chat");
    } else {
      navigate("/subscribe");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col font-sans">
      <main className="flex-1 bg-gray-100">
        <div className="mx-auto max-w-lg px-4">
          <section
            className="mt-6 bg-white rounded-xl shadow-md overflow-hidden"
            aria-labelledby="dentgo-plus-title"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 p-6 space-y-2">
                <h2
                  id="dentgo-plus-title"
                  className="text-2xl font-semibold text-gray-800"
                >
                  Dentgo Plus
                </h2>
                <p className="text-gray-500 text-base">
                  Unlock Dentgo premium to access all features.
                </p>
                <button
                  onClick={handlePlusSubscription}
                  className="mt-4 inline-flex items-center justify-center bg-primary text-white font-medium text-base rounded-lg px-4 py-3 shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  aria-label="Upgrade to Dentgo Plus"
                >
                  Upgrade
                </button>
              </div>
              <div className="flex-1">
                <img
                  src={plusRobot}
                  alt="Dentgo Plus robot illustration"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </section>
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleStartChat}
              className="w-full bg-primary text-white font-medium text-lg rounded-xl py-4 shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              aria-label="Start chat with Dentgo"
            >
              Start Chat with Dentgo
            </button>
          </div>
        </div>
      </main>

      {isVisible && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsVisible(false)}
            aria-hidden="true"
          />
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg bg-white rounded-t-3xl z-60 p-6 shadow-lg">
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Close popup"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="text-center pt-4">
              <img
                src={logo}
                alt="Dentgo AI Logo"
                className="mx-auto w-24 h-24"
              />
              <h3 className="text-gray-800 text-2xl font-semibold mt-4">
                Dentgo AI Chatbot
              </h3>
              <p className="mt-2 text-gray-500 text-base leading-6 px-2">
                Add the Dentgo Dental AI Assistant to your home screen for fast,
                seamless access—just like a regular app.
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  className="inline-flex items-center bg-primary text-white text-lg font-medium py-3 px-6 rounded-lg shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  aria-label="Add Home Screen"
                >
                  Add Home Screen
                  <span className="ml-2">➔</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DentgoGptHome;
