import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCards } from "../api/cards";
import buttonBack from "../assets/images/Button-Back.png";
import Loader from "../components/Loader";

import {
  StripeElements,
  createPaymentRequest,
  PaymentRequestButtonElement,
} from "../lib/stripeClient";

const API_BASE = process.env.REACT_APP_SERVER_URL || "";

const PaymentMethodForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;
    async function loadCards() {
      try {
        const data = await fetchCards();
        setCards(data);
      } catch (err) {
        console.error("Failed to fetch saved cards:", err);
        setFetchError("Unable to load saved cards.");
      }
    }
    loadCards();
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    (async () => {
      try {
        const pr = await createPaymentRequest({
          country: "US",
          currency: "usd",
          total: { label: "Save Card", amount: 0 },
          requestPayerEmail: true,
          requestPayerName: true,
        });
        pr.on("paymentmethod", async (event) => {
          event.complete("success");
        });
        if (await pr.canMakePayment()) {
          setPaymentRequest(pr);
          setCanMakePayment(true);
        }
      } catch (err) {
        console.error("PaymentRequest init error:", err);
      }
    })();
  }, [loading]);

  const handleBack = () => navigate(-1);
  const handleAddNew = () => navigate("/AddNewCard");

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
                <PaymentRequestButtonElement options={{ paymentRequest }} />
              </div>
            ) : (
              <div className="border-b-2 border-gray-200">
                <p className="text-sm text-gray-500 my-4">
                  Apple Pay / Google Pay currently unavailable
                </p>
                <small className="block text-xs text-gray-500 mb-4">
                  Make sure you’re on a supported browser (Safari for Apple Pay, Chrome for Google Pay),
                  using HTTPS or localhost, and that <code>REACT_APP_STRIPE_PUBLISHABLE_KEY</code> is set.
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

export default function PaymentMethod() {
  return (
    <StripeElements>
      <PaymentMethodForm />
    </StripeElements>
  );
}
