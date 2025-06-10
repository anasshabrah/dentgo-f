// src/modules/payments/types.ts
export interface CardData {
  id: string;
  last4: string;
  network: string;
  paymentMethodId: string;
  isActive: boolean;
}
