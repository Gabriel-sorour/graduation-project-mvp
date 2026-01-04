import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import '../styles/ChatWidget.css'; 

function ChatPage() {
  const [inputValue, setInputValue] = useState("");
  const { messages, isLoading, sendMessage } = useChat();
  const { token } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendClick = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    await sendMessage(inputValue, token);
    setInputValue("");
  };

  return (
    <div className="chat-page-container container">
      
      <div className="chat-interface full-page-mode">
        {/* Header */}
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => navigate(-1)} className="icon-btn" title="Back">
              <ArrowLeft size={24} />
            </button>
            <h3><Sparkles size={20} /> Chef Sage</h3>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="message bot">
              <span className="typing-indicator">Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendClick} className="chat-input-area">
          <input
            type="text"
            className="chat-input"
            placeholder="Ask Chef Sage..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
          <button type="submit" className="chat-send-btn" disabled={isLoading || !inputValue.trim()}>
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={22} />}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;