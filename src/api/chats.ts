import { API_BASE } from "../config";

export interface ChatSession {
  id: number;
  title?: string;
  startedAt: string;
  endedAt: string | null;
  messages: Array<{ role: "USER" | "ASSISTANT"; content: string }>;
}

export async function fetchChatSessions(): Promise<ChatSession[]> {
  const res = await fetch(`${API_BASE}/api/chats`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to fetch chat sessions");
  }
  return res.json();
}

export async function fetchChatSession(
  id: number
): Promise<ChatSession> {
  const res = await fetch(`${API_BASE}/api/chats/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to fetch chat session");
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
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to end chat session");
  }
}
