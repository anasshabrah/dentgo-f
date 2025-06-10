// src/api/chat.ts
import { API_BASE } from "@/config";

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
    await handleErrorResponse(res, "Chat failed");
  }
  return res.json();
}
