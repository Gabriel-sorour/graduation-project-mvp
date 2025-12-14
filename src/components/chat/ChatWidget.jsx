import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import '../../styles/ChatWidget.css';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm Sage. What can I cook for you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 1. Add User Message
    const userText = inputValue;
    const userMsg = { id: Date.now(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true); // Start loading

    try {
      // 2. Send to Backend
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ message: userText })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // 3. Add Bot Response (using data.message from JSON structure)
      const botMsg = {
        id: Date.now() + 1,
        text: data.message,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error("Error fetching chat response:", error);
      //Add an error message for the user
      const errorMsg = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting to the kitchen server right now.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false); // Stop loading
    }
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
            {/* Show a small loading indicator inside the chat if waiting */}
            {isLoading && (
              <div className="message bot">
                <span className="typing-indicator">Thinking...</span>
              </div>
            )}
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
              disabled={isLoading} // Disable input while loading
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={isLoading || !inputValue.trim()}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatWidget;