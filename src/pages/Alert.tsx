import React, { useEffect, useState } from "react";
import alertImg from "../assets/images/alert-img.png";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/ui/Loader";

const Alert: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const goToLogin = () => navigate("/login");
  const goToHome = () => navigate("/dentgo-gpt-home");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-4">
      <div className="mx-auto max-w-lg px-4">
        <div className="bg-primary pt-4 px-4 flex flex-col items-center mt-5 rounded-t-3xl h-screen overflow-y-auto">
          <div className="flex items-center justify-center">
            <img className="max-w-full pb-4" src={alertImg} alt="Alert" />
          </div>
          <h2 className="text-gray-800 dark:text-gray-200 text-center text-2xl font-semibold leading-8 pb-3">
            Sorry! Your Order Has Failed!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center text-lg leading-6 pb-5 my-4">
            Venenatis praesent lorem tincidunt morbi ultrices quis dolor. Pellentesque nulla.
          </p>

          <button
            onClick={goToLogin}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-xs bg-blue-100 dark:bg-gray-700 text-center text-lg font-medium leading-6 rounded-lg py-4 z-10"
          >
            <Link to="/login" className="text-blue-700 dark:text-primary">
              Try Again
            </Link>
          </button>

          <button
            onClick={goToHome}
            className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-xs bg-blue-700 text-white text-lg font-medium leading-6 rounded-lg py-4 z-10"
          >
            <Link to="/dentgo-gpt-home">Go to Home</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
