import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext'; // Import Chat Context
import '../../styles/ChatWidget.css';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Use Global Chat State
  const { messages, isLoading, sendMessage } = useChat();
  const { token } = useAuth();
  const navigate = useNavigate();

  const messagesEndRef = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && widgetRef.current && !widgetRef.current.contains(event.target)) {
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

    // Call the global function
    await sendMessage(inputValue, token);
    setInputValue("");
  };

  return (
    <div ref={widgetRef} className="chat-widget-container">
      <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>

      {isOpen && (
        <div className="chat-interface widget-mode">
          <div className="chat-header">
            <h3><Sparkles size={18} /> Chef Sage</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={() => navigate('/chat')} className="icon-btn maximize-btn" title="Full Screen">
                <Maximize2 size={18} />
              </button>
              <button onClick={() => setIsOpen(false)} className="icon-btn" title="Close">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="message bot"><span className="typing-indicator">Thinking...</span></div>
            )}
            <div ref={messagesEndRef} />
          </div>

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