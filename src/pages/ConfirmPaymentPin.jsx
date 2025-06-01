import React, { useEffect, useState } from "react";
import buttonBack from "../assets/images/Button-Back.png";
import createNewPinImg from "../assets/images/create-new-pin-img.png";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const ConfirmPaymentPin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-4 flex flex-col">
      <div className="bg-blue-600 pt-4 pb-8">
        <div className="mx-auto max-w-lg px-4">
          <div className="pt-2 flex items-center px-3">
            <button onClick={handleBackClick} className="mr-3 p-0" aria-label="Go back">
              <img className="w-6 h-auto" src={buttonBack} alt="Go back" />
            </button>
            <h1 className="text-white text-lg font-medium">Confirm Your Payment</h1>
          </div>
          <div className="bg-blue-700 pt-4 px-4 flex flex-col items-center mt-5 rounded-t-3xl h-[calc(100vh-90px)] overflow-y-auto">
            <img
              className="max-w-full pb-4"
              src={createNewPinImg}
              alt="Confirm payment"
            />
            <p className="text-gray-600 dark:text-gray-400 text-center text-lg leading-6 mb-8">
              Authentication is required to continue your payment.
            </p>
            <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-gray-100 dark:bg-gray-800 text-blue text-lg font-medium rounded-xl py-4 text-center hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
              <Link to="/LetYouIn">Continue with Google or Apple</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPaymentPin;
