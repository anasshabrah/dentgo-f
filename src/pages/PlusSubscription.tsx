import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/ui/Loader";

const PlusSubscription: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleSubscribe = () => {
    navigate("/subscription-payment");
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-gray-100 min-h-screen pb-4 flex flex-col">
      <div className="mx-auto max-w-lg px-4">
        <div className="bg-white pt-4 px-4 flex flex-col items-stretch mt-5 rounded-t-3xl h-[calc(100vh-90px)] overflow-y-auto">
          <div className="flex flex-col flex-1">
            <h2 className="text-gray-800 text-3xl font-bold leading-10 pt-2 pb-4">
              Dentgo Plus
            </h2>

            <div className="flex gap-4 pb-6">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  className="text-red"
                >
                  <path
                    d="M16.25 3.75V12.5H23.75L13.75 26.25V17.5H6.25L16.25 3.75Z"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-800 text-2xl font-bold leading-7 pb-1">
                  Premium Dental AI Tools
                </h3>
                <p className="text-gray-500 text-lg leading-6">
                  Get access to advanced diagnosis, tailored treatment plans, and early beta features.
                </p>
              </div>
            </div>

            <div className="flex gap-4 pb-6">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  className="text-red"
                >
                  <path
                    d="M15 15C17.5 11.3 15 6.25 13.75 5C13.75 8.7975 11.5337 10.9263 10 12.5C8.4675 14.075 7.5 16.55 7.5 18.75C7.5 20.7391 8.29018 22.6468 9.6967 24.0533C11.1032 25.4598 13.0109 26.25 15 26.25C16.9891 26.25 18.8968 25.4598 20.3033 24.0533C21.7098 22.6468 22.5 20.7391 22.5 18.75C22.5 16.835 21.18 13.825 20 12.5C17.7675 16.25 16.5112 16.25 15 15Z"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-800 text-2xl font-bold leading-7 pb-1">
                  Priority Access
                </h3>
                <p className="text-gray-500 text-lg leading-6">
                  Enjoy uninterrupted access even when demand is high — no queues or wait times.
                </p>
              </div>
            </div>

            <div className="flex gap-4 pb-6">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  className="text-red"
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
              </div>
              <div>
                <h3 className="text-gray-800 text-2xl font-bold leading-7 pb-1">
                  Faster Results
                </h3>
                <p className="text-gray-500 text-lg leading-6">
                  Get up to 10 detailed AI responses per hour — ideal for busy dental clinics.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col items-center">
            <p className="text-gray-500 text-lg leading-6 pb-6 text-center">
              Auto-renews at $25/month. Cancel anytime.
            </p>
            <div
              className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-xs py-4 bg-white text-blue text-lg font-medium rounded-xl text-center cursor-pointer hover:bg-blue-100"
              onClick={handleSubscribe}
            >
              <Link to="/subscription-payment">Subscribe</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlusSubscription;
