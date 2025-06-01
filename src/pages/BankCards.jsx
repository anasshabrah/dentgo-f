import React, { useEffect, useState } from "react";
import buttonBack from "../assets/images/Button-Back.png";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { fetchCards } from "../api/cards";

const BankCards = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [fetchError, setFetchError] = useState("");

  const handleBackClick = () => {
    navigate(-1);
  };

  // Fetch cards on mount
  useEffect(() => {
    async function loadCards() {
      try {
        const fetchedCards = await fetchCards();
        setCards(fetchedCards);
      } catch (err) {
        console.error("Failed to fetch cards:", err);
        setFetchError("Unable to load saved cards.");
      } finally {
        setLoading(false);
      }
    }
    loadCards();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="site_content">
      {/* ====================================== Bank Card Screen ===================================== */}
      <div className="verification-main">
        <div className="container verify-screen-main p-0">
          <div className="back-btn back-btn2">
            <Link onClick={handleBackClick}>
              <img className="profile-pic" src={buttonBack} alt="Button-Back" />
            </Link>
            <h1>Banks & Cards</h1>
          </div>
          <div className="verify-section-main align-items-stretch">
            <form>
              {fetchError && (
                <div className="error-message text-danger mb-3">
                  {fetchError}
                </div>
              )}

              {cards.length > 0 ? (
                cards.map((card) => (
                  <Link to="/AddNewCard" key={card.id}>
                    <div className="form-check border-bottom px-0 custom-radio">
                      <div className="form-check-label checkout-modal-lbl-payment">
                        <span className="payment-type border-0">
                          {/* Placeholder card icon */}
                          <svg width="32" height="32">
                            <circle cx="16" cy="16" r="16" fill="#0078D7" />
                          </svg>
                        </span>
                        <div className="card-text-america">
                          <div className="bank-america-text">
                            {card.network || "Unknown Network"}
                          </div>
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
                  </Link>
                ))
              ) : (
                !fetchError && (
                  <p className="sub-text my-3">No saved cards found.</p>
                )
              )}
            </form>

            <div className="print-continue-btn-head">
              <div className="onboarding-next-btn-plus bottom-fix-btn">
                <Link to="/AddNewCard">+ Link a New Card</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ====================================== Bank Card Screen End ===================================== */}
    </div>
  );
};

export default BankCards;
