// src/pages/TermsAndPrivacy.tsx

import React, { useEffect, useState } from "react";
import Loader from "../components/ui/Loader";

const TermsAndPrivacy: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader fullscreen />;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-4 flex flex-col">
      <div className="mx-auto max-w-lg px-4">
        <div className="bg-white dark:bg-gray-800 mt-5 rounded-t-3xl pt-4 px-4 flex flex-col h-[calc(100vh-90px)] overflow-y-auto">
          {/* Last Updated */}
          <div className="pt-2 pb-4 border-b border-gray-200 dark:border-gray-700 w-full">
            <p className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              <strong>Last updated: 31/05/2025</strong>
            </p>

            {/* Introduction */}
            <p className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              Welcome to DentGo (“we,” “us,” or “our”). This document contains both our Terms of Service and our Privacy Policy. By using DentGo’s web app, you agree to comply with these terms and acknowledge how we handle your data.
            </p>

            <h2 className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              1. Introduction
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              DentGo is a chatbot web application specializing in dental assistance. Our service provides free daily messaging and the option to upgrade to a premium subscription for additional features.
            </p>

            <h2 className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              2. Account Registration
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              Users must create an account using Google or Apple authentication. We do not collect any other login credentials. There is no minimum age requirement, but parents or guardians should supervise minors’ use.
            </p>

            <h2 className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              3. Usage Terms
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              You may use DentGo to chat with our dental chatbot for information and support. Misuse of the service—including but not limited to spamming, harassment, or any illegal activity—is prohibited. We reserve the right to suspend or terminate accounts that violate these terms.
            </p>

            <h2 className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              4. Subscriptions and Payments
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              DentGo offers one free daily message for all users. Additional features, such as unlimited messaging, require a monthly subscription. Subscription fees are clearly stated before purchase and are billed monthly.
            </p>

            <h2 className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              5. Privacy Policy
            </h2>
            <h3 className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              5.1 Data Collection
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              We only collect your email address via Google or Apple sign-in. We store your chatbot conversations to allow you to access your chat history. No sensitive health information is collected. We do not collect or process any additional personal data.
            </p>

            <h3 className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              5.2 Cookies and Analytics
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              We use cookies solely for Google Analytics 4 (GA4) to understand usage patterns and improve the service.
            </p>

            <h3 className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              5.3 Data Sharing
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              We do <strong>not</strong> share your data with third parties. Your information is used strictly for providing and improving the DentGo service.
            </p>

            <h3 className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              5.4 Data Security
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              We use industry-standard encryption and secure hosting to protect your data.
            </p>

            <h2 className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              6. Jurisdiction
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              DentGo is based in Wyoming, USA. These Terms and Privacy Policy are governed by the laws of Wyoming and the United States.
            </p>

            <h2 className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              7. Contact Us
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              If you have any questions about these Terms or our Privacy practices, please contact us at:{" "}
              <a href="mailto:cs@dentgo.ai" className="underline text-blue-600 dark:text-blue-400">
                cs@dentgo.ai
              </a>
              .
            </p>

            <h2 className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              8. Updates
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-base leading-6 pb-2">
              We may update these Terms and Privacy Policy from time to time. Changes will be posted on this page with the new effective date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacy;
