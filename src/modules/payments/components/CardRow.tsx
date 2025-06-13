// src/modules/payments/components/CardRow.tsx
import React, { useState } from 'react';
import type { CardData } from '@/modules/payments/types';
import visaLogo from '@/assets/cards/visa.svg';
import mcLogo from '@/assets/cards/mastercard.svg';
import amexLogo from '@/assets/cards/amex.svg';
import cardIcon from '@/assets/cards/card.svg';
import { useStripeData } from '@/context/StripeContext';

const logos: Record<string, string> = {
  visa: visaLogo,
  mastercard: mcLogo,
  amex: amexLogo,
};

export const CardRow: React.FC<{ card: CardData }> = ({ card }) => {
  const key = card.network?.toLowerCase() || '';
  const logoSrc = logos[key] || cardIcon;

  const { removeCard } = useStripeData();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this card?");
    if (!confirmed) return;

    setDeleting(true);
    try {
      await removeCard(card.id);
    } catch (err: any) {
      console.error("Delete failed", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-2 sm:p-4 border-b bg-white dark:bg-gray-800">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="w-10 h-6 sm:w-12 sm:h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
          <img src={logoSrc} alt={card.network || 'Card'} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
            **** {card.last4}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-600 hover:text-red-800 disabled:opacity-50 text-xl sm:text-base"
          aria-label="Delete card"
        >
          🗑
        </button>
        <span
          className={`inline-block px-2 py-0.5 text-xs sm:text-sm font-semibold rounded-full ${
            card.isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900'
              : 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900'
          }`}
        >
          {card.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  );
};