import { API_BASE } from "../config";

export interface Subscription {
  id: number;
  plan: string;
  status: string;
  beganAt: string | null;
  renewsAt: string | null;
  cancelsAt: string | null;
  userId: number;
}

export async function fetchSubscriptions(): Promise<Subscription[]> {
  const res = await fetch(`${API_BASE}/api/subscriptions`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch subscriptions");
  }
  return res.json();
}

export async function fetchSubscription(id: number): Promise<Subscription> {
  const res = await fetch(`${API_BASE}/api/subscriptions/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch subscription");
  }
  return res.json();
}

export interface CreateSubscriptionPayload {
  plan: string;
  status: string;
  beganAt?: string;
  renewsAt?: string;
  cancelsAt?: string;
}

export async function createSubscription(
  data: CreateSubscriptionPayload
): Promise<Subscription> {
  const res = await fetch(`${API_BASE}/api/subscriptions`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to create subscription");
  }
  return res.json();
}

export interface UpdateSubscriptionPayload {
  status?: string;
  renewsAt?: string;
  cancelsAt?: string;
}

export async function updateSubscription(
  id: number,
  updates: UpdateSubscriptionPayload
): Promise<Subscription> {
  const res = await fetch(`${API_BASE}/api/subscriptions/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    throw new Error("Failed to update subscription");
  }
  return res.json();
}

export async function deleteSubscription(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/subscriptions/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to delete subscription");
  }
}
