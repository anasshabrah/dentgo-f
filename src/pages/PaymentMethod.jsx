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

  // Simulate page loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Once loader is done, fetch saved cards
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

  // Initialize Apple/Google Pay PaymentRequest if possible
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
          // TODO: send event.paymentMethod.id to your backend to attach & save
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
    <div className="site_content">
      <div className="verification-main">
        <div className="container verify-screen-main p-0">
          {/* ====== Header / Back (Unified: do not modify) ====== */}
          <header className="back-btn back-btn2 top-navbar d-flex align-items-center px-3 py-2">
            <Link onClick={handleBack} className="btn-link me-3" aria-label="Go back">
              <img className="profile-pic" src={buttonBack} alt="Go Back" />
            </Link>
            <h1 className="m-0">Payment Method</h1>
          </header>

          <div className="verify-section-main align-items-stretch">
            {/* ====== Apple/Google Pay button (if available) ====== */}
            {canMakePayment && paymentRequest ? (
              <div className="form-check border-bottom px-0 custom-radio">
                <PaymentRequestButtonElement options={{ paymentRequest }} />
              </div>
            ) : (
              <div className="form-check border-bottom px-0 custom-radio">
                <p className="not-connect">
                  Apple Pay / Google Pay currently unavailable
                </p>
                <small className="not-connect-subtext">
                  Make sure you’re on a supported browser (Safari for Apple Pay, Chrome for Google Pay), using HTTPS or localhost, and that <code>REACT_APP_STRIPE_PUBLISHABLE_KEY</code> is set.
                </small>
              </div>
            )}

            {/* ====== Display any fetch error ====== */}
            {fetchError && (
              <div className="error-message text-danger mb-3">{fetchError}</div>
            )}

            {/* ====== Render each saved card from Prisma ====== */}
            {cards.length > 0 ? (
              cards.map((card) => (
                <div
                  key={card.id}
                  className="form-check border-bottom px-0 custom-radio"
                >
                  <div className="form-check-label checkout-modal-lbl-payment d-flex align-items-center gap-2">
                    {/* Minimal placeholder icon showing the network */}
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
              <p className="sub-text">No saved cards found.</p>
            )}

            {/* ====== “Add New Payment” button ====== */}
            <div className="print-continue-btn-head">
              <div
                className="onboarding-next-btn-new-payment bottom-fix-btn"
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
