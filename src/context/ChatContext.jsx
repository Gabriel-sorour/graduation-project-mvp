import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }) {
  // 1. Initialize from LocalStorage or use default
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chef_sage_history');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Hi there! I'm Sage. What can I cook for you today?", sender: 'bot' }
    ];
  });

  const [isLoading, setIsLoading] = useState(false);

  // 2. Save to LocalStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('chef_sage_history', JSON.stringify(messages));
  }, [messages]);

  // 3. Clear Chat Function (Optional, helpful for testing)
  const clearChat = () => {
    const initialMsg = [{ id: 1, text: "Hi there! I'm Sage. What can I cook for you today?", sender: 'bot' }];
    setMessages(initialMsg);
    localStorage.setItem('chef_sage_history', JSON.stringify(initialMsg));
  };

  // 4. The Shared Send Logic
  const sendMessage = async (userText, token) => {
    if (!userText.trim()) return;

    // Add User Message
    const userMsg = { id: Date.now(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: userText })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      let botText = "I couldn't process that.";
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        botText = data.candidates[0].content.parts[0].text;
      } else if (data.message) {
        botText = data.message;
      }

      const botMsg = { id: Date.now() + 1, text: botText, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "Sorry, I'm having trouble connecting to the kitchen server right now.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    messages,
    isLoading,
    sendMessage,
    clearChat
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}