// src/api/subscriptions.ts
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

async function handleErrorResponse(res: Response, defaultMessage: string): Promise<never> {
  const text = await res.text().catch(() => "");
  let errorMsg = defaultMessage;
  try {
    const body = JSON.parse(text);
    errorMsg = body.error || errorMsg;
  } catch {
    errorMsg = text || errorMsg;
  }
  throw new Error(errorMsg);
}

export async function fetchSubscriptions(): Promise<Subscription[]> {
  const res = await fetch(`${API_BASE}/api/subscriptions`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to fetch subscriptions");
  }
  return res.json();
}

export async function fetchSubscription(id: number): Promise<Subscription> {
  const res = await fetch(`${API_BASE}/api/subscriptions/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to fetch subscription");
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
    await handleErrorResponse(res, "Failed to create subscription");
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
    await handleErrorResponse(res, "Failed to update subscription");
  }
  return res.json();
}

export async function deleteSubscription(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/subscriptions/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to delete subscription");
  }
}
