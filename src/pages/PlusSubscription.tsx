// src/pages/PlusSubscription.tsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "@components/ui/Loader";

interface Subscription {
  tier: string;
  expires: string;
}

// Simulated API call to fetch subscription details
const fetchSubscription = async (): Promise<Subscription> => {
  return new Promise<Subscription>((resolve) =>
    setTimeout(() => resolve({ tier: "Plus", expires: "2025-01-31" }), 800)
  );
};

const PlusSubscription: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchSubscription()
      .then((data) => {
        if (isMounted) setSubscription(data);
      })
      .catch((err) => console.error("Failed to fetch subscription:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubscribe = () => {
    navigate("/subscription-payment");
  };

  if (loading) {
    return <Loader fullscreen />;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-4 flex flex-col">
      <div className="mx-auto max-w-lg px-4">
        <div className="bg-white dark:bg-gray-800 mt-5 rounded-t-3xl pt-4 px-4 flex flex-col h-[calc(100vh-90px)] overflow-y-auto">
          <div className="flex flex-col flex-1">
            {/* Header */}
            <h2 className="text-gray-800 dark:text-gray-100 text-3xl font-bold leading-10 pt-2 pb-4">
              Dentgo Plus
            </h2>

            {/* Subscription Status */}
            {subscription && (
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  Tier: <span className="font-semibold">{subscription.tier}</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  Expires: <span className="font-semibold">{subscription.expires}</span>
                </p>
              </div>
            )}

            {/* Feature List */}
            <div className="space-y-6 flex-1">
              <Feature
                iconColor="#FF484D"
                title="Premium Dental AI Tools"
                description="Get access to advanced diagnosis, tailored treatment plans, and early beta features."
              />
              <Feature
                iconColor="#FF484D"
                title="Priority Access"
                description="Enjoy uninterrupted access even when demand is high — no queues or wait times."
              />
              <Feature
                iconColor="#FF484D"
                title="Faster Results"
                description="Get up to 10 detailed AI responses per hour — ideal for busy dental clinics."
              />
            </div>
          </div>

          {/* Footer with Subscribe Button */}
          <div className="mt-auto flex flex-col items-center pb-6">
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-6 pb-6 text-center">
              Auto-renews at $25/month. Cancel anytime.
            </p>
            <div
              className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-xs py-4 bg-white dark:bg-gray-700 text-blue-600 dark:text-primary text-lg font-medium rounded-xl text-center cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-600 transition"
              onClick={handleSubscribe}
            >
              <Link to="/subscription-payment">Subscribe Now</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureProps {
  iconColor: string;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ iconColor, title, description }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        className="text-red-500"
      >
        <path
          d="M16.25 3.75V12.5H23.75L13.75 26.25V17.5H6.25L16.25 3.75Z"
          stroke={iconColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <div>
      <h3 className="text-gray-800 dark:text-gray-100 text-2xl font-bold leading-7 pb-1">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-lg leading-6">
        {description}
      </p>
    </div>
  </div>
);

export default PlusSubscription;
