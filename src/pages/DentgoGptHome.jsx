import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import plusRobot from "../assets/images/plus-robort.png";
import { useDarkMode } from "../components/DarkModeContext";
import { useAuth } from "../context/AuthContext";

const DentgoGptHome = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { logout } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  // Clean up any lingering bootstrap backdrop if re-navigating
  useEffect(() => {
    const backdrop = document.querySelector(".offcanvas-backdrop.show");
    if (backdrop) {
      backdrop.remove();
      document.body.classList.remove("offcanvas-backdrop", "modal-open");
    }
  }, []);

  const hidePopup = (e) => {
    e.preventDefault();
    setIsVisible(false);
  };

  const handlePlusSubscription = () => {
    navigate("/PlusSubscription");
  };

  const handleSignIn = () => {
    navigate("/DentgoChat");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col font-sans">
      {/* === HEADER === */}
      <header className="relative bg-primary pt-6 pb-10">
        {/* Subtle bottom accent gradient */}
        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0"></div>

        <div className="mx-auto max-w-lg px-4">
          <div className="flex items-center justify-between">
            {/* Logo + Title */}
            <Link
              to="/DentgoGptHome"
              className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Dentgo Home"
            >
              <img src={logo} alt="Dentgo Logo" className="h-8 w-auto" />
              <span className="text-white text-lg font-medium leading-6">Dentgo</span>
            </Link>

            <div className="flex items-center gap-4">
              {/* Notification Icon */}
              <Link
                to="/Notification"
                className="relative p-2 rounded-full hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="View notifications"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-current text-white"
                >
                  <mask
                    id="notif-mask"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                  >
                    <rect width="24" height="24" fill="white" />
                  </mask>
                  <g mask="url(#notif-mask)">
                    <path
                      d="M10 5C10 4.46957 10.2107 3.96086 10.5858 3.58579C10.9609 3.21071 11.4696 3 12 3C12.5304 3 13.0391 3.21071 13.4142 3.58579C13.7893 3.96086 14 4.46957 14 5C15.1484 5.54303 16.1274 6.38833 16.8321 7.4453C17.5367 8.50227 17.9404 9.73107 18 11V14C18.0753 14.6217 18.2954 15.2171 18.6428 15.7381C18.9902 16.2592 19.4551 16.6914 20 17H4C4.54494 16.6914 5.00981 16.2592 5.35719 15.7381C5.70457 15.2171 5.92474 14.6217 6 14V11C6.05956 9.73107 6.4633 8.50227 7.16795 7.4453C7.8726 6.38833 8.85159 5.54303 10 5Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 17V18C9 18.7956 9.31607 19.5587 9.87868 20.1213C10.4413 20.6839 11.2044 21 12 21C12.7956 21 13.5587 20.6839 14.1213 20.1213C14.6839 19.5587 15 18.7956 15 18V17"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-red-600 text-white text-xs">
                  5
                </span>
              </Link>

              {/* Menu Button (Offcanvas toggle) */}
              <button
                className="p-2 rounded-full hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-white"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasMenu"
                aria-label="Open menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-current text-white"
                >
                  <mask
                    id="menu-mask"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                  >
                    <rect width="24" height="24" fill="white" />
                  </mask>
                  <g mask="url(#menu-mask)">
                    <path
                      d="M19 6.87298C19.3062 7.04978 19.5601 7.30461 19.7358 7.6115C19.9115 7.9184 20.0026 8.26638 20 8.61998V15.156C19.9999 15.5126 19.9045 15.8628 19.7235 16.1701C19.5426 16.4775 19.2828 16.7308 18.971 16.904L12.971 20.737C12.674 20.9019 12.3398 20.9885 12 20.9885C11.6602 20.9885 11.326 20.9019 11.029 20.737L5.029 16.904C4.71736 16.7309 4.45763 16.4777 4.27671 16.1705C4.0958 15.8634 4.00026 15.5135 4 15.157V8.61998C4.00008 8.26334 4.09553 7.9132 4.27646 7.60585C4.45739 7.29851 4.71721 7.04513 5.029 6.87198L11.029 3.29998C11.3348 3.12975 11.679 3.04041 12.029 3.04041C12.379 3.04041 12.7232 3.12975 13.029 3.29998L19.029 6.87298H19V6.87298Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 bg-gray-100">
        <div className="mx-auto max-w-lg px-4">
          {/* Dentgo Plus Card */}
          <section
            className="mt-6 bg-white rounded-xl shadow-md overflow-hidden"
            aria-labelledby="dentgo-plus-title"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Text + Button */}
              <div className="flex-1 p-6 space-y-2">
                <h2
                  id="dentgo-plus-title"
                  className="text-2xl font-semibold text-gray-800"
                >
                  Dentgo Plus
                </h2>
                <p className="text-gray-500 text-base">
                  Unlock Dentgo premium to access all features.
                </p>
                <button
                  onClick={handlePlusSubscription}
                  className="mt-4 inline-flex items-center justify-center bg-primary text-white font-medium text-base rounded-lg px-4 py-3 shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  aria-label="Upgrade to Dentgo Plus"
                >
                  Upgrades
                </button>
              </div>

              {/* Image */}
              <div className="flex-1">
                <img
                  src={plusRobot}
                  alt="Plus robot illustration"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </section>

          {/* Start Chat Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSignIn}
              className="w-full bg-primary text-white font-medium text-lg rounded-xl py-4 shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              aria-label="Start chat with Dentgo"
            >
              Start Chat with Dentgo
            </button>
          </div>
        </div>
      </main>

      {/* === OFFCANVAS MENU (Bootstrap structure, styled with Tailwind inside) === */}
      <div
        className="offcanvas offcanvas-start bg-gray-100"
        tabIndex="-1"
        id="offcanvasMenu"
        aria-labelledby="offcanvasMenuLabel"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h3 id="offcanvasMenuLabel" className="text-gray-800 font-medium text-base">
            Settings
          </h3>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            data-bs-dismiss="offcanvas"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-4">
          {/*
            Each menu item is a flex container with:
            - SVG icon (stroke-current & text-primary)
            - Title text
            - Chevron icon on the right
            - Entire row has hover/focus background and padding
          */}
          <Link
            to="/DentgoChat"
            className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            aria-label="New Chat"
          >
            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-primary stroke-current"
                viewBox="0 0 48 48"
                fill="none"
              >
                <rect
                  opacity="0.08"
                  width="48"
                  height="48"
                  rx="8"
                  fill="currentColor"
                />
                <g>
                  <path
                    d="M24 17V31"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 24H31"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              <span className="text-gray-800 font-medium text-base">New Chat</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          <Link
            to="/History"
            className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            aria-label="History"
          >
            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-primary stroke-current"
                viewBox="0 0 48 48"
                fill="none"
              >
                <rect
                  opacity="0.08"
                  width="48"
                  height="48"
                  rx="8"
                  fill="currentColor"
                />
                <g>
                  <path
                    d="M24 20V24L26 26"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.0498 23.0001C15.2739 20.8001 16.3001 18.7597 17.9325 17.268C19.565 15.7764 21.6895 14.938 23.9007 14.9127C26.1119 14.8874 28.255 15.6771 29.9211 17.1311C31.5872 18.5851 32.6597 20.6015 32.934 22.7958C33.2083 24.99 32.6651 27.2085 31.4082 29.0278C30.1512 30.8472 28.2684 32.1401 26.1191 32.6599C23.9697 33.1797 21.7042 32.89 19.7548 31.8461C17.8054 30.8022 16.3085 29.0772 15.5498 27.0001M15.0498 32.0001V27.0001H20.0498"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              <span className="text-gray-800 font-medium text-base">History</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          <Link
            to="/BankCards"
            className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            aria-label="Banks & Cards"
          >
            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-primary stroke-current"
                viewBox="0 0 48 48"
                fill="none"
              >
                <rect
                  opacity="0.08"
                  width="48"
                  height="48"
                  rx="8"
                  fill="currentColor"
                />
                <g>
                  <path
                    d="M15 33H33"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 22H33"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 18L24 15L31 18"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 22V33"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M32 22V33"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 26V29"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M24 26V29"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M28 26V29"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              <span className="text-gray-800 font-medium text-base">Banks &amp; Cards</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          <Link
            to="/PaymentMethod"
            className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            aria-label="Payment Methods"
          >
            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-primary stroke-current"
                viewBox="0 0 48 48"
                fill="none"
              >
                <rect
                  opacity="0.08"
                  width="48"
                  height="48"
                  rx="8"
                  fill="currentColor"
                />
                <g>
                  <path
                    d="M29 20V17C29 16.7348 28.8946 16.4804 28.7071 16.2929C28.5196 16.1054 28.2652 16 28 16H18C17.4696 16 16.9609 16.2107 16.5858 16.5858C16.2107 16.9609 16 17.4696 16 18M16 18C16 18.5304 16.2107 19.0391 16.5858 19.4142C16.9609 19.7893 17.4696 20 18 20H30C30.2652 20 30.5196 20.1054 30.7071 20.2929C30.8946 20.4804 31 20.7348 31 21V24M16 18V30C16 30.5304 16.2107 31.0391 16.5858 31.4142C16.9609 31.7893 17.4696 32 18 32H30C30.2652 32 30.5196 31.8946 30.7071 31.7071C30.8946 31.5196 31 31.2652 31 31V28"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M32 24V28H28C27.4696 28 26.9609 27.7893 26.5858 27.4142C26.2107 27.0391 26 26.5304 26 26C26 25.4696 26.2107 24.9609 26.5858 24.5858C26.9609 24.2107 27.4696 24 28 24H32Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              <span className="text-gray-800 font-medium text-base">Payment Methods</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          <Link
            to="/CancelSubscription"
            className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            aria-label="Subscriptions"
          >
            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-primary stroke-current"
                viewBox="0 0 48 48"
                fill="none"
              >
                <rect
                  opacity="0.08"
                  width="48"
                  height="48"
                  rx="8"
                  fill="currentColor"
                />
                <g>
                  <path
                    d="M23 18C23 18.7956 23.5268 19.5587 24.4645 20.1213C25.4021 20.6839 26.6739 21 28 21C29.3261 21 30.5979 20.6839 31.5355 20.1213C32.4732 19.5587 33 18.7956 33 18C33 17.2044 32.4732 16.4413 31.5355 15.8787C30.5979 15.3161 29.3261 15 28 15C26.6739 15 25.4021 15.3161 24.4645 15.8787C23.5268 16.4413 23 17.2044 23 18Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23 18V22C23 23.657 25.239 25 28 25C30.761 25 33 23.657 33 22V18"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23 22V26C23 27.657 25.239 29 28 29C30.761 29 33 27.657 33 26V22"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23 26V30C23 31.657 25.239 33 28 33C30.761 33 33 31.657 33 30V26"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 21H16.5C16.1022 21 15.7206 21.158 15.4393 21.4393C15.158 21.7206 15 22.1022 15 22.5C15 22.8978 15.158 23.2794 15.4393 23.5607C15.7206 23.842 16.1022 24 16.5 24H17.5C17.8978 24 18.2794 24.158 18.5607 24.4393C18.842 24.7206 19 25.1022 19 25.5C19 25.8978 18.842 26.2794 18.5607 26.5607C18.2794 26.842 17.8978 27 17.5 27H15"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 27V28M17 20V21"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              <span className="text-gray-800 font-medium text-base">Subscriptions</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          <Link
            to="/NotificationSetting"
            className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            aria-label="Notification Settings"
          >
            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-primary stroke-current"
                viewBox="0 0 48 48"
                fill="none"
              >
                <rect
                  opacity="0.08"
                  width="48"
                  height="48"
                  rx="8"
                  fill="currentColor"
                />
                <g>
                  <path
                    d="M22 17C22 16.4696 22.2107 15.9609 22.5858 15.5858C22.9609 15.2107 23.4696 15 24 15C24.5304 15 25.0391 15.2107 25.4142 15.5858C25.7893 15.9609 26 16.4696 26 17C27.1484 17.543 28.1274 18.3883 28.8321 19.4453C29.5367 20.5023 29.9404 21.7311 30 23V26C30.0753 26.6217 30.2954 27.2171 30.6428 27.7381C30.9902 28.2592 31.4551 28.6914 32 29H16C16.5449 28.6914 17.0098 28.2592 17.3572 27.7381C17.7046 27.2171 17.9247 26.6217 18 26V23C18.0596 21.7311 18.4633 20.5023 19.1679 19.4453C19.8726 18.3883 20.8516 17.543 22 17"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 29V30C21 30.7956 21.3161 31.5587 21.8787 32.1213C22.4413 32.6839 23.2044 33 24 33C24.7956 33 25.5587 32.6839 26.1213 32.1213C26.6839 31.5587 27 30.7956 27 30V29"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              <span className="text-gray-800 font-medium text-base">
                Notification Options
              </span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          <Link
            to="/Currency"
            className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            aria-label="Currency"
          >
            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-primary stroke-current"
                viewBox="0 0 48 48"
                fill="none"
              >
                <rect
                  opacity="0.08"
                  width="48"
                  height="48"
                  rx="8"
                  fill="currentColor"
                />
                <g>
                  <path
                    d="M28.7 20C28.501 19.4352 28.1374 18.943 27.6563 18.5865C27.1751 18.2301 26.5983 18.0258 26 18H22C21.2044 18 20.4413 18.3161 19.8787 18.8787C19.3161 19.4413 19 20.2044 19 21C19 21.7956 19.3161 22.5587 19.8787 23.1213C20.4413 23.6839 21.2044 24 22 24H26C26.7956 24 27.5587 24.3161 28.1213 24.8787C28.6839 25.4413 29 26.2044 29 27C29 27.7956 28.6839 28.5587 28.1213 29.1213C27.5587 29.6839 26.7956 30 26 30H22C21.4017 29.9742 20.8249 29.7699 20.3437 29.4135C19.8626 29.057 19.499 28.5648 19.3 28"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M24 15V18M24 30V33"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              <span className="text-gray-800 font-medium text-base">Currency</span>
            </div>
            <span className="text-gray-500 font-medium">USD</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          <Link
            to="/TermsAndPrivacy"
            className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            aria-label="Terms and Privacy"
          >
            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-primary stroke-current"
                viewBox="0 0 48 48"
                fill="none"
              >
                <rect
                  opacity="0.08"
                  width="48"
                  height="48"
                  rx="8"
                  fill="currentColor"
                />
                <g>
                  <path
                    d="M24 33C28.9706 33 33 28.9706 33 24C33 19.0294 28.9706 15 24 15C19.0294 15 15 19.0294 15 24C15 28.9706 19.0294 33 24 33Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M24 20H24.01"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23 24H24V28H25"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              <span className="text-gray-800 font-medium text-base">
                Terms and Privacy
              </span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          <Link
            to="/ContactUs"
            className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            aria-label="Contact Us"
          >
            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-primary stroke-current"
                viewBox="0 0 48 48"
                fill="none"
              >
                <rect
                  opacity="0.08"
                  width="48"
                  height="48"
                  rx="8"
                  fill="currentColor"
                />
                <g>
                  <path
                    d="M16 15H18C18.2652 15 18.5196 15.1054 18.7071 15.2929C18.8946 15.4804 19 15.7348 19 16V18C19 18.2652 18.8946 18.5196 18.7071 18.7071C18.5196 18.8946 18.2652 19 18 19H16C15.7348 19 15.4804 18.8946 15.2929 18.7071C15.1054 18.5196 15 18.2652 15 18V16C15 15.7348 15.1054 15.4804 15.2929 15.2929C15.4804 15.1054 15.7348 15 16 15Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M30 15H32C32.2652 15 32.5196 15.1054 32.7071 15.2929C32.8946 15.4804 33 15.7348 33 16V18C33 18.2652 32.8946 18.5196 32.7071 18.7071C32.5196 18.8946 32.2652 19 32 19H30C29.7348 19 29.4804 18.8946 29.2929 18.7071C29.1054 18.5196 29 18.2652 29 18V16C29 15.7348 29.1054 15.4804 29.2929 15.2929C29.4804 15.1054 29.7348 15 30 15Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23 15H25C25.2652 15 25.5196 15.1054 25.7071 15.2929C25.8946 15.4804 26 15.7348 26 16V18C26 18.2652 25.8946 18.5196 25.7071 18.7071C25.5196 18.8946 25.2652 19 25 19H23C22.7348 19 22.4804 18.8946 22.2929 18.7071C22.1054 18.5196 22 18.2652 22 18V16C22 15.7348 22.1054 15.4804 22.2929 15.2929C22.4804 15.1054 22.7348 15 23 15Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 22H18C18.2652 22 18.5196 22.1054 18.7071 22.2929C18.8946 22.4804 19 22.7348 19 23V25C19 25.2652 18.8946 25.5196 18.7071 25.7071C18.5196 25.8946 18.2652 26 18 26H16C15.7348 26 15.4804 25.8946 15.2929 25.7071C15.1054 25.5196 15 25.2652 15 25V23C15 22.7348 15.1054 22.4804 15.2929 22.2929C15.4804 22.1054 15.7348 22 16 22Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M30 22H32C32.2652 22 32.5196 22.1054 32.7071 22.2929C32.8946 22.4804 33 22.7348 33 23V25C33 25.2652 32.8946 25.5196 32.7071 25.7071C32.5196 25.8946 32.2652 26 32 26H30C29.7348 26 29.4804 25.8946 29.2929 25.7071C29.1054 25.5196 29 25.2652 29 25V23C29 22.7348 29.1054 22.4804 29 22.2929C29.4804 22.1054 29.7348 22 30 22Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23 22H25C25.2652 22 25.5196 22.1054 25.7071 22.2929C25.8946 22.4804 26 22.7348 26 23V25C26 25.2652 25.8946 25.5196 25.7071 25.7071C25.5196 25.8946 25.2652 26 25 26H23C22.7348 26 22.4804 25.8946 22.2929 25.7071C22.1054 25.5196 22 25.2652 22 25V23C22 22.7348 22.1054 22.4804 22 22.2929C22.4804 22.1054 22.7348 22 23 22Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23 29H25C25.2652 29 25.5196 29.1054 25.7071 29.2929C25.8946 29.4804 26 29.7348 26 30V32C26 32.2652 25.8946 32.5196 25.7071 32.7071C25.5196 32.8946 25.2652 33 25 33H23C22.7348 33 22.4804 32.8946 22.2929 32.7071C22.1054 32.5196 22 32.2652 22 32V30C22 29.7348 22.1054 29.4804 22 29.2929C22.4804 29.1054 22.7348 29 23 29Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              <span className="text-gray-800 font-medium text-base">Contact Us</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          {/* Delete Account (non-link) */}
          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 transition cursor-pointer">
            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-600 stroke-current"
                viewBox="0 0 48 48"
                fill="none"
              >
                <rect
                  opacity="0.08"
                  width="48"
                  height="48"
                  rx="8"
                  fill="currentColor"
                />
                <g>
                  <path
                    d="M22 22L26 26M26 22L22 26"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M24 15C31.2 15 33 16.8 33 24C33 31.2 31.2 33 24 33C16.8 33 15 31.2 15 24C15 16.8 16.8 15 24 15Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              <span className="text-gray-800 font-medium text-base">Delete Account</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>

          {/* Logout (opens bottom offcanvas) */}
          <button
            type="button"
            className="w-full text-left flex items-center justify-between p-4 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasLogout"
            aria-label="Logout"
          >
            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-600 stroke-current"
                viewBox="0 0 48 48"
                fill="none"
              >
                <rect
                  opacity="0.08"
                  width="48"
                  height="48"
                  rx="8"
                  fill="currentColor"
                />
                <g>
                  <path
                    d="M26 20V18C26 17.4696 25.7893 16.9609 25.4142 16.5858C25.0391 16.2107 24.5304 16 24 16H17C16.4696 16 15.9609 16.2107 15.5858 16.5858C15.2107 16.9609 15 17.4696 15 18M16 18C16 18.5304 16.2107 19.0391 16.5858 19.4142C16.9609 19.7893 17.4696 20 18 20H30C30.2652 20 30.5196 20.1054 30.7071 20.2929C30.8946 20.4804 31 20.7348 31 21V24M16 18V30C16 30.5304 16.2107 31.0391 16.5858 31.4142C16.9609 31.7893 17.4696 32 18 32H30C30.2652 32 30.5196 31.8946 30.7071 31.7071C30.8946 31.5196 31 31.2652 31 31V28"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 24H33L30 21"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M30 27L33 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              <span className="text-gray-800 font-medium text-base">Logout</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </nav>
      </div>

      {/* === LOGOUT CONFIRMATION BOTTOM OFFCANVAS === */}
      <div
        className="offcanvas offcanvas-bottom bg-gray-100"
        tabIndex="-1"
        id="offcanvasLogout"
        aria-labelledby="offcanvasLogoutLabel"
      >
        <div className="px-4 py-4 flex items-center justify-end border-b border-gray-200">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            data-bs-dismiss="offcanvas"
            aria-label="Close logout confirmation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6 text-center">
          <h2
            id="offcanvasLogoutLabel"
            className="text-gray-800 text-xl font-semibold mb-2"
          >
            Logout
          </h2>
          <p className="text-gray-500 mb-6">
            Are you sure you want to log out?
          </p>
          <div className="flex justify-center items-center gap-4">
            <button
              className="bg-white text-primary font-medium text-lg py-3 px-6 rounded-xl shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              data-bs-dismiss="offcanvas"
              aria-label="Cancel logout"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate("/", { replace: true });
              }}
              className="bg-primary text-white font-medium text-lg py-3 px-6 rounded-xl shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              aria-label="Confirm logout"
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </div>

      {/* === HOME SCREEN PROMO POPUP === */}
      {isVisible && (
        <>
          {/* Dimmed backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={hidePopup}
            aria-hidden="true"
          ></div>

          {/* Popup panel */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg bg-white rounded-t-3xl z-60 p-6 shadow-lg">
            <button
              id="btnClose"
              onClick={hidePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Close popup"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="text-center pt-4">
              <img
                src={logo}
                alt="Dentgo AI Chatbot Logo"
                className="mx-auto w-24 h-24"
              />
              <h3 className="text-gray-800 text-2xl font-semibold mt-4">
                Dentgo AI Chatbot
              </h3>
              <p className="mt-2 text-gray-500 text-base leading-6 px-2">
                Add the Dentgo Dental AI Assistant to your home screen for fast,
                seamless access—just like a regular app.
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  className="inline-flex items-center bg-primary text-white text-lg font-medium py-3 px-6 rounded-lg shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  aria-label="Add Home Screen"
                >
                  Add Home Screen
                  {/* Decorative ring effect can be added via CSS if desired */}
                  <span className="ml-2">➔</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DentgoGptHome;
