// src/pages/ContactUs.tsx

import React, { useEffect, useState } from "react";
import Loader from "@components/ui/Loader";

const ContactUs: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader fullscreen />;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
      <div className="mx-auto w-full max-w-xl px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          {/* Contact Header */}
          <h2 className="text-gray-800 dark:text-gray-100 text-2xl font-semibold text-center mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            If you run into any trouble or have questions, please reach out below.
          </p>

          {/* Contact Email Only */}
          <div className="flex items-center justify-center space-x-3 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12l-4-4-4 4m0 4l4-4 4 4"
              />
            </svg>
            <a
              href="mailto:cs@dentgo.ai"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              cs@dentgo.ai
            </a>
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-gray-800 dark:text-gray-100 text-xl font-semibold mb-2">
              About Us
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              DentGo is your intelligent dental assistant—designed to save you time and enhance patient care.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              We help you quickly diagnose cases, build customized treatment plans, and identify the materials needed.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Powered by AI, DentGo turns complex decisions into clear, actionable steps—so you can focus more on patients and less on logistics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
