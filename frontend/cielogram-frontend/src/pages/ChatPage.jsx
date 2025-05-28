import { useEffect, useState } from "react";
import { getUserConversations, getConversationMessages, sendMessage } from "../api/chat";
import ChatBox from "../components/ChatBox";
import { useAuth } from "../hooks/useAuth";

function ChatPage() {
  const { user } = useAuth();
  const token = localStorage.getItem("access");
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!token) return;
    getUserConversations(token).then(data => {
      if (Array.isArray(data)) {
        setConversations(data);
      } else {
        setConversations([]);
      }
    });
  }, [token]);

  useEffect(() => {
    if (selected && token) {
      getConversationMessages(selected.id, token).then(setMessages);
    }
  }, [selected, token]);

  const handleSend = async (content) => {
    await sendMessage(selected.id, content, token);
    getConversationMessages(selected.id, token).then(setMessages);
  };

  if (!user) return <div>Debes iniciar sesión para ver los chats.</div>;

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Chat Page</h1>
        <div className="flex w-full max-w-5xl gap-8">
          <div className="w-1/3 bg-white rounded-lg shadow-md p-4">
            <h2 className="font-semibold mb-2">Conversations</h2>
            <ul>
              {Array.isArray(conversations) && conversations.map(conv => (
                <li
                  key={conv.id}
                  className={`cursor-pointer p-2 rounded ${selected?.id === conv.id ? "bg-blue-100" : "hover:bg-gray-100"}`}
                  onClick={() => setSelected(conv)}
                >
                  {conv.participants?.map(p => p.username).join(", ")}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-2/3 bg-white rounded-lg shadow-md p-4 flex flex-col">
            {selected ? (
              <ChatBox
                messages={messages}
                onSend={handleSend}
                currentUser={user?.username}
              />
            ) : (
              <div className="text-gray-400">Selecciona una conversación</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;