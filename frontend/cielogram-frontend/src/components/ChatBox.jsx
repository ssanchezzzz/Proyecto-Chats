import { useState, useRef, useEffect } from 'react';
import './ChatBox.css';

function ChatBox({ messages, onSend, currentUser }) {
  const [content, setContent] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSend(content);
      setContent('');
    }
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-messages">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`chatbox-message ${msg.sender.username === currentUser ? 'own' : ''}`}
          >
            <div className="chatbox-avatar">
              <img src={msg.sender.avatar || '/default-avatar.png'} alt="avatar" />
            </div>
            <div className="chatbox-bubble">
              <div className="chatbox-sender">{msg.sender.username}</div>
              <div className="chatbox-content">{msg.content}</div>
              <div className="chatbox-time">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chatbox-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default ChatBox;