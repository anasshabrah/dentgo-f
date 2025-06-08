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
      // 1) Ensure a Stripe Customer exists (backend creates or returns existing)
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

      // 2) Ask backend to create a SetupIntent
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

      // 3) Confirm the SetupIntent with Stripe
      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: cardName },
        },
      });

      if (result.error || !result.setupIntent) {
        setError(
          result.error?.message || "Failed to confirm SetupIntent."
        );
        setSubmitting(false);
        return;
      }

      const paymentMethodId = result.setupIntent.payment_method as string;
      if (!paymentMethodId) {
        setError("No PaymentMethod returned from Stripe.");
        setSubmitting(false);
        return;
      }

      // 4) Persist card details in our database
      await createCard({
        paymentMethodId,
        nickName: cardName || null,
      });

      // 5) Redirect to payment-methods list
      navigate("/payment-method");
    } catch (err: any) {
      console.error("AddNewCard error:", err);
      setError(err.message || "Failed to save card.");
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-4">
      <div className="mx-auto max-w-lg px-4">
        <form
          className="bg-blue-800 pt-4 px-4 flex flex-col items-stretch mt-5 rounded-t-3xl h-[calc(100vh-90px)] overflow-y-auto"
          onSubmit={handleSubmit}
        >
          <div className="relative mb-3">
            <input
              type="text"
              id="cardName"
              autoComplete="off"
              required
              value={cardName}
              onChange={handleCardNameChange}
              placeholder=" "
              className="peer w-full border border-gray-200 dark:border-gray-700 rounded px-2 py-3 text-base font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
            />
            <label
              htmlFor="cardName"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 transition-all peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-gray-800 dark:peer-focus:text-gray-200 peer-valid:-top-2 peer-valid:left-2 peer-valid:text-xs peer-valid:text-gray-800 dark:peer-valid:text-gray-200 bg-white dark:bg-gray-800 px-1"
            >
              Card Name
            </label>
          </div>

          <div className="mb-3">
            <div className="w-full h-16 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 pt-5 text-lg text-gray-800 dark:text-gray-200">
              <CardElement
                id="card-element"
                options={{
                  style: {
                    base: {
                      fontSize: "18px",
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
          </div>

          {error && (
            <div
              className="text-sm p-2 border border-red-600 rounded bg-red-100 mb-3 text-red-600"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          <div className="flex flex-col items-center justify-center">
            <button
              type="submit"
              className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-blue-100 dark:bg-gray-700 text-blue text-lg font-medium rounded-xl py-4 text-center disabled:opacity-50"
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
          </div>
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
