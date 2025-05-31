import React, { useEffect, useState } from "react";
import buttonBack from "../assets/images/Button-Back.png"
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";


const ChooseInterests = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [selectedLanguages, setSelectedLanguages] = useState({
        selectLang1: true,
        selectLang2: false,
        selectLang3: false,
        selectLang4: false,
        selectLang5: false,
        selectLang6: false,
        selectLang7: false,
        selectLang8: false,
        selectLang9: false,
        selectLang10: false,
        selectLang11: false,
        selectLang12: false,
        selectLang13: true,
        selectLang14: false,
        selectLang15: false,
        selectLang16: false,
        selectLang17: false,
        selectLang20: true,
        selectLang21: false,
        selectLang22: false,
        selectLang23: false,
    });

    const handleBackClick = () => {
        navigate(-1);
    };

    useEffect(() => {
        setTimeout(() => setLoading(false), 500); // Simulate loading time
    }, []);

    if (loading) {
        return <Loader />;
    }

    const handleCheckboxChange = (event) => {
        const { id, checked } = event.target;
        setSelectedLanguages({
            ...selectedLanguages,
            [id]: checked,
        });
    };

    const languages = [
        { id: "selectLang1", label: "History" },
        { id: "selectLang2", label: "Art" },
        { id: "selectLang3", label: "Booking" },
        { id: "selectLang4", label: "Code" },
        { id: "selectLang5", label: "Content" },
        { id: "selectLang6", label: "Entertainment" },
        { id: "selectLang7", label: "Translator" },
        { id: "selectLang8", label: "Health" },
        { id: "selectLang9", label: "Music" },
        { id: "selectLang10", label: "Books" },
        { id: "selectLang11", label: "Toys" },
        { id: "selectLang12", label: "Handbags" },
        { id: "selectLang13", label: "Mobile Phones" },
        { id: "selectLang14", label: "Games" },
        { id: "selectLang15", label: "Kitchen Ware" },
        { id: "selectLang16", label: "Baby Care" },
        { id: "selectLang17", label: "Household Appliances" },
        { id: "selectLang20", label: "Fitness Equipment" },
        { id: "selectLang21", label: "Sports Goods" },
        { id: "selectLang22", label: "Home Decor" },
        { id: "selectLang23", label: "Computer Accessories" },
    ];
    return (
        <>
            <div className="site_content">
                {/* <!-- ====================================== Choose Interests Screen ===================================== --> */}
                <div className="verification-main">
                    <div className="container verify-screen-main p-0">
                        <div className="back-btn back-btn2">
                            <Link onClick={handleBackClick}>
                                <img className="profile-pic" src={buttonBack} alt="Button-Back" />
                            </Link>
                            <h1>Choose Interests</h1>
                        </div>
                        <div className="verify-section-main">
                            <div className="main-text-group">
                                <p className="sub-text interested">Choose 3 or more areas you are interested</p>
                            </div>
                            <form className="select-lang-sec">
                                {languages.map((lang) => (
                                    <div className="lang-sec" key={lang.id}>
                                        <input
                                            type="checkbox"
                                            id={lang.id}
                                            name="select-language"
                                            checked={selectedLanguages[lang.id]}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label
                                            className="custom-radio-sel-lang custom-bg-interest"
                                            htmlFor={lang.id}
                                        >
                                            {lang.label}
                                        </label>
                                    </div>
                                ))}
                            </form>
                            <div className="finger-print-sec-btn2">
                                <div className="finger-print-sec-btn-wrapp p-0">
                                    <div className="print-skip-btn">
                                        <Link to="/ReasonUsing">Skip</Link>
                                    </div>
                                    <div className="print-next-btn">
                                        <Link to="/ReasonUsing">Next</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- ====================================== Choose Interests Screen End===================================== --> */}
            </div>
        </>
    )
}
export default ChooseInterests