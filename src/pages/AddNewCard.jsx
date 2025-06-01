import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createCard } from "../api/cards";
import buttonBack from "../assets/images/Button-Back.png";
import visaIcon from "../assets/images/visa-icon.png";
import Loader from "../components/Loader";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../lib/stripeClient";

const API_BASE = process.env.REACT_APP_SERVER_URL || "";

const AddNewCard = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(true);
  const [cardName, setCardName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Simulate brief loader on mount
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleBack = () => navigate(-1);
  const handleCardNameChange = (e) => setCardName(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // 1) Ensure user has a Stripe Customer ID
      await fetch(`${API_BASE}/api/payments/create-customer`, {
        method: "POST",
        credentials: "include",
      });

      if (!stripe || !elements) {
        setError("Stripe.js has not yet loaded.");
        setSubmitting(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError("Card element not found.");
        setSubmitting(false);
        return;
      }

      // 2) Create token from CardElement
      const { token, error: stripeError } = await stripe.createToken(
        cardElement,
        { name: cardName }
      );

      if (stripeError) {
        setError(stripeError.message);
        setSubmitting(false);
        return;
      }

      if (!token?.id) {
        setError("Failed to generate card token");
        setSubmitting(false);
        return;
      }

      // 3) Send stripeToken.id + optional nickName to our backend to save in Prisma
      await createCard({ paymentMethodId: token.id, nickName: cardName || null });

      // 4) On success, navigate back to PaymentMethod
      navigate("/PaymentMethod");
    } catch (err) {
      console.error("AddNewCard error:", err);
      setError(err.message || "Failed to save card");
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="site_content">
      <div className="verification-main">
        <div className="container verify-screen-main p-0">
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
            <div className="position-relative demo-visa mb-4">
              <img className="hello-visa" src={visaIcon} alt="visa" />
              <p className="card-hidden-number">**** **** **** ****</p>
              <div className="card-name-jessica-main">
                <p className="card-name-jessica">
                  {cardName || "Jessica Smith"}
                </p>
              </div>
            </div>

            <div className="new_password_input" id="new-card-inputs">
              <div className="form-item mb-3">
                <input
                  type="text"
                  id="cardName"
                  autoComplete="off"
                  required
                  value={cardName}
                  onChange={handleCardNameChange}
                />
                <label className="info-person" htmlFor="cardName">
                  Card Name
                </label>
              </div>

              <div className="form-item mb-3">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#333",
                        "::placeholder": {
                          color: "#aaa",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {error && <div className="error-message text-danger mb-3">{error}</div>}

            <div className="print-continue-btn-head">
              <button
                type="submit"
                className="bottom-fix-btn onboarding-next-btn-plus"
                disabled={submitting}
              >
                {submitting ? "Adding…" : "Add My Card"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Wrapper with Stripe Elements
const AddNewCardPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <AddNewCard />
    </Elements>
  );
};

export default AddNewCardPage;
