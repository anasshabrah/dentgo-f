// src/modules/payments/components/PlanCard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStripeData } from "@/context/StripeContext";
import { API_BASE } from "@/config";

export const PlanCard: React.FC = () => {
  const { subscription, refresh } = useStripeData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // still loading?
  if (subscription === undefined) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
      </div>
    );
  }

  // FREE plan → show as Active Basic, Unlimited, Upgrade
  if (subscription.plan === "FREE") {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded space-y-4">
        <div className="flex items-center justify-between">
          <span className="inline-block px-3 py-1 text-sm font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">
            Active Basic
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Unlimited
          </span>
        </div>
        <button
          onClick={() => navigate("/subscribe")}
          className="w-full py-2 bg-primary text-white rounded transition active:scale-95 duration-150 hover:bg-primary/90"
        >
          Upgrade to Plus
        </button>
      </div>
    );
  }

  // you’ve got a paid plan but it isn’t active right now
  if (subscription.status.toLowerCase() !== "active") {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded text-center text-gray-500">
        No active paid subscription.
      </div>
    );
  }

  // PLUS plan (active)
  const renewDate = subscription.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()
    : "—";

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded space-y-4">
      <div className="flex items-center justify-between">
        <span className="inline-block px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900 rounded-full">
          Active Plus
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Renews: {renewDate}
        </span>
      </div>
      <button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          try {
            await fetch(`${API_BASE}/api/payments/cancel-subscription`, {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ subscriptionId: subscription.subscriptionId }),
            });
            refresh();
          } catch (err) {
            console.error("Cancel failed", err);
          } finally {
            setLoading(false);
          }
        }}
        className={`w-full py-2 ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
        } text-white rounded transition active:scale-95 duration-150`}
      >
        {loading ? "Cancelling…" : "Cancel Subscription"}
      </button>
    </div>
  );
};
