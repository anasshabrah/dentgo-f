// src/pages/AddNewPaymentMethod.tsx

import React, { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createCard } from "../api/cards";
import Loader from "@components/ui/Loader";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { stripePromise } from "../lib/stripeClient";
import { API_BASE } from "../config";

const AddNewPaymentForm: React.FC = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [prOptions, setPrOptions] = useState<any>(null);

  // Initialize PaymentRequest for Apple/Google Pay
  useEffect(() => {
    if (!stripe) return;
    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: { label: "Your Order", amount: 0 },
      requestPayerName: true,
    });
    pr.canMakePayment().then(result => {
      if (result) setPrOptions({ paymentRequest: pr });
    });
  }, [stripe]);

  // Load spinner delay
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Create customer & setup intent
      await fetch(`${API_BASE}/api/payments/create-customer`, { method: "POST", credentials: "include" });
      const resp = await fetch(`${API_BASE}/api/payments/create-setup-intent`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!resp.ok) throw new Error("SetupIntent creation failed");
      const { clientSecret } = await resp.json();

      if (!stripe || !elements) throw new Error("Stripe not loaded");

      // Confirm with PaymentElement (handles all methods)
      const result = await stripe.confirmSetup({
        elements,
        confirmParams: { return_url: window.location.href },
      });
      if (result.error) throw result.error;

      // Send PaymentMethod to your backend
      const pm = result.setupIntent?.payment_method as string;
      await createCard({ paymentMethodId: pm, nickName: name || null });

      navigate("/payment-method");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 space-y-6">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Add a Payment Method
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name on Card
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full px-4 py-3 text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* Payment Request (Apple/Google Pay) */}
          {prOptions && (
            <div className="mb-4">
              <PaymentRequestButtonElement
                options={prOptions}
                className="w-full h-12 rounded-lg"
              />
            </div>
          )}

          {/* Stripe Payment Element */}
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700">
            <PaymentElement options={{ layout: "accordion" }} />
          </div>

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="text-sm text-red-700 bg-red-100 border border-red-300 rounded p-3"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 text-lg font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition disabled:opacity-50"
          >
            {submitting ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Save Payment Method"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const AddNewPaymentMethod: React.FC = () => (
  <Elements stripe={stripePromise}>
    <AddNewPaymentForm />
  </Elements>
);

export default AddNewPaymentMethod;
