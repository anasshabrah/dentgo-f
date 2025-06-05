import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/ui/Loader";
import { fetchCards } from "../api/cards";

interface Card {
  id: number;
  network: string | null;
  last4: string;
  isActive: boolean;
}

const BankCards: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [fetchError, setFetchError] = useState<string>("");

  useEffect(() => {
    async function loadCards() {
      try {
        const fetchedCards = await fetchCards();
        setCards(fetchedCards);
      } catch (err) {
        console.error("Failed to fetch cards:", err);
        setFetchError("Unable to load saved cards.");
      } finally {
        setLoading(false);
      }
    }
    loadCards();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-4 flex flex-col">
      <div className="mx-auto max-w-lg px-4">
        <div className="bg-primary pt-4 px-4 flex flex-col items-stretch mt-5 rounded-t-3xl h-[calc(100vh-90px)] overflow-y-auto">
          {fetchError && (
            <div className="text-sm p-2 border border-red-400 rounded bg-red-100 mb-3 text-red-600">
              {fetchError}
            </div>
          )}

          {cards.length > 0 ? (
            cards.map((card) => (
              <Link to="/add-new-card" key={card.id}>
                <div className="border-b-2 border-gray-200 dark:border-gray-700 px-0">
                  <div className="flex items-center gap-2 py-4 pr-8 cursor-pointer">
                    <span className="w-8 h-8 flex items-center justify-center">
                      <svg width="32" height="32" className="text-blue">
                        <circle cx="16" cy="16" r="16" fill="currentColor" />
                      </svg>
                    </span>
                    <div className="pl-4">
                      <div className="text-gray-800 dark:text-gray-200 text-base font-semibold leading-6">
                        {card.network || "Unknown Network"}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-5">
                        <span className={card.isActive ? "text-blue-700" : "text-red-600"}>
                          {card.isActive ? "Active" : "Inactive"}
                        </span>{" "}
                        | Card Number **** {card.last4}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 my-3 text-sm">
              No saved cards found.
            </p>
          )}

          <div className="flex flex-col items-center justify-center mt-auto">
            <Link
              to="/add-new-card"
              className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-primary text-lg font-medium rounded-xl py-4 text-center hover:bg-blue-200 dark:hover:bg-gray-600"
            >
              + Link a New Card
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankCards;
