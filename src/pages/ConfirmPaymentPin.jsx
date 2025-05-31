// src/pages/ConfirmPaymentPin.jsx

import React, { useEffect, useState } from "react";
import buttonBack from "../assets/images/Button-Back.png";
import createNewPinImg from "../assets/images/create-new-pin-img.png";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const ConfirmPaymentPin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="site_content">
      {/* ====================================== Confirm payment pin Screen ===================================== */}
      <div className="verification-main">
        <div className="container verify-screen-main p-0">
          <div className="back-btn back-btn2">
            <Link onClick={handleBackClick}>
              <img
                className="profile-pic"
                src={buttonBack}
                alt="Button-Back"
              />
            </Link>
            <h1>Confirm Your Payment</h1>
          </div>
          <div className="verify-section-main">
            <img
              className="verify-img"
              src={createNewPinImg}
              alt="confirm-payment-img"
            />
            <p className="sub-text">
              Authentication is required to continue your payment.
            </p>
            <div className="bottom-fix-btn onboarding-next-btn-Subscribe">
              <Link to="/LetYouIn">Continue with Google or Apple</Link>
            </div>
          </div>
        </div>
      </div>
      {/* ====================================== Confirm payment pin Screen End ===================================== */}
    </div>
  );
};

export default ConfirmPaymentPin;
