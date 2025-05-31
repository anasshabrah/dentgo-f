import React, { useEffect, useState } from "react";
import notificationImg from "../assets/images/notification-img.png";
import buttonBack from "../assets/images/Button-Back.png";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const NotificationAllow = () => {
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
            {/* <!-- ====================================== Notification Allow Screen ===================================== --> */}
            <div className="verification-main">
                <div className="container verify-screen-main p-0">
                    <div className="back-btn back-btn2">
                        <Link onClick={handleBackClick}>
                            <img className="profile-pic" src={buttonBack} alt="Button-Back" />
                        </Link>
                        <h1>Notifications</h1>
                    </div>
                    <div className="verify-section-main">
                        <img className="verify-img" src={notificationImg} alt="notification-img" />
                        <p className="sub-text notified">
                            Stay updated on offers, car listings, and status alerts. You can manage notifications from settings later.
                        </p>
                        <div className="bottom-fix-btn Allow_notification_btn">
                            <Link to="/LetYouIn">Continue with Google or Apple</Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- ====================================== Notification Allow Screen End ===================================== --> */}
        </div>
    );
};

export default NotificationAllow;
