// src/api/notifications.ts
import { API_BASE } from "../config";

export interface Notification {
  id: number;
  title: string;
  body: string;
  seen: boolean;
  createdAt: string;
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

export async function fetchNotifications(): Promise<Notification[]> {
  const res = await fetch(`${API_BASE}/api/notifications`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to fetch notifications");
  }
  return res.json();
}

export async function markNotificationSeen(id: number): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE}/api/notifications/${id}/seen`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to mark notification as seen");
  }
  return res.json();
}
