import React, { useEffect, useState } from "react";
import buttonBack from "../assets/images/Button-Back.png";
import contactUsImg from "../assets/images/contact-us-img.png";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const ContactUs = () => {
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
    <>
      <div className="site_content">
        {/* <!-- ====================================== Contact us Screen ===================================== --> */}
        <div className="verification-main">
          <div className="container verify-screen-main p-0">
            <div className="back-btn back-btn2">
              <Link onClick={handleBackClick}>
                <img
                  className="profile-pic"
                  src={buttonBack}
                  alt="Button-Back"
                />
              </Link>
              <h1>Contact Us</h1>
            </div>

            {/* Contact Form Section */}
            <div className="verify-section-main align-items-stretch">
              <h2 className="contact-us-text-main">Contact Us</h2>
              <p className="trouble">
                If you face any trouble for item ordering feel free to contact
                us.
              </p>

              <div className="contact-us-text">
                <div className="contact-icon">
                  {/* Email Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <g>
                      <path
                        d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z"
                        stroke="#0078D7"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9"
                        stroke="#0078D7"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </div>
                <a href="mailto:cs@dentgo.ai">cs@dentgo.ai</a>
              </div>

              <div className="contact-us-text email-me">
                <div className="contact-icon">
                  {/* Website Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <g>
                      <path
                        d="M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12Z"
                        stroke="#0078D7"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3.60156 9H20.4016"
                        stroke="#0078D7"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3.60156 15H20.4016"
                        stroke="#0078D7"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.4997 3C9.81501 5.69961 8.92188 8.81787 8.92188 12C8.92188 15.1821 9.81501 18.3004 11.4997 21"
                        stroke="#0078D7"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.5 3C14.1847 5.69961 15.0778 8.81787 15.0778 12C15.0778 15.1821 14.1847 18.3004 12.5 21"
                        stroke="#0078D7"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </div>
                <a href="https://dentgo.ai">dentgo.ai</a>
              </div>

              {/* About Us Section */}
              <div className="about_text_content mt-4">
                <h2>About Us</h2>
                <p className="about-content">
                  DentGo is your intelligent dental assistant — designed to save
                  you time and enhance patient care. It helps you quickly diagnose
                  cases, build customized treatment plans, and identify the
                  materials needed.
                </p>
                <p className="about-content">
                  Whether you're managing a busy clinic or just starting out,
                  DentGo streamlines your workflow and connects you with trusted
                  suppliers that deliver right to your clinic's door.
                </p>
                <p className="about-content">
                  Powered by AI, DentGo turns complex decisions into clear,
                  actionable steps — allowing you to focus more on your patients
                  and less on logistics.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- ====================================== Contact us Screen End ===================================== --> */}
      </div>
    </>
  );
};

export default ContactUs;
