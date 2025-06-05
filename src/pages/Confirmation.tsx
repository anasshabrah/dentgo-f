// src/pages/Confirmation.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/ui/Loader";
import confirmationImg from "../assets/images/confirmation-img.png";

const Confirmation: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader fullscreen />;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-4 flex flex-col">
      <div className="mx-auto max-w-lg px-4">
        <div className="bg-blue-700 pt-4 px-4 flex flex-col items-center mt-5 rounded-t-3xl h-[calc(100vh-90px)] overflow-y-auto">
          {/* Confirmation Image */}
          <div className="flex items-center justify-center">
            <img
              src={confirmationImg}
              alt="Confirmation"
              className="max-w-full pb-4"
            />
          </div>

          {/* Confirmation Text */}
          <h2 className="text-gray-800 dark:text-gray-200 text-center text-2xl font-semibold leading-8 pb-3">
            Success!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center text-lg leading-6 my-4">
            Your action has been confirmed. Thank you for choosing Dentgo!
          </p>

          {/* CTA Button */}
          <Link
            to="/alert"
            className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-blue-100 text-blue-600 text-lg font-medium rounded-xl py-4 text-center hover:bg-blue-700 hover:text-white transition"
          >
            Go To Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
