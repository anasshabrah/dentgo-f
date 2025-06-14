// src/api/chat.ts

import { API_BASE } from "@/config";

export interface ChatMessage {
  role: string;
  text: string;
}

export interface ChatResponse {
  sessionId: number;
  answer: string;
}

/**
 * Utility: Parses error responses consistently.
 */
async function handleErrorResponse(
  res: Response,
  defaultMessage: string
): Promise<never> {
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

/**
 * Sends a message to the Dentgo chat assistant.
 */
export async function askDentgo(
  prompt: string,
  history: ChatMessage[] = [],
  sessionId: number | null = null,
  signal?: AbortSignal
): Promise<ChatResponse> {
  const payload: Record<string, any> = {
    prompt,
    history,
    ...(sessionId !== null ? { sessionId } : {})
  };

  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
    signal,
  });

  if (!res.ok) {
    await handleErrorResponse(res, "Chat failed");
  }

  return res.json();
}
