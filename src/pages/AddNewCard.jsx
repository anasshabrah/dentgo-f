import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createCard } from "../api/cards";
import buttonBack from "../assets/images/Button-Back.png";
import visaIcon from "../assets/images/visa-icon.png";
import Loader from "../components/Loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "../lib/stripeClient";

const API_BASE = process.env.REACT_APP_SERVER_URL || "";

const AddNewCardForm = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(true);
  const [cardName, setCardName] = useState("");
  const [maskedCardNumber, setMaskedCardNumber] = useState("*** **** **** 0000");
  const [expiryDate, setExpiryDate] = useState(null);
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleBack = () => navigate(-1);
  const handleCardNameChange = (e) => setCardName(e.target.value);
  const handleDateChange = (date) => setExpiryDate(date);
  const handleCvvChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvv(raw);
  };

  const formatDate = (date) => {
    if (!date) return "**/**";
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = String(date.getFullYear()).slice(-2);
    return `${m}/${y}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Ensure customer is created (server handles session cookie)
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

      const { token, error: stripeError } = await stripe.createToken(cardElement, {
        name: cardName,
      });

      if (stripeError) {
        setError(stripeError.message);
        setSubmitting(false);
        return;
      }

      if (!token?.id) {
        setError("Failed to generate card token.");
        setSubmitting(false);
        return;
      }

      await createCard({ paymentMethodId: token.id, nickName: cardName || null });
      navigate("/PaymentMethod");
    } catch (err) {
      console.error("AddNewCard error:", err);
      setError(err.message || "Failed to save card.");
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="site_content">
      <div className="verification-main">
        <div className="container verify-screen-main p-0">
          {/* ====== Header / Back (Unified: do not modify) ====== */}
          <div className="back-btn back-btn2 d-flex align-items-center px-3 py-2">
            <Link onClick={handleBack} className="btn-link me-3" aria-label="Go back">
              <img className="profile-pic" src={buttonBack} alt="Go back" />
            </Link>
            <h1 className="m-0">Add New Card</h1>
          </div>

          <form
            className="verify-section-main align-items-stretch"
            onSubmit={handleSubmit}
          >
            {/* ====== Card Preview (Static, clearly labeled) ====== */}
            <div className="position-relative demo-visa mb-4">
              <span className="card-preview-label">Sample Card Preview</span>
              <img className="hello-visa" src={visaIcon} alt="Visa logo" />
              <p className="card-hidden-number">{maskedCardNumber}</p>
              <div className="card-name-jessica-main">
                <p className="card-name-jessica">
                  {cardName || "Cardholder Name"}
                </p>
                <div className="card-name-jessica-main-sub">
                  <p className="card-date-cvv">{formatDate(expiryDate)}</p>
                  <p className="card-date-cvv">{cvv || "***"}</p>
                </div>
              </div>
            </div>

            {/* ====== Card Holder Name ====== */}
            <div className="form-item mb-3">
              <input
                type="text"
                id="cardName"
                autoComplete="off"
                required
                value={cardName}
                onChange={handleCardNameChange}
                placeholder=" "
              />
              <label className="info-person" htmlFor="cardName">
                Card Name
              </label>
            </div>

            {/* ====== Stripe CardElement (Card Number + built-in Expiry + CVC) ====== */}
            <div className="form-item mb-3">
              <div className="stripe-card-input">
                <CardElement
                  id="card-element"
                  options={{
                    style: {
                      base: {
                        fontSize: "18px",
                        color: "var(--text-color)",
                        fontFamily: "'Satoshi', sans-serif",
                        "::placeholder": { color: "var(--sub-text-color)" },
                      },
                      invalid: { color: "#FF484D" },
                    },
                    hidePostalCode: true,
                  }}
                />
              </div>
            </div>

            {/* ====== DatePicker + CVV (Still shown, but will be ignored by Stripe since CardElement already collects them) ====== */}
            <div className="date-number-cvv d-flex gap-3">
              <div className="form-item flex-fill">
                <DatePicker
                  selected={expiryDate}
                  onChange={handleDateChange}
                  dateFormat="MM/yy"
                  className="no-spinners"
                  placeholderText="MM/YY"
                  required
                  showMonthYearPicker
                  id="expiryDate"
                />
              </div>
              <div className="form-item flex-fill">
                <input
                  type="number"
                  id="cvv"
                  className="no-spinners"
                  max="999"
                  value={cvv}
                  onChange={handleCvvChange}
                  required
                  placeholder=" "
                />
                <label className="info-person" htmlFor="cvv">
                  CVV
                </label>
              </div>
            </div>

            {/* ====== Error Message ====== */}
            {error && (
              <div
                className="error-message text-danger mb-3"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            {/* ====== Submit Button ====== */}
            <div className="print-continue-btn-head">
              <button
                type="submit"
                className="bottom-fix-btn onboarding-next-btn-plus"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="btn-spinner" aria-hidden="true" /> Adding…
                  </>
                ) : (
                  "Add My Card"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AddNewCard = () => (
  <Elements stripe={stripePromise}>
    <AddNewCardForm />
  </Elements>
);

export default AddNewCard;
