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
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-4 flex flex-col">
      <div className="bg-blue-600 pt-4 pb-8">
        <div className="mx-auto max-w-lg px-4">
          <div className="pt-2 flex items-center px-3">
            <button
              onClick={handleBackClick}
              className="mr-3 p-0"
              aria-label="Go back"
            >
              <img className="w-6 h-auto" src={buttonBack} alt="Go back" />
            </button>
            <h1 className="text-white text-lg font-medium">Contact Us</h1>
          </div>
          <div className="bg-blue-700 pt-4 px-4 flex flex-col items-stretch mt-5 rounded-t-3xl h-[calc(100vh-90px)] overflow-y-auto">
            <h2 className="text-gray-900 dark:text-gray-100 text-center text-2xl font-semibold leading-9 mb-2">
              Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center text-lg leading-6 mb-6">
              If you face any trouble for item ordering feel free to contact us.
            </p>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
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
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9"
                      stroke="#0078D7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
              <a
                href="mailto:cs@dentgo.ai"
                className="text-gray-900 dark:text-gray-100 text-lg underline"
              >
                cs@dentgo.ai
              </a>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-shrink-0">
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
              <a
                href="https://dentgo.ai"
                className="text-gray-900 dark:text-gray-100 text-lg underline"
              >
                dentgo.ai
              </a>
            </div>

            <div className="mt-6 w-full">
              <h2 className="text-gray-900 dark:text-gray-100 text-xl font-semibold mb-2">
                About Us
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base leading-6 mb-2">
                DentGo is your intelligent dental assistant — designed to save you time and enhance patient care.
                It helps you quickly diagnose cases, build customized treatment plans, and identify the materials needed.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-base leading-6 mb-2">
                Whether you're managing a busy clinic or just starting out, DentGo streamlines your workflow and
                connects you with trusted suppliers that deliver right to your clinic's door.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-base leading-6">
                Powered by AI, DentGo turns complex decisions into clear, actionable steps — allowing you to focus more
                on your patients and less on logistics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
