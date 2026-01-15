import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2, Maximize2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useAlert } from '../../context/AlertContext';
import { useLanguage } from '../../context/LanguageContext';
import SmartMessageContent from './SmartMessageContent';
import '../../styles/ChatWidget.css';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showButton, setShowButton] = useState(true);

  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const { token } = useAuth();
  const { showConfirm } = useAlert();
  const { language } = useLanguage();
  
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const widgetRef = useRef(null);
  const lastScrollY = useRef(0);

  const t = {
    title: language === 'ar' ? 'شيف ساج' : 'Chef Sage',
    placeholder: language === 'ar' ? 'اسأل الشيف...' : 'Ask the chef...',
    clearTitle: language === 'ar' ? 'مسح المحادثة؟' : 'Clear Chat History?',
    clearMsg: language === 'ar' 
      ? 'هل أنت متأكد من حذف جميع الرسائل؟ لا يمكن التراجع عن هذا الإجراء.' 
      : 'Are you sure you want to delete all messages? This cannot be undone.',
    clearTooltip: language === 'ar' ? 'مسح المحادثة' : 'Clear Chat',
    expandTooltip: language === 'ar' ? 'ملء الشاشة' : 'Full Screen',
    closeTooltip: language === 'ar' ? 'إغلاق' : 'Close'
  };

  const suggestions = language === 'ar' ? [
    "ماذا يمكنني أن أطبخ بالبيض؟",
    "عشاء صحي في 30 دقيقة",
    "لدي دجاج وأرز",
    "اقترح وصفة حلوى"
  ] : [
    "What can I cook with eggs?",
    "Healthy dinner under 30 mins",
    "I have chicken and rice",
    "Suggest a dessert recipe"
  ];

  const handleSuggestionClick = async (text) => {
    if (!token) {
      setIsOpen(false);
      navigate('/login');
      return;
    }
    await sendMessage(text, token, language);
  };

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (isOpen) {
          setShowButton(true);
          return;
        }
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) { 
          setShowButton(false);
        } else { 
          setShowButton(true);  
        }
        lastScrollY.current = currentScrollY;
      }
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [isOpen]); 

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

    if (!token) {
      setIsOpen(false);
      navigate('/login');
      return;
    }

    await sendMessage(inputValue, token, language);
    setInputValue("");
  };

  const handleClear = () => {
    showConfirm(
      t.clearTitle,
      t.clearMsg,
      () => {
        clearChat();
      }
    );
  };

  return (
    <div ref={widgetRef} className="chat-widget-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <button 
        className={`chat-toggle-btn ${!showButton ? 'scroll-hide' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        title={t.title}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>

      {isOpen && (
        <div className="chat-interface widget-mode">

          <div className="chat-header">
            <h3><Sparkles size={18} /> {t.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

              <button
                onClick={handleClear}
                className="icon-btn"
                title={t.clearTooltip}
                disabled={messages.length <= 1}
                style={{
                  opacity: messages.length <= 1 ? 0.3 : 1,
                  cursor: messages.length <= 1 ? 'default' : 'pointer',
                  transition: 'opacity 0.2s'
                }}
              >
                <Trash2 size={18} />
              </button>

              <button onClick={() => {
                 if (!token) {
                    setIsOpen(false);
                    navigate('/login');
                 } else {
                    navigate('/chat');
                 }
              }} className="icon-btn maximize-btn" title={t.expandTooltip}>
                <Maximize2 size={18} />
              </button>

              <button onClick={() => setIsOpen(false)} className="icon-btn" title={t.closeTooltip}>
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                
                <div className="msg-text">{msg.text}</div>

                {msg.sender === 'bot' && msg.apiResponse && (
                  <SmartMessageContent data={msg.apiResponse} />
                )}

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

          <form onSubmit={handleSendClick} className="chat-input-area">
            <input
              type="search"
              className="chat-input"
              placeholder={t.placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />

            <button type="submit" className="chat-send-btn" disabled={isLoading || !inputValue.trim()}>
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" /> 
              ) : (
                <Send size={23}/>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatWidget;