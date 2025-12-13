import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import '../../styles/ChatWidget.css';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm Sage. What can I cook for you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState("");

  const messagesEndRef = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    // Fake robot replay fro testing
    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        text: "This feature is coming soon! I'll be able to suggest recipes based on your ingredients.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div ref={widgetRef} className="chat-widget-container">
      <button
        className="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>


      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <h3><Sparkles size={18} /> Chef Sage</h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask the chef..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatWidget;