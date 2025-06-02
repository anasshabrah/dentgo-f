const SUB_BASE = import.meta.env.VITE_SERVER_URL || "";

export async function fetchSubscriptions() {
  const res = await fetch(`${SUB_BASE}/api/subscriptions`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch subscriptions");
  return res.json();
}

export async function fetchSubscription(id) {
  const res = await fetch(`${SUB_BASE}/api/subscriptions/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch subscription");
  return res.json();
}

export async function createSubscription(data) {
  const res = await fetch(`${SUB_BASE}/api/subscriptions`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create subscription");
  return res.json();
}

export async function updateSubscription(id, updates) {
  const res = await fetch(`${SUB_BASE}/api/subscriptions/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update subscription");
  return res.json();
}

export async function deleteSubscription(id) {
  const res = await fetch(`${SUB_BASE}/api/subscriptions/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete subscription");
}
