import axios from "axios";
import { API_BASE } from "../config";

export interface StripeCustomerResponse {
  customerId: string;
}

export async function createStripeCustomer(): Promise<StripeCustomerResponse> {
  const resp = await axios.post(
    `${API_BASE}/api/payments/create-customer`,
    {},
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );
  return resp.data;
}

export interface SubscriptionResponse {
  subscriptionId: string;
  clientSecret: string;
  status: string;
}

export async function createSubscription(
  priceId: string,
  paymentMethodId: string
): Promise<SubscriptionResponse> {
  const resp = await axios.post(
    `${API_BASE}/api/payments/create-subscription`,
    { priceId, paymentMethodId },
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );
  return resp.data;
}

export async function fetchActiveSubscription(): Promise<{
  subscriptionId: string;
  status: string;
  currentPeriodEnd: number;
}> {
  const resp = await axios.get(`${API_BASE}/api/subscriptions`, {
    withCredentials: true,
  });
  return resp.data;
}
