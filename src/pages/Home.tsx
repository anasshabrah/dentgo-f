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
      <nav className="bg-blue-800 p-4 flex justify-between">
        <div className="text-white font-bold">Dashboard</div>
        <div className="flex items-center">
          {user && (
            <>
              <span className="text-white mr-4">Hello, {user.name}</span>
              <button
                onClick={() => logout()}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
      <main className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Welcome to Your Dashboard</h1>
        {/* Link to PaymentMethod removed to prevent blank screen issue */}
      </main>
    </div>
  );
};

export default Home;
