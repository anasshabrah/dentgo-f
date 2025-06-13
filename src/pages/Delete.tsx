// src/pages/Delete.tsx
import React, { useState } from "react";
import Loader from "@components/ui/Loader";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@components/ui/ToastProvider";
import { useStripeData } from "@/context/StripeContext";
import { API_BASE } from "@/config";

const Delete: React.FC = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { subscription } = useStripeData();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "This will permanently delete your account. Proceed?"
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      // If user has a Plus subscription
      if (subscription?.subscriptionId) {
        // And it's not already marked to cancel at period end
        if (!subscription.cancelAt) {
          const res = await fetch(
            `${API_BASE}/api/payments/cancel-subscription`,
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                subscriptionId: subscription.subscriptionId,
              }),
            }
          );
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || "Failed to schedule cancellation");
          }
          const { cancelAt } = await res.json();
          const cancelDate = new Date(cancelAt * 1000).toLocaleDateString();
          addToast({
            message: `Plus plan will cancel on ${cancelDate}.`,
            type: "info",
          });
        }
      }

      // Proceed to delete account
      await deleteAccount();
      await logout();
      addToast({
        message: "Your account has been deleted successfully.",
        type: "success",
      });
      navigate("/login", { replace: true });
    } catch (err: any) {
      console.error("Delete failed", err);
      addToast({
        message: err?.message || "Could not delete account. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader fullscreen />}
      <div className="bg-white dark:bg-gray-900 min-h-screen pb-4 flex flex-col">
        <div className="mx-auto max-w-lg px-4">
          <div className="bg-gray-100 dark:bg-gray-800 mt-5 rounded-t-3xl pt-4 px-4 flex flex-col items-stretch overflow-y-auto">
            <h2 className="text-gray-900 dark:text-gray-100 text-lg font-semibold leading-6 pt-6">
              Confirm Deletion of Your Dentgo Account
            </h2>

            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-5 pb-6">
              We’re sorry to see you go! All your data will be permanently removed.
            </p>

            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-5 pb-6">
              This includes your chats, cards, subscription, and any other data associated with your account.
            </p>

            <div className="flex flex-col items-center justify-center pb-6">
              <button
                onClick={handleDelete}
                className="w-full py-4 bg-red-600 dark:bg-red-700 text-white text-lg font-medium rounded-xl flex justify-center items-center hover:bg-red-700 dark:hover:bg-red-600 transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Delete;
