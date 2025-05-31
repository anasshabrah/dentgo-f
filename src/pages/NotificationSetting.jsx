import React, { useEffect, useState } from "react";
import buttonBack from "../assets/images/Button-Back.png"
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const NotificationSetting = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const handleBackClick = () => {
        navigate(-1);
    };
    // page loader
    useEffect(() => {
        setTimeout(() => setLoading(false), 500);
    }, []);

    if (loading) {
        return <Loader />;
    }
    return (
        <>
            <div className="site_content">
                {/* <!-- ====================================== Notifiaction Setting Screen===================================== --> */}
                <div className="verification-main">
                    <div className="container verify-screen-main p-0">
                        <div className="back-btn back-btn2">
                            <Link onClick={handleBackClick}>
                                <img className="profile-pic" src={buttonBack} alt="Button-Back" />
                            </Link>
                            <h1>Notification Settings</h1>
                        </div>
                        <div className="verify-section-main align-items-stretch">
                            <h2 className="will-notify">We will notify you when...</h2>
                            <div className="swiches-toggle">
                                <p className="remember">Your invoices are paid</p>
                                <div className="check-box">
                                    <input type="checkbox" name="invoice" />
                                </div>
                            </div>
                            <div className="swiches-toggle">
                                <p className="remember"> Someone request money from you</p>
                                <div className="check-box">
                                    <input type="checkbox" name="money" defaultChecked/>
                                </div>
                            </div>
                            <div className="swiches-toggle">
                                <p className="remember">You send money to someone</p>
                                <div className="check-box">
                                    <input type="checkbox" name="money" />
                                </div>
                            </div>
                            <div className="swiches-toggle">
                                <p className="remember">You receive money from someone</p>
                                <div className="check-box">
                                    <input type="checkbox" name="money" />
                                </div>
                            </div>
                            <div className="swiches-toggle">
                                <p className="remember">You purchase something</p>
                                <div className="check-box">
                                    <input type="checkbox" name="money" defaultChecked />
                                </div>
                            </div>
                            <div className="swiches-toggle">
                                <p className="remember">You receive a QR code payment</p>
                                <div className="check-box">
                                    <input type="checkbox" name="money" />
                                </div>
                            </div>
                            <div className="swiches-toggle">
                                <p className="remember">You receive a direct payment</p>
                                <div className="check-box">
                                    <input type="checkbox" name="money" />
                                </div>
                            </div>
                            <div className="swiches-toggle">
                                <p className="remember">You receive a subscriptions info</p>
                                <div className="check-box">
                                    <input type="checkbox" name="money" />
                                </div>
                            </div>
                            <div className="swiches-toggle">
                                <p className="remember">You receive announcements & offers</p>
                                <div className="check-box">
                                    <input type="checkbox" name="money" defaultChecked />
                                </div>
                            </div>
                            <div className="swiches-toggle border-bottom-0 email-me">
                                <p className="remember">You receive an app updates info</p>
                                <div className="check-box">
                                    <input type="checkbox" name="money" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- ====================================== Notifiaction Setting Screen End===================================== --> */}
            </div>
        </>
    )
}

export default NotificationSetting