import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/ui/Loader";

const Home: React.FC = () => {
  const { user, logout, isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-lg px-4">
        <main className="p-4">
          <h1 className="text-2xl font-semibold mb-4">
            Welcome to Your Dashboard
          </h1>
          <div className="flex items-center justify-between">
            {user && (
              <>
                <span className="text-gray-800 dark:text-gray-200">
                  Hello, {user.name}
                </span>
                <button
                  onClick={() => logout()}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
