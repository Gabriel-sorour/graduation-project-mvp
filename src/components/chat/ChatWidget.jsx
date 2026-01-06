import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2, Maximize2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useAlert } from '../../context/AlertContext';
import '../../styles/ChatWidget.css';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const { token } = useAuth();
  const navigate = useNavigate();

  const messagesEndRef = useRef(null);
  const widgetRef = useRef(null);

  const { showConfirm } = useAlert();

  const suggestions = [
    "What can I cook with eggs?",
    "Healthy dinner under 30 mins",
    "I have chicken and rice",
    "Suggest a dessert recipe"
  ];

  const handleSuggestionClick = async (text) => {
    await sendMessage(text, token);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (!isOpen) return;

      if (event.target.closest('.alert-overlay')) return;

      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSendClick = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    await sendMessage(inputValue, token);
    setInputValue("");
  };

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
    <div ref={widgetRef} className="chat-widget-container">
      <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>

      {isOpen && (
        <div className="chat-interface widget-mode">

          {/* Header */}
          <div className="chat-header">
            <h3><Sparkles size={18} /> Chef Sage</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

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
                <Trash2 size={18} />
              </button>

              <button onClick={() => navigate('/chat')} className="icon-btn maximize-btn" title="Full Screen">
                <Maximize2 size={18} />
              </button>

              <button onClick={() => setIsOpen(false)} className="icon-btn" title="Close">
                <X size={20} />
              </button>
            </div>
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
              placeholder="Ask the chef..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />

            <button type="submit" className="chat-send-btn" disabled={isLoading || !inputValue.trim()}>
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={23} />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatWidget;