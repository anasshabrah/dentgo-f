// src/pages/Currency.tsx
import React, { useEffect, useState } from "react";
import Loader from "@components/ui/Loader";

type CurrencyCode = "USD" | "SAR" | "AED" | "QAR" | "EGP";

interface RateMap {
  [key: string]: number;
}

const fetchRate = async (currency: CurrencyCode): Promise<number> => {
  return new Promise<number>((resolve) =>
    setTimeout(() => {
      const rates: RateMap = {
        USD: 1,
        SAR: 3.75,
        AED: 3.67,
        QAR: 3.64,
        EGP: 30.90,
      };
      resolve(rates[currency] ?? 1);
    }, 700)
  );
};

const Currency: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("USD");
  const [rate, setRate] = useState<number | null>(null);
  const [fetchError, setFetchError] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setFetchError("");
    fetchRate(selectedCurrency)
      .then((data) => {
        if (isMounted) {
          setRate(data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch rate:", err);
        if (isMounted) {
          setFetchError("Unable to load conversion rate.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [selectedCurrency]);

  if (loading) {
    return <Loader fullscreen />;
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-4 flex flex-col">
      <div className="mx-auto max-w-lg px-4">
        <div className="bg-blue-700 mt-5 rounded-t-3xl pt-4 px-4 flex flex-col items-stretch h-[calc(100vh-90px)] overflow-y-auto">
          {/* Currency Selection */}
          <div role="radiogroup" aria-label="Currency selection">
            {(
              [
                { code: "USD", label: "USD" },
                { code: "SAR", label: "SAR" },
                { code: "AED", label: "AED" },
                { code: "QAR", label: "QAR" },
                { code: "EGP", label: "EGP" },
              ] as { code: CurrencyCode; label: string }[]
            ).map(({ code, label }) => (
              <div
                key={code}
                className="peer flex items-center gap-3 rounded border border-gray-200 dark:border-gray-700 p-3 mb-4"
              >
                <input
                  type="radio"
                  name="currency"
                  id={`currency-${code.toLowerCase()}`}
                  className="peer sr-only"
                  checked={selectedCurrency === code}
                  onChange={() => setSelectedCurrency(code)}
                  role="radio"
                  aria-checked={selectedCurrency === code}
                />
                <label
                  htmlFor={`currency-${code.toLowerCase()}`}
                  className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-gray-100 text-base font-medium peer-checked:bg-gray-900 dark:peer-checked:bg-gray-100 peer-checked:text-white dark:peer-checked:text-gray-900 peer-checked:rounded p-2 w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="stroke-current"
                  >
                    <path
                      d="M8.5 14.6667C8.5 15.9553 9.54467 17 10.8333 17H13C14.3807 17 15.5 15.8807 15.5 14.5C15.5 13.1193 14.3807 12 13 12H11C9.61929 12 8.5 10.8807 8.5 9.5C8.5 8.11929 9.61929 7 11 7H13.1667C14.4553 7 15.5 8.04467 15.5 9.33333M12 5.5V7M12 17V18.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {label}
                </label>
              </div>
            ))}
          </div>

          {/* Conversion Rate Display */}
          <div className="mt-4 px-2">
            <h2 className="text-gray-200 dark:text-gray-300 text-xl font-semibold mb-2">
              USD → {selectedCurrency} Rate
            </h2>
            {fetchError ? (
              <p className="text-red-400 text-sm">{fetchError}</p>
            ) : (
              <p className="text-gray-100 dark:text-gray-100 text-lg">
                {rate !== null ? rate.toFixed(2) : "N/A"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Currency;
