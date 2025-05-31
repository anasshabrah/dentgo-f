import React, { useEffect, useState } from "react";
import buttonBack from "../assets/images/Button-Back.png"
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Currency = () => {
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
                {/* <!-- ====================================== Currency Screen ===================================== --> */}
                <div className="verification-main">
                    <div className="container verify-screen-main p-0">
                        <div className="back-btn back-btn2">
                            <Link onClick={handleBackClick}>
                                <img className="profile-pic" src={buttonBack} alt="Button-Back" />
                            </Link>
                            <h1>Currency</h1>
                        </div>
                        <div className="verify-section-main align-items-stretch">
                            <div className="form-check2 change-lan-sec language-sel">
                                <input className="form-check-input custom-input" name="language" type="radio" id="language1" />
                                <div className="form-check-label custom-lable">
                                    <div className="currency-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none">
                                            <g>
                                                <path className="currency-svg"
                                                    d="M8.5 14.6667C8.5 15.9553 9.54467 17 10.8333 17H13C14.3807 17 15.5 15.8807 15.5 14.5C15.5 13.1193 14.3807 12 13 12H11C9.61929 12 8.5 10.8807 8.5 9.5C8.5 8.11929 9.61929 7 11 7H13.1667C14.4553 7 15.5 8.04467 15.5 9.33333M12 5.5V7M12 17V18.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                                    stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round" />
                                            </g>
                                        </svg>
                                    </div>
                                    USD
                                </div>
                            </div>
                            <div className="form-check2 change-lan-sec">
                                <input className="form-check-input custom-input" name="language" type="radio" id="language2" />
                                <div className="form-check-label custom-lable">
                                    <div className="currency-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none">
                                            <g>
                                                <path className="currency-svg"
                                                    d="M8.5 14.6667C8.5 15.9553 9.54467 17 10.8333 17H13C14.3807 17 15.5 15.8807 15.5 14.5C15.5 13.1193 14.3807 12 13 12H11C9.61929 12 8.5 10.8807 8.5 9.5C8.5 8.11929 9.61929 7 11 7H13.1667C14.4553 7 15.5 8.04467 15.5 9.33333M12 5.5V7M12 17V18.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                                    stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round" />
                                            </g>
                                        </svg>
                                    </div>
                                    CAD
                                </div>
                            </div>
                            <div className="form-check2 change-lan-sec">
                                <input className="form-check-input custom-input" name="language" type="radio" id="language3" />
                                <div className="form-check-label custom-lable">
                                    <div className="currency-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none">
                                            <g>
                                                <path className="currency-svg"
                                                    d="M8.5 14.6667C8.5 15.9553 9.54467 17 10.8333 17H13C14.3807 17 15.5 15.8807 15.5 14.5C15.5 13.1193 14.3807 12 13 12H11C9.61929 12 8.5 10.8807 8.5 9.5C8.5 8.11929 9.61929 7 11 7H13.1667C14.4553 7 15.5 8.04467 15.5 9.33333M12 5.5V7M12 17V18.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                                    stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round" />
                                            </g>
                                        </svg>
                                    </div>
                                    AUD
                                </div>
                            </div>
                            <div className="form-check2 change-lan-sec">
                                <input className="form-check-input custom-input" name="language" type="radio" id="language4" />
                                <div className="form-check-label custom-lable">
                                    <div className="currency-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none">
                                            <g>
                                                <path className="currency-svg"
                                                    d="M8.5 14.6667C8.5 15.9553 9.54467 17 10.8333 17H13C14.3807 17 15.5 15.8807 15.5 14.5C15.5 13.1193 14.3807 12 13 12H11C9.61929 12 8.5 10.8807 8.5 9.5C8.5 8.11929 9.61929 7 11 7H13.1667C14.4553 7 15.5 8.04467 15.5 9.33333M12 5.5V7M12 17V18.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                                    stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round" />
                                            </g>
                                        </svg>
                                    </div>
                                    NZD
                                </div>
                            </div>
                            <div className="form-check2 change-lan-sec">
                                <input className="form-check-input custom-input" name="language" type="radio" id="language5" />
                                <div className="form-check-label custom-lable">
                                    <div className="currency-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none">
                                            <g>
                                                <path className="currency-svg"
                                                    d="M9.5 7.5H13.75C14.9926 7.5 16 8.50736 16 9.75C16 10.9926 14.9926 12 13.75 12H9.5H14.25C15.4926 12 16.5 13.0074 16.5 14.25C16.5 15.4926 15.4926 16.5 14.25 16.5H9.5M9.5 7.5H8M9.5 7.5V16.5M9.5 16.5H8M10 6V7.5M10 16.5V18M13 6V7.5M13 16.5V18M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                                    stroke="#555555" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round" />
                                            </g>
                                        </svg>
                                    </div>
                                    Bitcoin
                                </div>
                            </div>
                            <div className="form-check2 change-lan-sec">
                                <input className="form-check-input custom-input" name="language" type="radio" id="language6" />
                                <div className="form-check-label custom-lable">
                                    <div className="currency-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none">
                                            <g>
                                                <path className="currency-svg"
                                                    d="M6.5 15.5L12.0002 18L17.5 15.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM6.5 11.5L12.0002 14L17.5 11.5L12.0002 5L6.5 11.5Z"
                                                    stroke="#555555" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round" />
                                            </g>
                                        </svg>
                                    </div>
                                    Ethereum
                                </div>
                            </div>
                            <div className="form-check2 change-lan-sec">
                                <input className="form-check-input custom-input" name="language" type="radio" id="language7" />
                                <div className="form-check-label custom-lable">
                                    <div className="currency-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none">
                                            <g>
                                                <path className="currency-svg"
                                                    d="M15.3333 8.27316C14.4487 7.48142 13.2806 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C13.2806 17 14.4487 16.5186 15.3333 15.7268M6 13.5H11M6 10.5H11M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                                    stroke="#555555" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round" />
                                            </g>
                                        </svg>
                                    </div>
                                    Euro
                                </div>
                            </div>
                            <div className="form-check2 change-lan-sec">
                                <input className="form-check-input custom-input" name="language" type="radio" id="language8" />
                                <div className="form-check-label custom-lable">
                                    <div className="currency-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none">
                                            <g>
                                                <path className="currency-svg"
                                                    d="M15 17.5H9C9 17.5 11 15.2444 11 12.5C11 11 9.91479 10.4867 9.89534 8.96204C9.8966 5.94404 13.5297 6.1045 14.7926 7.30402M9 12.5H14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                                    stroke="#555555" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round" />
                                            </g>
                                        </svg>
                                    </div>
                                    Pound
                                </div>
                            </div>
                            <div className="form-check2 change-lan-sec">
                                <input className="form-check-input custom-input" name="language" type="radio" id="language9" />
                                <div className="form-check-label custom-lable">
                                    <div className="currency-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none">
                                            <g>
                                                <path className="currency-svg"
                                                    d="M9.5 6.5H14C15.3807 6.5 16.5 7.61929 16.5 9C16.5 10.3807 15.3807 11.5 14 11.5H9.5V6.5ZM9.5 6.5V17.5M9.75 11.5H8M13 14.75H8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                                    stroke="#555555" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round" />
                                            </g>
                                        </svg>
                                    </div>
                                    Ruble
                                </div>
                            </div>
                            <div className="form-check2 change-lan-sec">
                                <input className="form-check-input custom-input" name="language" type="radio" id="language10" />
                                <div className="form-check-label custom-lable">
                                    <div className="currency-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none">
                                            <g>
                                                <path className="currency-svg"
                                                    d="M8.5 9.99984H15.5M8.5 6.5H15.5M14 18.0002L8.5 13.5002L10 13.5C14.4447 13.5 14.4447 6.5 10 6.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                                    stroke="#555555" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round" />
                                            </g>
                                        </svg>
                                    </div>
                                    Rupee
                                </div>
                            </div>
                            <div className="form-check2 change-lan-sec border-bottom-0 email-me">
                                <input className="form-check-input custom-input" name="language" type="radio" id="language11" />
                                <div className="form-check-label custom-lable">
                                    <div className="currency-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none">
                                            <g>
                                                <path className="currency-svg"
                                                    d="M12 18V12M12 12L16 7M12 12L8 7M16 12H8M15.5 15H8.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                                    stroke="#555555" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round" />
                                            </g>
                                        </svg>
                                    </div>
                                    Yen
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- ====================================== Currency Screen End===================================== --> */}
            </div>
        </>
    )
}

export default Currency
