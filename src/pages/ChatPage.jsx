import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useAlert } from '../context/AlertContext';
import '../styles/ChatWidget.css';

function ChatPage() {
  const [inputValue, setInputValue] = useState("");

  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const { token } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const suggestions = [
    "What can I cook with eggs?",
    "Healthy dinner under 30 mins",
    "I have chicken and rice",
    "Suggest a dessert recipe"
  ];

  const handleSuggestionClick = async (text) => {
    await sendMessage(text, token);
  };

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

  const { showConfirm } = useAlert();
  const handleClear = () => {
    showConfirm(
      "Clear Chat History?",
      "Are you sure you want to delete all messages? This cannot be undone.",
      () => {
        clearChat();
      }
    );
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

          <button
            onClick={handleClear}
            className="icon-btn"
            title="Clear Chat"
            disabled={messages.length <= 1}
            style={{
              opacity: messages.length <= 1 ? 0.3 : 1,
              cursor: messages.length <= 1 ? 'default' : 'pointer',
              transition: 'opacity 0.2s'
            }}
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}

          {!isLoading && messages.length === 1 && (
            <div className="suggestions-container">
              {suggestions.map((text, index) => (
                <button
                  key={index}
                  className="suggestion-chip"
                  onClick={() => handleSuggestionClick(text)}
                >
                  {text}
                </button>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="message bot">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendClick} className="chat-input-area">
          <input
            type="search"
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