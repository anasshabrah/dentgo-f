import { API_BASE } from "../config";
export async function fetchNotifications() {
    const res = await fetch(`${API_BASE}/api/notifications`, {
        method: "GET",
        credentials: "include",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch notifications");
    }
    return res.json();
}
export async function markNotificationSeen(id) {
    const res = await fetch(`${API_BASE}/api/notifications/${id}/seen`, {
        method: "POST",
        credentials: "include",
    });
    if (!res.ok) {
        throw new Error("Failed to mark notification as seen");
    }
    return res.json();
}
