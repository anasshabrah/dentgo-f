// src/api/chats.ts
import { API_BASE } from "@/config";

export interface ChatMessage {
  role: "USER" | "ASSISTANT";
  content: string;
}

export interface ChatSession {
  id: number;
  title?: string | null;
  startedAt: string;
  endedAt?: string | null;
  isEnded: boolean;
  messages: ChatMessage[];
}

type ChatSessionSummary = Omit<ChatSession, "messages">;

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
 * Utility: Makes fetch with optional 401 refresh-and-retry.
 */
async function fetchWithRetry<T>(
  input: RequestInfo,
  init: RequestInit,
  fallbackError: string
): Promise<T> {
  const makeRequest = async () => {
    const res = await fetch(input, init);
    if (!res.ok) {
      if (res.status === 401) throw new Error("Unauthorized");
      await handleErrorResponse(res, fallbackError);
    }
    return res.json() as Promise<T>;
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
      return await makeRequest();
    }
    throw err;
  }
}

/**
 * Fetches all chat sessions for the current user
 */
export async function fetchChatSessions(): Promise<ChatSessionSummary[]> {
  return fetchWithRetry<ChatSessionSummary[]>(
    `${API_BASE}/api/chats`,
    {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    },
    "Failed to fetch chat sessions"
  );
}

/**
 * Fetches a specific chat session by ID
 */
export async function fetchChatSession(id: number): Promise<ChatSession> {
  return fetchWithRetry<ChatSession>(
    `${API_BASE}/api/chats/${id}`,
    {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    },
    "Failed to fetch chat session"
  );
}

/**
 * Marks a chat session as ended (optionally renaming it)
 */
export async function endChatSession(
  sessionId: number,
  title?: string
): Promise<void> {
  await fetchWithRetry<void>(
    `${API_BASE}/api/chats/${sessionId}/end`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(title ? { title } : {}),
    },
    "Failed to end chat session"
  );
}
