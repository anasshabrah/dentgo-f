import axios from "axios";
import { API_BASE } from "../config";
export async function createStripeCustomer() {
    const resp = await axios.post(`${API_BASE}/api/payments/create-customer`, {}, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
    });
    return resp.data;
}
export async function createSubscription(priceId, paymentMethodId) {
    const resp = await axios.post(`${API_BASE}/api/payments/create-subscription`, { priceId, paymentMethodId }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
    });
    return resp.data;
}
export async function fetchActiveSubscription() {
    const resp = await axios.get(`${API_BASE}/api/subscriptions`, {
        withCredentials: true,
    });
    return resp.data;
}
