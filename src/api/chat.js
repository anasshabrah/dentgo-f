const API_BASE = process.env.REACT_APP_SERVER_URL || '';

export async function askDentgo(prompt, history = [], sessionId = null, signal) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ prompt, history, sessionId }),
    signal,
  });

  if (!res.ok) {
    const { error = 'Chat failed' } = await res.json().catch(() => ({}));
    throw new Error(error);
  }
  return res.json();
}
