import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import buttonBack from "../assets/images/Button-Back.png";
import logo from "../assets/images/logo.png";
import Loader from "../components/Loader";
import {
  ElementsWrapper,
  useStripe,
  PaymentRequestButtonElement,
} from "../lib/stripeClient";

const PaymentRequestSection = () => {
  const stripe = useStripe();
  const navigate = useNavigate();
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "DentGo Plus Subscription",
        amount: 2500, // $25.00 in cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
      }
    });
  }, [stripe]);

  useEffect(() => {
    if (!paymentRequest) return;

    paymentRequest.on("token", ({ complete, token }) => {
      // TODO: send token.id and subscription info to your backend
      console.log("✅ Received Stripe token for subscription:", token);
      complete("success");
      navigate("/ConfirmPaymentPin");
    });
  }, [paymentRequest, navigate]);

  if (!paymentRequest) return null;

  return (
    <div className="w-full mb-4">
      <PaymentRequestButtonElement
        options={{
          paymentRequest,
          style: {
            paymentRequestButton: {
              type: "buy",
              theme: "dark",
              height: "48px",
            },
          },
        }}
      />
    </div>
  );
};

const SubscriptionPayment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleProceedToCheckout = () => {
    navigate("/ConfirmPaymentPin");
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-100 min-h-screen pb-4 flex flex-col">
      <ElementsWrapper>
        <div className="bg-blue-800 pt-4 pb-8">
          <div className="mx-auto max-w-lg px-4">
            <div className="flex items-center space-x-3 px-3 py-2">
              <button
                type="button"
                onClick={handleBackClick}
                className="p-0"
                aria-label="Go Back"
              >
                <img className="w-6 h-6" src={buttonBack} alt="Go Back" />
              </button>
              <h1 className="text-white text-lg font-medium">
                DentGo Plus Subscription
              </h1>
            </div>
            <div className="bg-white pt-4 px-4 flex flex-col items-stretch mt-5 rounded-t-3xl flex-1 overflow-y-auto">
              <div className="flex justify-center mb-4">
                <img className="w-24 h-auto" src={logo} alt="logo" />
              </div>
              <h2 className="text-center text-xl font-semibold text-gray-800 leading-7 mb-2">
                DentGo Plus Subscription
              </h2>
              <p className="text-center text-sm text-gray-500 mb-4">
                Subscription Due at 15 Dec 2024
              </p>
              <h2 className="text-center text-5xl font-medium text-gray-800 leading-none mb-4">
                $25.00
              </h2>
              <p className="text-center text-sm text-gray-500 mb-4">
                Choose a card or bank for payout
              </p>

              <PaymentRequestSection />

              <p className="text-center text-sm text-gray-500 mb-4">
                Or select a saved payment method
              </p>
              <div className="flex items-center justify-between w-full mb-4">
                <div className="flex w-full items-center gap-2">
                  <span className="border border-gray-200 p-2 rounded w-12 h-8 flex items-center justify-center">
                    <svg
                      width="31"
                      height="19"
                      viewBox="0 0 31 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.0974 16.4389C13.5053 17.7698 11.4401 18.5733 9.1833 18.5733C4.14818 18.5733 0.0664062 14.5737 0.0664062 9.63996C0.0664062 4.70622 4.14818 0.706627 9.1833 0.706627C11.4401 0.706627 13.5053 1.51009 15.0974 2.84102C16.6894 1.51009 18.7547 0.706627 21.0114 0.706627C26.0465 0.706627 30.1283 4.70622 30.1283 9.63996C30.1283 14.5737 26.0465 18.5733 21.0114 18.5733C18.7547 18.5733 16.6894 17.7698 15.0974 16.4389Z"
                        fill="#ED0006"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.0957 16.4389C17.0557 14.8004 18.2985 12.3624 18.2985 9.63996C18.2985 6.91754 17.0557 4.47955 15.0957 2.84102C16.6878 1.51009 18.753 0.706627 21.0098 0.706627C26.0449 0.706627 30.1267 4.70622 30.1267 9.63996C30.1267 14.5737 26.0449 18.5733 21.0098 18.5733C18.753 18.5733 16.6878 17.7698 15.0957 16.4389Z"
                        fill="#F9A000"
                      />
                    </svg>
                  </span>
                  <div className="pl-4">
                    <div className="text-gray-800 text-base font-semibold leading-6">
                      Master Card
                    </div>
                    <div className="text-gray-500 text-sm font-medium leading-5">
                      Card Number **** 7887
                    </div>
                  </div>
                </div>
                <Link
                  to="#finger-print-modal"
                  data-bs-toggle="modal"
                  className="text-gray-800 text-2xl"
                >
                  <i className="ri-arrow-down-s-line"></i>
                </Link>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Promo Code</p>
                <div>
                  <div className="relative mb-4">
                    <input
                      type="number"
                      id="promo_code"
                      className="w-full h-16 bg-gray-200 border-2 border-gray-200 rounded-xl px-4 pt-4 text-lg text-gray-800 focus:border-blue outline-none"
                      autoComplete="off"
                      required
                    />
                    <label
                      htmlFor="promo_code"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-gray-500 transition-all"
                    >
                      Enter Code Here
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-auto"></div>
            </div>
          </div>
        </div>

        <div className="px-4 fixed bottom-4 inset-x-0">
          <button
            type="button"
            className="w-full bg-blue-800 text-white text-lg font-medium py-4 rounded"
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout
          </button>
        </div>

        {/* Pop Up Modal */}
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden"
          id="finger-print-modal"
        >
          <div className="bg-white rounded-3xl p-4 w-full max-w-md">
            <h3 className="text-center text-xl text-gray-800 font-semibold mb-4">
              Choose Payment Method
            </h3>
            <form className="space-y-4">
              {/* Bank of America */}
              <div className="border-b-2 border-gray-200">
                <input
                  type="radio"
                  name="Payment"
                  id="Payment1"
                  className="hidden peer"
                  value="Payment1"
                />
                <label
                  htmlFor="Payment1"
                  className="flex items-center gap-3 py-4 cursor-pointer peer-checked:bg-gray-50"
                >
                  <span className="border border-gray-200 p-2 rounded w-12 h-8 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                    >
                      <path
                        d="M0 28.8H32V32H0V28.8ZM3.2 16H6.4V27.2H3.2V16ZM11.2 16H14.4V27.2H11.2V16ZM17.6 16H20.8V27.2H17.6V16ZM25.6 16H28.8V27.2H25.6V16ZM0 8L16 0L32 8V14.4H0V8ZM16 9.6C16.8837 9.6 17.6 8.88365 17.6 8C17.6 7.11635 16.8837 6.4 16 6.4C15.1163 6.4 14.4 7.11635 14.4 8C14.4 8.88365 15.1163 9.6 16 9.6Z"
                        fill="#0078D7"
                      />
                    </svg>
                  </span>
                  <div className="pl-4">
                    <div className="text-gray-800 text-base font-semibold leading-6">
                      Bank of America
                    </div>
                    <div className="text-gray-500 text-sm font-medium leading-5">
                      <span className="text-blue">Active</span> | Card Number
                      **** 4625
                    </div>
                  </div>
                </label>
              </div>

              {/* Master Card */}
              <div className="border-b-2 border-gray-200">
                <input
                  type="radio"
                  name="Payment"
                  id="Payment2"
                  className="hidden peer"
                  defaultChecked
                />
                <label
                  htmlFor="Payment2"
                  className="flex items-center gap-3 py-4 cursor-pointer peer-checked:bg-gray-50"
                >
                  <span className="border border-gray-200 p-2 rounded w-12 h-8 flex items-center justify-center">
                    <svg
                      width="31"
                      height="19"
                      viewBox="0 0 31 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.0974 16.4389C13.5053 17.7698 11.4401 18.5733 9.1833 18.5733C4.14818 18.5733 0.0664062 14.5737 0.0664062 9.63996C0.0664062 4.70622 4.14818 0.706627 9.1833 0.706627C11.4401 0.706627 13.5053 1.51009 15.0974 2.84102C16.6894 1.51009 18.7547 0.706627 21.0114 0.706627C26.0465 0.706627 30.1283 4.70622 30.1283 9.63996C30.1283 14.5737 26.0465 18.5733 21.0114 18.5733C18.7547 18.5733 16.6894 17.7698 15.0974 16.4389Z"
                        fill="#ED0006"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.0957 16.4389C17.0557 14.8004 18.2985 12.3624 18.2985 9.63996C18.2985 6.91754 17.0557 4.47955 15.0957 2.84102C16.6878 1.51009 18.753 0.706627 21.0098 0.706627C26.0449 0.706627 30.1267 4.70622 30.1267 9.63996C30.1267 14.5737 26.0449 18.5733 21.0098 18.5733C18.753 18.5733 16.6878 17.7698 15.0957 16.4389Z"
                        fill="#F9A000"
                      />
                    </svg>
                  </span>
                  <div className="pl-4">
                    <div className="text-gray-800 text-base font-semibold leading-6">
                      Master Card
                    </div>
                    <div className="text-gray-500 text-sm font-medium leading-5">
                      <span className="text-blue">Active</span> | Card Number
                      **** 7887
                    </div>
                  </div>
                </label>
              </div>

              {/* Visa */}
              <div className="border-b-2 border-gray-200">
                <input
                  type="radio"
                  name="Payment"
                  id="Payment3"
                  className="hidden peer"
                />
                <label
                  htmlFor="Payment3"
                  className="flex items-center gap-3 py-4 cursor-pointer peer-checked:bg-gray-50"
                >
                  <span className="border border-gray-200 p-2 rounded w-12 h-8 flex items-center justify-center">
                    <svg
                      className="w-8 h-6"
                      width="33"
                      height="12"
                      viewBox="0 0 33 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.44956 11.1443H5.68016L3.60344 3.05649C3.50487 2.68445 3.29558 2.35555 2.98772 2.20053C2.21942 1.81097 1.3728 1.50093 0.449219 1.34457V1.03319H4.9105C5.52623 1.03319 5.98802 1.50093 6.06498 2.04417L7.1425 7.87819L9.91055 1.03319H12.603L8.44956 11.1443ZM14.1409 11.1443H11.5254L13.6791 1.03319H16.2945L14.1409 11.1443ZM19.6795 3.83429C19.7565 3.28971 20.2183 2.97833 20.7571 2.97833C21.6037 2.90014 22.5259 3.05651 23.2956 3.44472L23.7574 1.26775C22.9877 0.956368 22.1411 0.800003 21.3728 0.800003C18.8343 0.800003 16.9871 2.20055 16.9871 4.14432C16.9871 5.62305 18.2955 6.39948 19.2191 6.86723C20.2183 7.33362 20.6031 7.64501 20.5262 8.1114C20.5262 8.811 19.7565 9.12238 18.9882 9.12238C18.0646 9.12238 17.141 8.88918 16.2958 8.49962L15.834 10.6779L15.7767 11.0009C15.7129 11.5545 15.3154 11.9998 14.7609 12H14.1409V11.1443ZM32.4472 11.1443L30.3705 1.03319H28.1399C27.6781 1.03319 27.2163 1.34457 27.0624 1.81097L23.2168 11.1443H25.9092L26.4466 9.66695H29.7548L30.0627 11.1443H32.4472ZM28.528 3.75611L29.2963 7.56683H27.1426L28.528 3.75611Z"
                        fill="#000"
                      />
                    </svg>
                  </span>
                  <div className="pl-4">
                    <div className="text-gray-800 text-base font-semibold leading-6">
                      Visa
                    </div>
                    <div className="text-gray-500 text-sm font-medium leading-5">
                      <span className="text-red">Inactive</span> | Card Number
                      **** 2540
                    </div>
                  </div>
                </label>
              </div>

              {/* JPMorgan Bank */}
              <div className="border-b-2 border-gray-200">
                <input
                  type="radio"
                  name="Payment"
                  id="Payment4"
                  className="hidden peer"
                  value="Payment4"
                />
                <label
                  htmlFor="Payment4"
                  className="flex items-center gap-3 py-4 cursor-pointer peer-checked:bg-gray-50"
                >
                  <span className="border border-gray-200 p-2 rounded w-12 h-8 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                    >
                      <path
                        d="M0 28.8H32V32H0V28.8ZM3.2 16H6.4V27.2H3.2V16ZM11.2 16H14.4V27.2H11.2V16ZM17.6 16H20.8V27.2H17.6V16ZM25.6 16H28.8V27.2H25.6V16ZM0 8L16 0L32 8V14.4H0V8ZM16 9.6C16.8837 9.6 17.6 8.88365 17.6 8C17.6 7.11635 16.8837 6.4 16 6.4C15.1163 6.4 14.4 7.11635 14.4 8C14.4 8.88365 15.1163 9.6 16 9.6Z"
                        fill="#0078D7"
                      />
                    </svg>
                  </span>
                  <div className="pl-4">
                    <div className="text-gray-800 text-base font-semibold leading-6">
                      JPMorgan Bank
                    </div>
                    <div className="text-gray-500 text-sm font-medium leading-5">
                      <span className="text-blue">Active</span> | Card Number
                      **** 4625
                    </div>
                  </div>
                </label>
              </div>

              {/* Amazon Pay */}
              <div className="border-b-2 border-gray-200">
                <input
                  type="radio"
                  name="Payment"
                  id="Payment5"
                  className="hidden peer"
                />
                <label
                  htmlFor="Payment5"
                  className="flex items-center gap-3 py-4 cursor-pointer peer-checked:bg-gray-50"
                >
                  <span className="border border-gray-200 p-2 rounded w-12 h-8 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="27"
                      height="32"
                      viewBox="0 0 27 32"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.51617 30.9154L8.05722 27.3929L6.85197 27.3641H1.09668L5.0964 1.37019C5.10886 1.29148 5.14914 1.21841 5.20797 1.16643C5.26709 1.11445 5.34244 1.08594 5.42126 1.08594H15.1256C18.3475 1.08594 20.5708 1.77297 21.7314 3.1292C22.2756 3.76544 22.6222 4.43048 22.79 5.16207C22.9659 5.92989 22.9688 6.84711 22.7972 7.96602L22.7848 8.04741V8.76444L23.329 9.08047C23.7872 9.32968 24.1514 9.61483 24.4308 9.94126C24.8962 10.4854 25.1973 11.1769 25.3245 11.9964C25.4561 12.8394 25.4126 13.8427 25.1973 14.9786C24.949 16.2849 24.5476 17.4228 24.0054 18.3537C23.5069 19.2115 22.8717 19.9232 22.1174 20.4745C21.3973 20.9985 20.5418 21.3962 19.5745 21.6507C18.637 21.9008 17.5682 22.0271 16.396 22.0271H15.6408C15.1009 22.0271 14.5764 22.2264 14.1646 22.5837C13.7516 22.9485 13.4787 23.4469 13.3949 23.9919L13.3378 24.3092L12.3818 30.518L12.3386 30.7458C12.327 30.818 12.3073 30.8539 12.2783 30.8782C12.2525 30.9005 12.2155 30.9154 12.1792 30.9154H7.51617Z"
                        fill="#28356A"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M23.845 8.13013C23.8163 8.31993 23.7829 8.51389 23.7459 8.71319C22.4661 15.448 18.0876 17.7747 12.4958 17.7747H9.64858C8.96466 17.7747 8.38827 18.2835 8.28191 18.9749L6.4113 31.1368C6.34204 31.591 6.68341 32 7.13027 32H12.1802C12.7781 32 13.2861 31.5547 13.3802 30.9503L13.4298 30.6874L14.3806 24.503L14.4418 24.1637C14.5348 23.5572 15.0439 23.1117 15.6418 23.1117H16.397C21.2896 23.1117 25.1198 21.0758 26.2392 15.184C26.7067 12.7228 26.4647 10.6676 25.2273 9.2223C24.8529 8.78656 24.3883 8.42478 23.845 8.13013Z"
                        fill="#298FC2"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M22.5067 7.5831C22.3111 7.52458 22.1094 7.47171 21.9025 7.42389C21.6944 7.37725 21.4814 7.33597 21.2621 7.29973C20.4944 7.1726 19.6531 7.1123 18.7522 7.1123H11.146C10.9585 7.1123 10.7805 7.15567 10.6214 7.23409C10.2705 7.40696 10.01 7.74735 9.9468 8.16408L8.32859 18.6688L8.28223 18.975C8.38858 18.2836 8.96498 17.7747 9.64889 17.7747H12.4961C18.088 17.7747 22.4664 15.4469 23.7462 8.71329C23.7844 8.51398 23.8166 8.32002 23.8453 8.13022C23.5216 7.95408 23.1709 7.80349 22.7933 7.67517C22.7 7.64339 22.6038 7.6128 22.5067 7.5831Z"
                        fill="#22284F"
                      />
                    </svg>
                  </span>
                  <div className="pl-4">
                    <div className="text-gray-800 text-base font-semibold leading-6">
                      Amazon Pay
                    </div>
                  </div>
                </label>
              </div>
            </form>
          </div>
        </div>
        {/* Pop Up Modal End */}
      </ElementsWrapper>
    </div>
  );
};

export default SubscriptionPayment;
