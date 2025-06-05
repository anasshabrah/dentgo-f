import { API_BASE } from "../config";

export interface Notification {
  id: number;
  title: string;
  body: string;
  seen: boolean;
  createdAt: string;
}

export async function fetchNotifications(): Promise<Notification[]> {
  const res = await fetch(`${API_BASE}/api/notifications`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch notifications");
  }
  return res.json();
}

export async function markNotificationSeen(
  id: number
): Promise<{ status: string }> {
  const res = await fetch(
    `${API_BASE}/api/notifications/${id}/seen`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to mark notification as seen");
  }
  return res.json();
}
