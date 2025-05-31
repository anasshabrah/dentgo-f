const NOTE_BASE = process.env.REACT_APP_SERVER_URL || '';

export async function fetchNotifications() {
  const res = await fetch(`${NOTE_BASE}/api/notifications`, {
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function markNotificationSeen(id) {
  const res = await fetch(`${NOTE_BASE}/api/notifications/${id}/seen`, {
    method: 'POST',
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to mark notification as seen');
  return res.json();
}
