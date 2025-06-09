// src/api/chats.ts
import { API_BASE } from "../config";

export interface ChatSession {
  id: number;
  title?: string;
  startedAt: string;
  endedAt: string | null;
  messages: Array<{ role: "USER" | "ASSISTANT"; content: string }>;
}

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

export async function fetchChatSessions(): Promise<ChatSession[]> {
  const res = await fetch(`${API_BASE}/api/chats`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to fetch chat sessions");
  }
  return res.json();
}

export async function fetchChatSession(id: number): Promise<ChatSession> {
  const res = await fetch(`${API_BASE}/api/chats/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to fetch chat session");
  }
  return res.json();
}

export async function endChatSession(sessionId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/chats/${sessionId}/end`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to end chat session");
  }
}
