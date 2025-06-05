import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/ui/Loader";

const ConfirmPaymentPin: React.FC = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPin(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      // Replace with real PIN validation API if needed
      navigate("/");
    } catch (err: any) {
      setError("Invalid PIN. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Enter Payment PIN
        </h2>
        {error && (
          <div className="text-red-600 bg-red-100 border border-red-300 p-2 rounded mb-4">
            {error}
          </div>
        )}
        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={handleChange}
          maxLength={4}
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 rounded mb-4 text-gray-800 dark:text-gray-200"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-800 text-white py-2 rounded disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? <Loader /> : "Confirm"}
        </button>
      </form>
    </div>
  );
};

export default ConfirmPaymentPin;
