// src/pages/AddNewCard.tsx

import React, { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createCard } from "../api/cards";
import Loader from "@components/ui/Loader";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "../lib/stripeClient";
import { API_BASE } from "../config";

const AddNewCardForm: React.FC = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState<boolean>(true);
  const [cardName, setCardName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // simulate initial loader
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCardName(e.target.value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await fetch(`${API_BASE}/api/payments/create-customer`, {
        method: "POST",
        credentials: "include",
      });

      if (!stripe || !elements) {
        setError("Stripe has not fully loaded. Please try again.");
        setSubmitting(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError("Card element not found.");
        setSubmitting(false);
        return;
      }

      const setupResp = await fetch(
        `${API_BASE}/api/payments/create-setup-intent`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!setupResp.ok) {
        const errJson = await setupResp.json();
        throw new Error(
          errJson.error || "Failed to create SetupIntent on server."
        );
      }
      const { clientSecret } = (await setupResp.json()) as {
        clientSecret: string;
      };

      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: cardName },
        },
      });

      if (result.error || !result.setupIntent) {
        setError(result.error?.message || "Failed to confirm SetupIntent.");
        setSubmitting(false);
        return;
      }

      const paymentMethodId = result.setupIntent.payment_method as string;
      if (!paymentMethodId) {
        setError("No PaymentMethod returned from Stripe.");
        setSubmitting(false);
        return;
      }

      await createCard({
        paymentMethodId,
        nickName: cardName || null,
      });

      navigate("/payment-method");
    } catch (err: any) {
      console.error("AddNewCard error:", err);
      setError(err.message || "Failed to save card.");
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-4 flex flex-col items-center">
      <div className="w-full max-w-lg px-4 py-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 flex flex-col gap-4"
        >
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Add New Card
          </h1>

          <div className="relative">
            <input
              type="text"
              id="cardName"
              autoComplete="off"
              required
              value={cardName}
              onChange={handleCardNameChange}
              placeholder="Card Name"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-3 text-base text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 p-3">
            <CardElement
              id="card-element"
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#374151",
                    fontFamily: "'Satoshi', sans-serif",
                    "::placeholder": { color: "#6B7280" },
                  },
                  invalid: { color: "#FF484D" },
                },
                hidePostalCode: true,
              }}
            />
          </div>

          {error && (
            <div
              className="text-sm p-2 border border-red-600 rounded bg-red-100 text-red-600"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-600 text-white text-lg font-medium rounded-lg py-3 text-center transition disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span
                  className="border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full w-4 h-4 animate-spin inline-block mr-2 align-middle"
                  aria-hidden="true"
                />
                Adding…
              </>
            ) : (
              "Add My Card"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const AddNewCard: React.FC = () => (
  <Elements stripe={stripePromise}>
    <AddNewCardForm />
  </Elements>
);

export default AddNewCard;
