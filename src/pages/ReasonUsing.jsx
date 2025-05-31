import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import buttonBack from "../assets/images/Button-Back.png"

const ReasonUsing = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState({
        language1: true,
        language2: false,
        language3: false,
        language4: true,
        language5: false,
        language6: false,
    });

    const handleBackClick = () => {
        navigate(-1);
    };

    useEffect(() => {
        setTimeout(() => setLoading(false), 500);
    }, []);

    if (loading) {
        return <Loader />;
    }

    const handleCheckboxChange = (event) => {
        const { id, checked } = event.target;
        setSelectedOptions({
            ...selectedOptions,
            [id]: checked,
        });
    };

    const options = [
        { id: "language1", label: "Generate creative text formats" },
        { id: "language2", label: "Access to real-time data" },
        { id: "language3", label: "User-friendly interface" },
        { id: "language4", label: "Google Workspace integration" },
        { id: "language5", label: "Free to use" },
        { id: "language6", label: "Others reason" },
    ];
    return (
        <>
            <div className="site_content">
                {/* < !-- ====================================== Reason Screen ===================================== --> */}
                <div className="verification-main">
                    <div className="container verify-screen-main p-0">
                        <div className="back-btn back-btn2">
                            <Link onClick={handleBackClick}>
                                <img className="profile-pic" src={buttonBack} alt="Button-Back" />
                            </Link>
                            <h1>Reason For Using Dentgo GPT</h1>
                        </div>
                        <div className="verify-section-main align-items-stretch">
                            <div className="main-text-group resoun">
                                <p className="sub-text interested ">We want to provide the best experience according to your needs.
                                </p>
                            </div>
                            {options.map((option) => (
                                <div className="form-check change-lan-sec" key={option.id}>
                                    <input
                                        className="form-check-input custom-input"
                                        name="language"
                                        type="checkbox"
                                        id={option.id}
                                        checked={selectedOptions[option.id]}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label
                                        className="form-check-label custom-lable"
                                        htmlFor={option.id}
                                    >
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                            <div className="finger-print-sec-btn">
                                <div className="finger-print-sec-btn-wrapp p-0">
                                    <div className="print-skip-btn">
                                        <Link to="/DentgoGptHome">Skip</Link>
                                    </div>
                                    <div className="print-next-btn">
                                        <Link to="/DentgoGptHome">Next</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- ====================================== Reason Screen End ===================================== --> */}
            </div>
        </>
    )
}
export default ReasonUsing