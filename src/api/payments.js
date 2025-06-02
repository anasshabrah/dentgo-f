// src/api/payments.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_SERVER_URL || '';

export async function createStripeCustomer() {
  const resp = await axios.post(
    `${API_BASE}/api/payments/create-customer`,
    {},
    {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    }
  );
  return resp.data; // { customerId: 'cus_...' }
}

export async function createSubscription(priceId, paymentMethodId) {
  const resp = await axios.post(
    `${API_BASE}/api/payments/create-subscription`,
    { priceId, paymentMethodId },
    {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    }
  );
  return resp.data;
}

export async function fetchActiveSubscription() {
  const resp = await axios.get(`${API_BASE}/api/subscriptions`, {
    withCredentials: true,
  });
  return resp.data;
}
