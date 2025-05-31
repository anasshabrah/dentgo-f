import React, { useEffect, useState } from "react";
import buttonBack from "../assets/images/Button-Back.png";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const BankCards = () => {
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
        <div className="site_content">
            {/* <!-- ====================================== Bank Card Screen ===================================== --> */}
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
                            {/* Each card item links to /AddNewCard to allow managing or editing */}
                            {[...Array(4)].map((_, i) => (
                                <Link to="/AddNewCard" key={i}>
                                    <div className="form-check border-bottom px-0 custom-radio">
                                        {/* Place your SVG or image-based card representation here */}
                                        <div className="form-check-label checkout-modal-lbl-payment">
                                            <span className="payment-type border-0">
                                                {/* Icon placeholder */}
                                                <svg width="32" height="32"><circle cx="16" cy="16" r="16" fill="#0078D7" /></svg>
                                            </span>
                                            <div className="card-text-america">
                                                <div className="bank-america-text">Bank Name {i + 1}</div>
                                                <div className="america-card-number">
                                                    <span className="america-card-active">Active</span> | Card Number **** {4000 + i}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </form>
                        <div className="print-continue-btn-head">
                            <div className="onboarding-next-btn-plus bottom-fix-btn">
                                <Link to="/AddNewCard">+ Link a New Card</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- ====================================== Bank Card Screen End ===================================== --> */}
        </div>
    );
};

export default BankCards;
