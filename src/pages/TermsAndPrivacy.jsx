import React, { useEffect, useState } from "react";
import buttonBack from "../assets/images/Button-Back.png";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const TermsAndPrivacy = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="site_content">
        <div className="verification-main">
          <div className="container verify-screen-main p-0">
            <header className="back-btn back-btn2 top-navbar" id="top-navbar">
              <Link onClick={handleBackClick}>
                <img className="profile-pic" src={buttonBack} alt="Go Back" />
              </Link>
              <h1>Terms of Service and Privacy Policy</h1>
            </header>
            <div className="verify-section-main align-items-stretch">
              <div className="about_text_content">
                <p className="about-content">
                  <strong>Last updated: [31/05/2025]</strong>
                </p>
                <p className="about-content">
                  Welcome to DentGo (“we,” “us,” or “our”). This document
                  contains both our Terms of Service and our Privacy Policy. By
                  using DentGo’s web app, you agree to comply with these terms
                  and acknowledge how we handle your data.
                </p>
                <h2 className="about-content">1. Introduction</h2>
                <p className="about-content">
                  DentGo is a chatbot web application specializing in dental
                  assistance. Our service provides free daily messaging and the
                  option to upgrade to a premium subscription for additional
                  features.
                </p>
                <h2 className="about-content">2. Account Registration</h2>
                <p className="about-content">
                  Users must create an account using Google or Apple
                  authentication. We do not collect any other login credentials.
                  There is no minimum age requirement, but parents or guardians
                  should supervise minors’ use.
                </p>
                <h2 className="about-content">3. Usage Terms</h2>
                <p className="about-content">
                  You may use DentGo to chat with our dental chatbot for
                  information and support. Misuse of the service—including but
                  not limited to spamming, harassment, or any illegal
                  activity—is prohibited. We reserve the right to suspend or
                  terminate accounts that violate these terms.
                </p>
                <h2 className="about-content">4. Subscriptions and Payments</h2>
                <p className="about-content">
                  DentGo offers one free daily message for all users.
                  Additional features, such as unlimited messaging, require a
                  monthly subscription. Subscription fees are clearly stated
                  before purchase and are billed monthly.
                </p>
                <h2 className="about-content">5. Privacy Policy</h2>
                <h3 className="about-content">5.1 Data Collection</h3>
                <p className="about-content">
                  We only collect your email address via Google or Apple
                  sign-in. We store your chatbot conversations to allow you to
                  access your chat history. No sensitive health information is
                  collected. We do not collect or process any additional
                  personal data.
                </p>
                <h3 className="about-content">5.2 Cookies and Analytics</h3>
                <p className="about-content">
                  We use cookies solely for Google Analytics 4 (GA4) to
                  understand usage patterns and improve the service.
                </p>
                <h3 className="about-content">5.3 Data Sharing</h3>
                <p className="about-content">
                  We do <strong>not</strong> share your data with third parties.
                  Your information is used strictly for providing and improving
                  the DentGo service.
                </p>
                <h3 className="about-content">5.4 Data Security</h3>
                <p className="about-content">
                  We use industry-standard encryption and secure hosting to
                  protect your data.
                </p>
                <h2 className="about-content">6. Jurisdiction</h2>
                <p className="about-content">
                  DentGo is based in Wyoming, USA. These Terms and Privacy
                  Policy are governed by the laws of Wyoming and the United
                  States.
                </p>
                <h2 className="about-content">7. Contact Us</h2>
                <p className="about-content">
                  If you have any questions about these Terms or our Privacy
                  practices, please contact us at: cs@dentgo.ai.
                </p>
                <h2 className="about-content">8. Updates</h2>
                <p className="about-content">
                  We may update these Terms and Privacy Policy from time to
                  time. Changes will be posted on this page with the new
                  effective date.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndPrivacy;
