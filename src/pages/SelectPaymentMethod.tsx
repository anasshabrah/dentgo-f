// src/pages/SelectPaymentMethod.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Loader from "@components/ui/Loader";
import { StripeElements } from "../lib/stripeClient";
import {
  createPaymentRequest,
  createPaymentIntent,
  PaymentRequestButtonElement,
  useStripe,
} from "../lib/stripeClient";
import { fetchCards } from "../api/cards";
import type { PaymentRequest as StripePaymentRequest } from "@stripe/stripe-js";

interface Card {
  id: number;
  network: string | null;
  last4: string;
  isActive: boolean;
}

const InnerSelectPaymentMethod: React.FC = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const [loading, setLoading] = useState<boolean>(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [fetchError, setFetchError] = useState<string>("");
  const [paymentRequest, setPaymentRequest] = useState<StripePaymentRequest | null>(null);

  // Simulate initial loading delay
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Initialize PaymentRequest for Apple/Google Pay
  useEffect(() => {
    if (loading || !stripe) return;

    (async () => {
      try {
        const pr = await createPaymentRequest({
          country: "US",
          currency: "usd",
          total: { label: "Your Order", amount: 5000 },
          requestPayerName: true,
          requestPayerEmail: true,
        });

        // Check if user can make payment
        if (await pr.canMakePayment()) {
          setPaymentRequest(pr);
        }

        pr.on("paymentmethod", async (event: any) => {
          try {
            const clientSecret = await createPaymentIntent(5000);
            const { error, paymentIntent } = await stripe.confirmCardPayment(
              clientSecret,
              { payment_method: event.paymentMethod.id }
            );
            if (error || !paymentIntent) {
              event.complete("fail");
              console.error("PaymentIntent confirmation error:", error);
              return;
            }
            event.complete("success");
            navigate("/confirm-payment-pin");
          } catch (err) {
            console.error("Error during PaymentRequest flow:", err);
            event.complete("fail");
          }
        });
      } catch (err) {
        console.error("PaymentRequest init error:", err);
      }
    })();
  }, [loading, stripe, navigate]);

  // Fetch saved cards once loading completes
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

  const handleContinue = () => {
    navigate("/confirm-payment-pin");
  };

  if (loading) {
    return <Loader fullscreen />;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-4 flex flex-col">
      <div className="mx-auto max-w-[480px] px-4">
        <div className="bg-white dark:bg-gray-800 pt-4 px-4 mt-5 rounded-t-3xl h-[calc(100vh-90px)] overflow-y-auto flex flex-col">
          {/* Payment Request Button (Apple/Google Pay) */}
          {paymentRequest ? (
            <div className="mb-4">
              <PaymentRequestButtonElement options={{ paymentRequest }} />
            </div>
          ) : (
            <div className="border-b-2 border-gray-200 dark:border-gray-700 mb-4 px-2 py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Apple Pay / Google Pay currently unavailable.
              </p>
              <small className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                Ensure you’re on Safari (Apple Pay) or Chrome (Google Pay), using HTTPS or localhost.
              </small>
            </div>
          )}

          {/* Error Banner */}
          {fetchError && (
            <div className="text-sm p-2 border border-red-600 rounded text-red-600 bg-red-100 mb-3">
              {fetchError}
            </div>
          )}

          {/* Saved Cards List */}
          {cards.length > 0 ? (
            <div className="flex-1 overflow-y-auto">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="border-b-2 border-gray-200 dark:border-gray-700 px-0"
                >
                  <div className="flex items-center gap-2 py-4 pr-8 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                    <span className="flex items-center justify-center w-12 h-8 border border-gray-200 dark:border-gray-700 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="20"
                        viewBox="0 0 32 20"
                        fill="none"
                      >
                        <rect width="32" height="20" rx="3" fill="#E0E0E0" />
                        <text
                          x="16"
                          y="13"
                          textAnchor="middle"
                          fontSize="10"
                          fill="#333"
                        >
                          {card.network}
                        </text>
                      </svg>
                    </span>
                    <div className="pl-4">
                      <div className="text-gray-800 dark:text-gray-200 text-base font-bold leading-6">
                        {card.network}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-5">
                        <span
                          className={
                            card.isActive
                              ? "text-blue-800 dark:text-primary"
                              : "text-red-600"
                          }
                        >
                          {card.isActive ? "Active" : "Inactive"}
                        </span>{" "}
                        | Card Number **** {card.last4}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 my-3 text-sm">
              No saved cards found.
            </p>
          )}

          {/* Link a New Card */}
          <div className="mb-4">
            <Link to="/add-new-card" className="text-blue-600 dark:text-primary text-base font-medium">
              + Link a New Card
            </Link>
          </div>

          {/* Continue Button */}
          <div className="flex items-center justify-center flex-col mt-auto mb-4">
            <div
              className="w-full py-4 bg-white dark:bg-gray-700 text-blue-600 dark:text-primary text-lg font-medium rounded-xl text-center cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-600 transition"
              onClick={handleContinue}
            >
              Continue
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SelectPaymentMethod: React.FC = () => (
  <StripeElements>
    <InnerSelectPaymentMethod />
  </StripeElements>
);

export default SelectPaymentMethod;
