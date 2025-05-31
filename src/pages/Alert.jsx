import React, { useEffect, useState } from "react";
import buttonBack from "../assets/images/Button-Back.png";
import alertImg from "../assets/images/alert-img.png";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Alert = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const handleBackClick = () => {
        navigate(-1);
    };

    const goToLetYouIn = () => {
        navigate("/LetYouIn");
    };

    const goToHome = () => {
        navigate("/DentgoGptHome");
    };

    useEffect(() => {
        setTimeout(() => setLoading(false), 500);
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="site_content">
            {/* <!-- ====================================== Alert Screen ===================================== --> */}
            <div className="verification-main">
                <div className="container verify-screen-main p-0">
                    <div className="back-btn back-btn2">
                        <Link onClick={handleBackClick}>
                            <img className="profile-pic" src={buttonBack} alt="Button-Back" />
                        </Link>
                        <h1>Alert</h1>
                    </div>
                    <div className="verify-section-main">
                        <div className="subscription-Dentgo-logo-main">
                            <img className="verify-img" src={alertImg} alt="alert-img" />
                        </div>
                        <h2 className="thank-you-subscriptions">Sorry! Your Order Has Failed!</h2>
                        <p className="sub-text tellus">
                            Venenatis praesent lorem tincidunt morbi ultrices quis dolor. Pellentesque nulla.
                        </p>

                        <div className="try_again_button" onClick={goToLetYouIn}>
                            <Link to="/LetYouIn">Try Again</Link>
                        </div>

                        <div className="go-to-home" onClick={goToHome}>
                            <Link to="/DentgoGptHome">Go to Home</Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- ====================================== Alert Screen End===================================== --> */}
        </div>
    );
};

export default Alert;
