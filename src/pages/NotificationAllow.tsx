// src/pages/NotificationAllow.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "@components/ui/Loader";
import notificationImg from "../assets/images/notification-img.png";

const NotificationAllow: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate permission check delay
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader fullscreen />;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-4 flex flex-col">
      <div className="mx-auto max-w-lg px-4">
        <div className="bg-white dark:bg-gray-800 mt-5 rounded-t-3xl pt-6 px-4 flex flex-col items-center">
          {/* Illustration */}
          <img
            src={notificationImg}
            alt="Enable notifications"
            className="max-w-full mb-6"
          />

          {/* Explanatory Text */}
          <p className="text-gray-500 dark:text-gray-400 text-[18px] leading-[24px] text-center mb-6 px-2">
            Stay updated on offers, new features, and security alerts. You can
            manage notifications from settings later.
          </p>

          {/* Continue Button */}
          <Link
            to="/login"
            className="w-full max-w-[343px] bg-white text-[#0078D7] font-medium text-[18px] leading-[24px] text-center py-4 rounded-[12px] hover:bg-[#0064ba] hover:text-white transition"
          >
            Continue with Google or Apple
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationAllow;
