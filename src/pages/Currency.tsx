import React, { useEffect, useState } from "react";
import Loader from "../components/ui/Loader";

const Currency: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-4">
      <div className="mx-auto max-w-lg px-4">
        <div className="bg-blue-700 mt-5 rounded-t-3xl pt-4 px-4 flex flex-col items-stretch h-[calc(100vh-90px)] overflow-y-auto">
          <div className="peer flex items-center gap-3 rounded border border-gray-200 dark:border-gray-700 p-3 mb-4">
            <input
              type="radio"
              name="currency"
              id="currency-usd"
              className="peer sr-only"
            />
            <label
              htmlFor="currency-usd"
              className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-gray-100 text-base font-medium peer-checked:bg-gray-900 dark:peer-checked:bg-gray-100 peer-checked:text-white dark:peer-checked:text-gray-900 peer-checked:rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="stroke-current"
              >
                <path
                  d="M8.5 14.6667C8.5 15.9553 9.54467 17 10.8333 17H13C14.3807 17 15.5 15.8807 15.5 14.5C15.5 13.1193 14.3807 12 13 12H11C9.61929 12 8.5 10.8807 8.5 9.5C8.5 8.11929 9.61929 7 11 7H13.1667C14.4553 7 15.5 8.04467 15.5 9.33333M12 5.5V7M12 17V18.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              USD
            </label>
          </div>

          <div className="peer flex items-center gap-3 rounded border border-gray-200 dark:border-gray-700 p-3 mb-4">
            <input
              type="radio"
              name="currency"
              id="currency-sar"
              className="peer sr-only"
            />
            <label
              htmlFor="currency-sar"
              className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-gray-100 text-base font-medium peer-checked:bg-gray-900 dark:peer-checked:bg-gray-100 peer-checked:text-white dark:peer-checked:text-gray-900 peer-checked:rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="stroke-current"
              >
                <path
                  d="M8.5 14.6667C8.5 15.9553 9.54467 17 10.8333 17H13C14.3807 17 15.5 15.8807 15.5 14.5C15.5 13.1193 14.3807 12 13 12H11C9.61929 12 8.5 10.8807 8.5 9.5C8.5 8.11929 9.61929 7 11 7H13.1667C14.4553 7 15.5 8.04467 15.5 9.33333M12 5.5V7M12 17V18.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              SAR
            </label>
          </div>

          <div className="peer flex items-center gap-3 rounded border border-gray-200 dark:border-gray-700 p-3 mb-4">
            <input
              type="radio"
              name="currency"
              id="currency-aed"
              className="peer sr-only"
            />
            <label
              htmlFor="currency-aed"
              className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-gray-100 text-base font-medium peer-checked:bg-gray-900 dark:peer-checked:bg-gray-100 peer-checked:text-white dark:peer-checked:text-gray-900 peer-checked:rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="stroke-current"
              >
                <path
                  d="M8.5 14.6667C8.5 15.9553 9.54467 17 10.8333 17H13C14.3807 17 15.5 15.8807 15.5 14.5C15.5 13.1193 14.3807 12 13 12H11C9.61929 12 8.5 10.8807 8.5 9.5C8.5 8.11929 9.61929 7 11 7H13.1667C14.4553 7 15.5 8.04467 15.5 9.33333M12 5.5V7M12 17V18.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              AED
            </label>
          </div>

          <div className="peer flex items-center gap-3 rounded border border-gray-200 dark:border-gray-700 p-3 mb-4">
            <input
              type="radio"
              name="currency"
              id="currency-qar"
              className="peer sr-only"
            />
            <label
              htmlFor="currency-qar"
              className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-gray-100 text-base font-medium peer-checked:bg-gray-900 dark:peer-checked:bg-gray-100 peer-checked:text-white dark:peer-checked:text-gray-900 peer-checked:rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="stroke-current"
              >
                <path
                  d="M8.5 14.6667C8.5 15.9553 9.54467 17 10.8333 17H13C14.3807 17 15.5 15.8807 15.5 14.5C15.5 13.1193 14.3807 12 13 12H11C9.61929 12 8.5 10.8807 8.5 9.5C8.5 8.11929 9.61929 7 11 7H13.1667C14.4553 7 15.5 8.04467 15.5 9.33333M12 5.5V7M12 17V18.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              QAR
            </label>
          </div>

          <div className="peer flex items-center gap-3 rounded border border-gray-200 dark:border-gray-700 p-3 border-b-0">
            <input
              type="radio"
              name="currency"
              id="currency-egp"
              className="peer sr-only"
            />
            <label
              htmlFor="currency-egp"
              className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-gray-100 text-base font-medium peer-checked:bg-gray-900 dark:peer-checked:bg-gray-100 peer-checked:text-white dark:peer-checked:text-gray-900 peer-checked:rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="stroke-current"
              >
                <path
                  d="M8.5 14.6667C8.5 15.9553 9.54467 17 10.8333 17H13C14.3807 17 15.5 15.8807 15.5 14.5C15.5 13.1193 14.3807 12 13 12H11C9.61929 12 8.5 10.8807 8.5 9.5C8.5 8.11929 9.61929 7 11 7H13.1667C14.4553 7 15.5 8.04467 15.5 9.33333M12 5.5V7M12 17V18.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              EGP
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Currency;
