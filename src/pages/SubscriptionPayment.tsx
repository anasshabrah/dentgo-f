import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import buttonBack from "../assets/images/Button-Back.png";
import logo from "../assets/images/logo.png";
import Loader from "../components/ui/Loader";
import {
  Elements as ElementsWrapper,
  useStripe,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import {
  stripePromise,
  createPaymentRequest,
  createSubscriptionIntent,
} from "../lib/stripeClient";
import { API_BASE } from "../config";

const PaymentRequestSection = () => {
  const stripe = useStripe();
  const navigate = useNavigate();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);

  // 1) build PaymentRequest
  useEffect(() => {
    if (!stripe) return;
    (async () => {
      try {
        const pr = await createPaymentRequest({
          country: "US",
          currency: "usd",
          total: {
            label: "DentGo Plus Subscription",
            amount: 2500, // $25.00 in cents
          },
          requestPayerName: true,
          requestPayerEmail: true,
        });

        pr.on("paymentmethod", async (event: any) => {
          // 2) when user taps Apple/Google Pay, attach that paymentMethod to a Subscription
          try {
            // create a new Subscription on the backend
            const priceId = process.env.REACT_APP_STRIPE_PRICE_ID || ""; // might pass from config or hardcode
            const paymentMethodId = event.paymentMethod.id as string;

            // ask backend to create subscription Intent
            const { clientSecret } = await createSubscriptionIntent(
              priceId,
              paymentMethodId
            );

            // confirm via Stripe
            const { error, paymentIntent } = await stripe.confirmCardPayment(
              clientSecret,
              { payment_method: paymentMethodId }
            );
            if (error || !paymentIntent) {
              event.complete("fail");
              console.error("Subscription payment error:", error);
              return;
            }

            event.complete("success");
            // redirect to PIN / confirmation flow
            navigate("/confirm-payment-pin");
          } catch (err) {
            console.error("Error creating subscription:", err);
            event.complete("fail");
          }
        });

        pr.canMakePayment().then((result: any) => {
          if (result) setPaymentRequest(pr);
        });
      } catch (err) {
        console.error("PaymentRequest init error:", err);
      }
    })();
  }, [stripe, navigate]);

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
    // as a fallback, navigate to confirm‐pin (in case user wants to pick a saved card)
    navigate("/confirm-payment-pin");
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
      <ElementsWrapper stripe={stripePromise}>
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
                <button
                  onClick={() => navigate("/select-payment-method")}
                  className="text-gray-800 text-2xl"
                  aria-label="Choose saved payment method"
                >
                  <i className="ri-arrow-down-s-line"></i>
                </button>
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
      </ElementsWrapper>
    </div>
  );
};

export default SubscriptionPayment;
