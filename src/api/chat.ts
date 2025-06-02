const API_BASE = import.meta.env.VITE_SERVER_URL || "";

export async function askDentgo(prompt, history = [], sessionId = null, signal) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ prompt, history, sessionId }),
    signal,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Chat failed");
  }
  return res.json();
}
