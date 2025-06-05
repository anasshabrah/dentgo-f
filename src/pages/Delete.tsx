import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/ui/Loader";

const Delete: React.FC = () => {
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
        <div className="bg-blue-700 dark:bg-gray-800 mt-5 rounded-t-3xl pt-4 px-4 flex flex-col items-stretch overflow-y-auto">
          <h2 className="text-gray-900 dark:text-gray-200 text-lg font-semibold leading-6 pt-6">
            Why are you leaving PayFast?
          </h2>

          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-5 pb-6">
            We’re sorry to see you go! Authentication and account control are now handled via secure login.
          </p>

          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-5 pt-6 mb-9">
            Tapping “Delete Account” will redirect you to the centralized login to manage or confirm deletion.{" "}
            <span className="text-gray-900 dark:text-gray-200">Jessica Smith.</span>
          </p>

          <div className="flex flex-col items-center justify-center">
            <div className="w-full py-4 bg-blue-100 dark:bg-gray-700 text-blue-800 text-lg font-medium rounded-xl mb-4 flex justify-center items-center">
              <Link to="/login">Delete Account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delete;
