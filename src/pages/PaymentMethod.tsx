// src/pages/PaymentMethod.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "@components/ui/Loader";
import { StripeElements } from "../lib/stripeClient";
import {
  createPaymentRequest,
  createSetupIntent,
  PaymentRequestButtonElement,
  useStripe,
} from "../lib/stripeClient";
import { fetchCards } from "../api/cards";
import { API_BASE } from "../config";
import type { PaymentRequest as StripePaymentRequest } from "@stripe/stripe-js";

interface Card {
  id: number;
  network: string | null;
  last4: string;
  isActive: boolean;
}

const PaymentMethodForm: React.FC = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const [loading, setLoading] = useState<boolean>(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [fetchError, setFetchError] = useState<string>("");
  const [paymentRequest, setPaymentRequest] = useState<StripePaymentRequest | null>(null);
  const [canMakePayment, setCanMakePayment] = useState<boolean>(false);

  // Initial loading delay
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch saved cards once loading is false
  useEffect(() => {
    if (loading) return;
    (async () => {
      try {
        const data = await fetchCards();
        setCards(data);
      } catch (err) {
        console.error("Failed to fetch saved cards:", err);
        setFetchError("Unable to load saved cards.");
      }
    })();
  }, [loading]);

  // Initialize PaymentRequest for Apple/Google Pay
  useEffect(() => {
    if (loading) return;
    (async () => {
      try {
        if (!stripe) return;

        const pr = await createPaymentRequest({
          country: "US",
          currency: "usd",
          total: { label: "Save Card", amount: 0 },
          requestPayerEmail: true,
          requestPayerName: true,
        });

        pr.on("paymentmethod", async (event: any) => {
          try {
            const clientSecret = await createSetupIntent();
            const { error, setupIntent } = await stripe.confirmCardSetup(
              clientSecret,
              { payment_method: event.paymentMethod.id }
            );
            if (error || !setupIntent) {
              event.complete("fail");
              console.error("SetupIntent confirmation error:", error);
              return;
            }

            const pmId = setupIntent.payment_method as string;
            await fetch(`${API_BASE}/api/payments/cards`, {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentMethodId: pmId, nickName: null }),
            });

            event.complete("success");
            const updated = await fetchCards();
            setCards(updated);
          } catch (err) {
            console.error("Error saving card via PaymentRequest:", err);
            event.complete("fail");
          }
        });

        const result = await pr.canMakePayment();
        if (result) {
          setPaymentRequest(pr);
          setCanMakePayment(true);
        }
      } catch (err) {
        console.error("PaymentRequest init error:", err);
      }
    })();
  }, [loading, stripe]);

  const handleAddNew = () => navigate("/add-new-card");

  if (loading) return <Loader fullscreen />;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-4 flex flex-col items-center">
      <div className="w-full max-w-lg px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4">
          {/* Payment Request Button (Apple/Google Pay) */}
          {canMakePayment && paymentRequest ? (
            <div className="mb-4">
              <PaymentRequestButtonElement options={{ paymentRequest }} />
            </div>
          ) : (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4 bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Apple Pay / Google Pay currently unavailable.
              </p>
              <small className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                Use Safari (Apple Pay) or Chrome (Google Pay) with HTTPS or localhost, and make sure{" "}
                <code>VITE_STRIPE_PUBLISHABLE_KEY</code> is set.
              </small>
            </div>
          )}

          {/* Error Banner */}
          {fetchError && (
            <div className="text-sm p-2 border border-red-600 rounded text-red-600 bg-red-100 mb-4">
              {fetchError}
            </div>
          )}

          {/* Saved Cards List */}
          {cards.length > 0 ? (
            <div className="space-y-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between border rounded-lg p-3 bg-gray-50 dark:bg-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="border border-gray-300 dark:border-gray-600 px-4 py-1 rounded bg-white dark:bg-gray-800">
                      {card.network}
                    </span>
                    <div>
                      <div className="text-gray-800 dark:text-gray-200 font-semibold">
                        {card.network}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">
                        **** {card.last4}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`text-xs font-medium ${
                        card.isActive
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {card.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 my-3 text-center text-sm">
              No saved cards found.
            </p>
          )}

          {/* Add New Payment Button */}
          <div className="mt-6">
            <button
              onClick={handleAddNew}
              className="w-full bg-blue-800 hover:bg-blue-700 text-white text-lg font-medium rounded-lg py-3 transition"
            >
              Add New Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentMethod: React.FC = () => (
  <StripeElements>
    <PaymentMethodForm />
  </StripeElements>
);

export default PaymentMethod;
