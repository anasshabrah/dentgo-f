import React, { useEffect, useState } from "react";
import buttonBack from "../assets/images/Button-Back.png";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Delete = () => {
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
            {/* <!-- ====================================== Delete Screen ===================================== --> */}
            <div className="verification-main">
                <div className="container verify-screen-main p-0">
                    <div className="back-btn back-btn2">
                        <Link onClick={handleBackClick}>
                            <img className="profile-pic" src={buttonBack} alt="Button-Back" />
                        </Link>
                        <h1>Delete Account</h1>
                    </div>
                    <div className="verify-section-main align-items-stretch">
                        <h2 className="privacy_manage">Why are you leaving PayFast?</h2>
                        <p className="leave-text deactivate_your_account support">
                            We’re sorry to see you go! Authentication and account control are now handled via secure login.
                        </p>
                        <p className="tapping">
                            Tapping “Delete Account” will redirect you to the centralized login to manage or confirm deletion.
                            <span className="jesssmi"> Jessica Smith.</span>
                        </p>
                        <div className="print-continue-btn-head">
                            <div className="onboarding-next-btn-plus2 bottom-fix-btn">
                                <Link to="/LetYouIn">Delete Account</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- ====================================== Delete Screen End ===================================== --> */}
        </div>
    );
};

export default Delete;
