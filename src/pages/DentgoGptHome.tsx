import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import { useAuth } from "@context/AuthContext";
import { useStripeData } from "@context/StripeContext";
import Loader from "@components/ui/Loader";
import { useMessageStore } from "@/hooks/useMessageStore";

const DentgoGptHome: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, initializing } = useAuth();
  const { subscription } = useStripeData();
  const resetMessages = useMessageStore((state) => state.reset);

  // State for showing the AI xRay modal
  const [showXRayModal, setShowXRayModal] = useState(false);

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
    // Allow both FREE and PLUS plans to start chat
    if (subscription?.plan === "FREE" || subscription?.plan === "PLUS") {
      resetMessages();
      navigate("/dentgo-chat");
    } else {
      navigate("/subscribe");
    }
  };

  const handleTryXRay = () => {
    setShowXRayModal(true);
  };

  const handleXRaySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: handle x-ray upload, send to Google Drive, etc.
    setShowXRayModal(false);
    // Optionally navigate or show confirmation
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col font-sans">
      <main className="flex-1 bg-gray-100">
        <div className="mx-auto max-w-lg px-4">
          {/* Show Dentgo Plus promo only if not PLUS */}
          {subscription?.plan !== "PLUS" && (
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
                    className="mt-4 inline-flex items-center justify-center bg-primary text-white font-medium text-base rounded-md px-4 py-3 shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    aria-label="Upgrade to Dentgo Plus"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Show AI xRay Reporter for PLUS users */}
          {subscription?.plan === "PLUS" && (
            <section
              className="mt-6 bg-white rounded-xl shadow-md overflow-hidden"
              aria-labelledby="xray-reporter-title"
            >
              <div className="p-6 space-y-2 text-center">
                <h2
                  id="xray-reporter-title"
                  className="text-2xl font-semibold text-gray-800"
                >
                  Try our AI xRay Reporter
                </h2>
                <p className="text-gray-500 text-base">
                  Upload dental x-rays to generate detailed AI reports.
                </p>
                <button
                  onClick={handleTryXRay}
                  className="mt-4 inline-flex items-center justify-center bg-primary text-white font-medium text-base rounded-md px-4 py-3 shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  aria-label="Try AI xRay Reporter"
                >
                  Try AI xRay Reporter
                </button>
              </div>
            </section>
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleStartChat}
              className="w-full bg-primary text-white font-medium text-lg rounded-xl py-4 shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              aria-label="Start chat with Dentgo"
              disabled={subscription === undefined}
            >
              Start Chat with Dentgo
            </button>
          </div>
        </div>
      </main>

      {/* XRay Upload Modal */}
      {showXRayModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setShowXRayModal(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-lg bg-white rounded-t-3xl z-60 p-6 shadow-lg">
            <button
              onClick={() => setShowXRayModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Close x-ray modal"
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
            <h3 className="text-gray-800 text-xl font-semibold mb-4 text-center">
              AI xRay Reporter
            </h3>
            <form onSubmit={handleXRaySubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="xray-file">
                  X-Ray Image
                </label>
                <input
                  id="xray-file"
                  type="file"
                  accept="image/*"
                  required
                  className="w-full" 
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="patient-name">
                  Patient Name
                </label>
                <input
                  id="patient-name"
                  type="text"
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="patient-age">
                  Patient Age
                </label>
                <input
                  id="patient-age"
                  type="number"
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="file-number">
                  File Number (Optional)
                </label>
                <input
                  id="file-number"
                  type="text"
                  className="w-full border rounded p-2"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white font-medium text-base rounded-md py-3 shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              >
                Upload and Analyze
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default DentgoGptHome;
