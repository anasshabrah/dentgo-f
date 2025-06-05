import React, { useEffect, useState } from "react";
import buttonBack from "../assets/images/Button-Back.png";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/ui/Loader";

const CancelSubscription = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-4 flex flex-col">
      <div className="bg-blue-800 pt-4 pb-8">
        <div className="mx-auto max-w-lg px-4">
          <div className="pt-2 flex items-center px-3">
            <button onClick={handleBackClick} className="mr-3 p-0" aria-label="Go back">
              <img className="w-6 h-auto" src={buttonBack} alt="Go back" />
            </button>
            <h1 className="text-white text-lg font-medium">
              Dentgo GPT Plus Subscription
            </h1>
          </div>
          <div className="bg-blue-700 pt-4 px-4 flex flex-col items-stretch mt-5 rounded-t-3xl h-[calc(100vh-90px)] overflow-y-auto">
            <h2 className="text-white text-2xl font-semibold mb-6">
              Dentgo GPT Plus
            </h2>

            <div className="flex items-start gap-3 mb-6">
              <svg
                className="w-6 h-6 text-red"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
                fill="none"
              >
                <path
                  d="M16.25 3.75V12.5H23.75L13.75 26.25V17.5H6.25L16.25 3.75Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <h3 className="text-white text-base font-semibold">
                  Premium Features
                </h3>
                <p className="text-gray-300 text-sm">
                  Plus subscribers have access to Dentgo GPT Pro and our latest
                  beta features.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 mb-6">
              <svg
                className="w-6 h-6 text-red"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
                fill="none"
              >
                <path
                  d="M15 15C17.5 11.3 15 6.25 13.75 5C13.75 8.7975 11.5337 10.9263 10 12.5C8.4675 14.075 7.5 16.55 7.5 18.75C7.5 20.7391 8.29018 22.6468 9.6967 24.0533C11.1032 25.4598 13.0109 26.25 15 26.25C16.9891 26.25 18.8968 25.4598 20.3033 24.0533C21.7098 22.6468 22.5 20.7391 22.5 18.75C22.5 16.835 21.18 13.825 20 12.5C17.7675 16.25 16.5112 16.25 15 15Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <h3 className="text-white text-base font-semibold">
                  Priority Access
                </h3>
                <p className="text-gray-300 text-sm">
                  You’ll be able to use Dentgo GPT even when demand is high.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 mb-6">
              <svg
                className="w-6 h-6 text-red"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
                fill="none"
              >
                <path
                  d="M7.04501 24.205C5.47168 22.6317 4.40023 20.6271 3.96616 18.4448C3.53209 16.2626 3.75488 14.0006 4.60637 11.9449C5.45786 9.88924 6.8998 8.13224 8.74985 6.89608C10.5999 5.65992 12.775 5.00012 15 5.00012C17.225 5.00012 19.4001 5.65992 21.2502 6.89608C23.1002 8.13224 24.5421 9.88924 25.3936 11.9449C26.2451 14.0006 26.4679 16.2626 26.0338 18.4448C25.5998 20.6271 24.5283 22.6317 22.955 24.205"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 11.25L15 16.25"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <h3 className="text-white text-base font-semibold">
                  Ultra Fast
                </h3>
                <p className="text-gray-300 text-sm">
                  Enjoy even faster response speeds when using Dentgo GPT Pro.
                </p>
              </div>
            </div>

            <div className="mt-auto flex flex-col items-center">
              <p className="text-gray-300 text-sm mb-4 text-center">
                Auto-renews for $25/month until canceled. Due date is 15 Dec
                2024
              </p>
              <Link
                to="/lets-you-in"
                className="w-full max-w-sm bg-white text-blue text-lg font-medium rounded-xl py-4 text-center hover:bg-gray-100"
              >
                Cancel My Subscription
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscription;
