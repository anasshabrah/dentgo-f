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
 * Fetches all chat sessions for the current user
 */
export async function fetchChatSessions(): Promise<Omit<ChatSession, 'messages'>[]> {
  const res = await fetch(`${API_BASE}/api/chats`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to fetch chat sessions");
  }
  return res.json();
}

/**
 * Fetches a specific chat session by ID
 */
export async function fetchChatSession(id: number): Promise<ChatSession> {
  const res = await fetch(`${API_BASE}/api/chats/${id}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to fetch chat session");
  }
  return res.json();
}

/**
 * Marks a chat session as ended (optionally renaming it)
 */
export async function endChatSession(
  sessionId: number,
  title?: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/chats/${sessionId}/end`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(title ? { title } : {}),
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to end chat session");
  }
}
