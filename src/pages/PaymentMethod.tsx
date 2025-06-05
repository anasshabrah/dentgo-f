import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCards } from "../api/cards";
import buttonBack from "../assets/images/Button-Back.png";
import Loader from "../components/ui/Loader";
import {
  StripeElements,
  createPaymentRequest,
  createSetupIntent,
  PaymentRequestButtonElement,
  useStripe,
} from "../lib/stripeClient";

interface Card {
  id: number;
  network: string | null;
  last4: string;
  isActive: boolean;
}

import { API_BASE } from "../config";

const PaymentMethodForm: React.FC = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const [loading, setLoading] = useState<boolean>(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [fetchError, setFetchError] = useState<string>("");
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [canMakePayment, setCanMakePayment] = useState<boolean>(false);

  // simulate loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // load saved cards once not loading
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

  // initialize PaymentRequest (to save a new card via Apple/Google Pay)
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
          // 1) Ask backend for a SetupIntent clientSecret
          try {
            const clientSecret = await createSetupIntent();
            // 2) Confirm SetupIntent—pass in event.paymentMethod.id
            const { error, setupIntent } = await stripe.confirmCardSetup(
              clientSecret,
              {
                payment_method: event.paymentMethod.id,
              }
            );
            if (error || !setupIntent) {
              event.complete("fail");
              console.error("SetupIntent confirmation error:", error);
              return;
            }

            // 3) Persist the new card on our server (FIXED URL)
            const pmId = setupIntent.payment_method as string;
            await fetch(`${API_BASE}/api/payments/cards`, {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentMethodId: pmId, nickName: null }),
            });

            event.complete("success");
            // 4) Refresh local list of cards
            const updated = await fetchCards();
            setCards(updated);
          } catch (err) {
            console.error("Error saving card via PaymentRequest:", err);
            event.complete("fail");
          }
        });

        if (await pr.canMakePayment()) {
          setPaymentRequest(pr);
          setCanMakePayment(true);
        }
      } catch (err) {
        console.error("PaymentRequest init error:", err);
      }
    })();
  }, [loading, stripe]);

  const handleBack = () => navigate(-1);
  const handleAddNew = () => navigate("/add-new-card");

  if (loading) return <Loader />;

  return (
    <div className="bg-gray-100 min-h-screen pb-4 flex flex-col">
      <div className="bg-blue-800 pt-4 pb-8">
        <div className="mx-auto max-w-lg px-4">
          <header className="pt-8 flex items-center px-3">
            <button onClick={handleBack} className="mr-3 p-0" aria-label="Go back">
              <img
                className="inline-block w-8 h-auto"
                src={buttonBack}
                alt="Go Back"
              />
            </button>
            <h1 className="m-0 text-white text-lg font-medium">Payment Method</h1>
          </header>

          <div className="bg-white pt-4 px-4 flex flex-col items-stretch mt-5 rounded-t-3xl h-[calc(100vh-90px)] overflow-y-auto">
            {canMakePayment && paymentRequest ? (
              <div className="border-b-2 border-gray-200">
                <PaymentRequestButtonElement
                  options={{ paymentRequest }}
                />
              </div>
            ) : (
              <div className="border-b-2 border-gray-200">
                <p className="text-sm text-gray-500 my-4">
                  Apple Pay / Google Pay currently unavailable
                </p>
                <small className="block text-xs text-gray-500 mb-4">
                  Make sure you’re on a supported browser (Safari for Apple Pay,
                  Chrome for Google Pay), using HTTPS or localhost, and that{" "}
                  <code>VITE_STRIPE_PUBLISHABLE_KEY</code> is set.
                </small>
              </div>
            )}

            {fetchError && (
              <div className="text-sm p-2 border border-red-600 rounded text-red-600 bg-red-100 mb-3">
                {fetchError}
              </div>
            )}

            {cards.length > 0 ? (
              cards.map((card) => (
                <div key={card.id} className="border-b-2 border-gray-200">
                  <div className="flex items-center gap-2 py-4 pr-8 cursor-pointer">
                    <span className="border border-gray-200 px-5 py-2 rounded flex items-center justify-center w-12 h-8">
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
                      <div className="text-gray-800 text-base font-semibold leading-6">
                        {card.network}
                      </div>
                      <div className="text-gray-500 text-sm font-medium leading-5">
                        <span className={card.isActive ? "text-blue-800" : "text-red"}>
                          {card.isActive ? "Active" : "Inactive"}
                        </span>{" "}
                        | Card Number **** {card.last4}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 my-3 text-sm">No saved cards found.</p>
            )}

            <div className="flex flex-col items-center justify-center">
              <div
                className="w-full bg-blue-800 text-white text-lg font-medium rounded-xl py-4 my-4 flex justify-center items-center transition hover:bg-blue-700 cursor-pointer"
                onClick={handleAddNew}
              >
                Add New Payment
              </div>
            </div>
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
