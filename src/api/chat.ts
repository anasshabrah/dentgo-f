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
  fallbackMessage: string
): Promise<never> {
  let errorMsg = fallbackMessage;
  try {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      errorMsg = json?.error || fallbackMessage;
    } catch {
      if (text) errorMsg = text;
    }
  } catch {
    // silent
  }
  throw new Error(errorMsg);
}

/**
 * Sends a message to the Dentgo chat assistant, retrying once on 401.
 */
export async function askDentgo(
  prompt: string,
  history: ChatMessage[] = [],
  sessionId: number | null = null,
  signal?: AbortSignal
): Promise<ChatResponse> {
  const makeRequest = async (): Promise<ChatResponse> => {
    const payload: Record<string, any> = {
      prompt,
      history,
      ...(sessionId !== null ? { sessionId } : {}),
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
      if (res.status === 401) throw new Error("Unauthorized");
      await handleErrorResponse(res, "Chat failed");
    }

    return res.json();
  };

  try {
    return await makeRequest();
  } catch (err: any) {
    if (err.message === "Unauthorized") {
      const refresh = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!refresh.ok) {
        await handleErrorResponse(refresh, "Session expired. Please log in again.");
      }

      return await makeRequest(); // retry after refresh
    }

    throw err;
  }
}
