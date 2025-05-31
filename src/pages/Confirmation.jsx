import React, { useEffect, useState } from "react";
import buttonBack from "../assets/images/Button-Back.png";
import confirmationImg from "../assets/images/confirmation-img.png";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Confirmation = () => {
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
            {/* <!-- ====================================== Confirmation Screen ===================================== --> */}
            <div className="verification-main">
                <div className="container verify-screen-main p-0">
                    <div className="back-btn back-btn2">
                        <Link onClick={handleBackClick}>
                            <img className="profile-pic" src={buttonBack} alt="Button-Back" />
                        </Link>
                        <h1>Confirmation</h1>
                    </div>
                    <div className="verify-section-main">
                        <div className="subscription-Dentgo-logo-main">
                            <img className="verify-img" src={confirmationImg} alt="confirmation-img" />
                        </div>
                        <h2 className="thank-you-subscriptions">Thank You For Your Subscriptions!</h2>
                        <p className="sub-text tellus">
                            Sagittis sit ipsum tellus vitae dui sed. Elementum auctor magna et a montes.
                        </p>
                        <div className="bottom-fix-btn onboarding-next-btn-Subscribe">
                            <Link to="/Alert">Go To Home</Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- ====================================== Confirmation Screen End===================================== --> */}
        </div>
    );
};

export default Confirmation;
