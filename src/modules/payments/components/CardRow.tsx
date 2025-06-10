// src/modules/payments/components/CardRow.tsx
import React from 'react';
import type { CardData } from '@/modules/payments/types';
import visaLogo from '@/assets/cards/visa.svg';
import mcLogo from '@/assets/cards/mastercard.svg';
import amexLogo from '@/assets/cards/amex.svg';
import cardIcon from '@/assets/cards/card.svg';

const logos: Record<string, string> = {
  visa: visaLogo,
  mastercard: mcLogo,
  amex: amexLogo,
};

export const CardRow: React.FC<{ card: CardData }> = ({ card }) => {
  const key = card.network?.toLowerCase() || '';
  const logoSrc = logos[key] || cardIcon;

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800">
      <div className="flex items-center gap-4">
        <div className="w-12 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
          <img src={logoSrc} alt={card.network || 'Card'} className="w-8 h-8 object-contain" />
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            **** {card.last4}
          </div>
          <span
            className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
              card.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900'
                : 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900'
            }`}
          >
            {card.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
};
