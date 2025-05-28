const API = import.meta.env.VITE_API_BASE_URL;

export async function getUserConversations(token) {
  return fetch('http://localhost:8000/chats/conversations/', {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.json());
}

export async function getConversationMessages(conversationId, token) {
  return fetch(`http://localhost:8000/chats/messages/?conversation=${conversationId}`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.json());
}

export async function sendMessage(conversationId, content, token) {
  return fetch('http://localhost:8000/chats/messages/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ conversation: conversationId, content })
  }).then(res => res.json());
}
