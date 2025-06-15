import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import { useAuth } from "@context/AuthContext";
import { useStripeData } from "@context/StripeContext";
import Loader from "@components/ui/Loader";
import { useMessageStore } from "@/hooks/useMessageStore";
import XRayModal from "@components/XRayModal"; // Import the new component

const DentgoGptHome: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, initializing } = useAuth();
  const { subscription } = useStripeData();
  const resetMessages = useMessageStore((state) => state.reset);

  const [showXRayModal, setShowXRayModal] = useState(false);

  if (initializing) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  useEffect(() => {
    const backdrop = document.querySelector(".offcanvas-backdrop.show");
    if (backdrop) {
      backdrop.remove();
      document.body.classList.remove("offcanvas-backdrop", "modal-open");
    }
  }, []);

  const handleStartChat = () => {
    if (subscription?.plan === "FREE" || subscription?.plan === "PLUS") {
      resetMessages();
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
            aria-labelledby="xray-reporter-title"
          >
            <div className="p-6 space-y-2 text-center">
              <h2
                id="xray-reporter-title"
                className="text-2xl font-semibold text-gray-800"
              >
                AI xRay Reporter
              </h2>
              <p className="text-gray-500 text-base">
                Upload dental x-rays to generate detailed AI reports.
              </p>
              <button
                onClick={() => setShowXRayModal(true)}
                className="mt-4 inline-flex items-center justify-center bg-primary text-white font-medium text-base rounded-md px-4 py-3 shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                aria-label="Upload X-Ray"
              >
                Upload X-Ray
              </button>
            </div>
          </section>

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
        <XRayModal setShowXRayModal={setShowXRayModal} />
      )}
    </div>
  );
};

export default DentgoGptHome;
