const API_BASE = process.env.REACT_APP_SERVER_URL || '';

export async function fetchChatSessions() {
  const res = await fetch(`${API_BASE}/api/chats`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch chat sessions');
  return res.json();
}

export async function fetchChatSession(id) {
  const res = await fetch(`${API_BASE}/api/chats/${id}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch chat session');
  return res.json();
}

export async function endChatSession(sessionId) {
  const res = await fetch(`${API_BASE}/api/chats/${sessionId}/end`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to end chat session');
}
