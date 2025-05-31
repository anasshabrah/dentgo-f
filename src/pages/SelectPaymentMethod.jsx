// src/pages/SelectPaymentMethod.jsx
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

  // Simulate loader
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
          total: { label: "Your Order", amount: 5000 }, // $50.00
          requestPayerName: true,
          requestPayerEmail: true,
        });
        pr.canMakePayment().then((result) => {
          if (result) {
            setPaymentRequest(pr);
          }
        });
        pr.on("paymentmethod", (ev) => {
          // In real app, confirm PaymentIntent on backend
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
    <div className="site_content">
      <div className="verification-main">
        <div className="container verify-screen-main p-0">
          <div className="back-btn back-btn2 d-flex align-items-center px-3 py-2">
            <button onClick={handleBackClick} className="btn-reset-style me-3">
              <img className="profile-pic" src={buttonBack} alt="Back" />
            </button>
            <h1>Payment Method</h1>
          </div>
          <div className="verify-section-main align-items-stretch">
            {/* Apple/Google Pay button if available */}
            {paymentRequest && (
              <div className="mb-4">
                <PaymentRequestButtonElement options={{ paymentRequest }} />
              </div>
            )}

            {fetchError && (
              <div className="error-message text-danger mb-3">{fetchError}</div>
            )}

            {/* List saved cards from Prisma */}
            {cards.length > 0 ? (
              cards.map((card) => (
                <div
                  key={card.id}
                  className="form-check border-bottom px-0 custom-radio"
                >
                  <div className="form-check-label checkout-modal-lbl-payment d-flex align-items-center gap-2">
                    <span className="payment-type">
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
                    <div className="card-text-america">
                      <div className="bank-america-text">{card.network}</div>
                      <div className="america-card-number">
                        <span
                          className={
                            card.isActive
                              ? "america-card-active"
                              : "america-card-inactive"
                          }
                        >
                          {card.isActive ? "Active" : "Inactive"}
                        </span>{" "}
                        | Card Number **** {card.last4}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="sub-text my-3">No saved cards found.</p>
            )}

            {/* Link a New Card */}
            <div className="new-card-link-btn-main mb-4">
              <Link to="/AddNewCard" className="new-card-link-btn">
                + Link a New Card
              </Link>
            </div>

            <div className="print-continue-btn-head">
              <div
                className="bottom-fix-btn onboarding-next-btn"
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
