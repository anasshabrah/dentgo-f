// src/api/payments.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '';

export async function createStripeCustomer(token) {
  const resp = await axios.post(
    `${API_BASE}/api/payments/create-customer`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return resp.data; // { customerId: 'cus_...' }
}

export async function createSubscription(token, priceId, paymentMethodId) {
  const resp = await axios.post(
    `${API_BASE}/api/payments/create-subscription`,
    { priceId, paymentMethodId },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return resp.data;
  // { subscriptionId: 'sub_...', clientSecret: 'pi_...', status: 'active' }
}

export async function fetchActiveSubscription(token) {
  const resp = await axios.get(`${API_BASE}/api/subscriptions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return resp.data; // your existing /api/subscriptions logic returns all subscriptions
}
