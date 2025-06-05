import { API_BASE } from "../config";

export async function askDentgo(
  prompt: string,
  history: Array<{ role: string; text: string }> = [],
  sessionId: number | null = null,
  signal?: AbortSignal
): Promise<{ sessionId: number; answer: string }> {
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
