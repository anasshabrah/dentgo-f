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

const InnerSelectPaymentMethod = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  // Initialize Apple/Google Pay
  useEffect(() => {
    async function initPaymentRequest() {
      try {
        const pr = await createPaymentRequest({
          country: "US",
          currency: "usd",
          total: { label: "Your Order", amount: 5000 },
          requestPayerName: true,
          requestPayerEmail: true,
        });
        pr.canMakePayment().then((result) => {
          if (result) {
            setPaymentRequest(pr);
          }
        });
        pr.on("paymentmethod", (ev) => {
          ev.complete("success");
          navigate("/ConfirmPaymentPin");
        });
      } catch (err) {
        console.error("PaymentRequest init error:", err);
      }
    }
    initPaymentRequest();
  }, [navigate]);

  // Fetch saved cards once loading is false
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

  const handleBackClick = () => navigate(-1);
  const handleContinue = () => navigate("/ConfirmPaymentPin");

  if (loading) return <Loader />;

  return (
    <div className="bg-gray-100 min-h-screen pb-4">
      <div className="bg-blue pt-4 pb-8">
        <div className="mx-auto max-w-[480px] px-4">
          <header className="flex items-center px-3 py-2">
            <button
              onClick={handleBackClick}
              className="mr-3 p-0 bg-transparent"
              aria-label="Go back"
            >
              <img className="w-6 h-6" src={buttonBack} alt="Back" />
            </button>
            <h1 className="text-white text-lg font-medium">Payment Method</h1>
          </header>

          <div className="bg-white pt-4 px-4 flex flex-col items-stretch mt-5 rounded-t-3xl h-[calc(100vh-90px)] overflow-y-auto">
            {paymentRequest && (
              <div className="mb-4">
                <PaymentRequestButtonElement options={{ paymentRequest }} />
              </div>
            )}

            {fetchError && (
              <div className="text-sm p-2 border border-red-600 rounded text-red-600 bg-red-100 mb-3">
                {fetchError}
              </div>
            )}

            {cards.length > 0 ? (
              cards.map((card) => (
                <div key={card.id} className="border-b-2 border-gray-200 px-0">
                  <div className="flex items-center gap-2 py-4 pr-8 cursor-pointer transition-colors hover:bg-gray-50">
                    <span className="flex items-center justify-center w-12 h-8 border border-gray-200 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="20"
                        viewBox="0 0 32 20"
                        fill="none"
                      >
                        <rect width="32" height="20" rx="3" fill="#E0E0E0" />
                        <text x="16" y="13" textAnchor="middle" fontSize="10" fill="#333">
                          {card.network}
                        </text>
                      </svg>
                    </span>
                    <div className="pl-4">
                      <div className="text-gray-800 text-base font-bold leading-6">
                        {card.network}
                      </div>
                      <div className="text-gray-500 text-sm font-medium leading-5">
                        <span className={card.isActive ? "text-blue" : "text-red"}>
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

            <div className="mb-4">
              <Link to="/AddNewCard" className="text-blue text-base font-medium">
                + Link a New Card
              </Link>
            </div>

            <div className="flex items-center justify-center flex-col mt-auto mb-4">
              <div
                className="w-full py-4 bg-white text-blue text-lg font-medium rounded-xl text-center cursor-pointer hover:bg-blue-50"
                onClick={handleContinue}
              >
                Continue
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SelectPaymentMethod = () => (
  <StripeElements>
    <InnerSelectPaymentMethod />
  </StripeElements>
);

export default SelectPaymentMethod;
