import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { AlertProvider } from './context/AlertContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

import App from './App.jsx'
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <ChatProvider>
          <AlertProvider>
            <ThemeProvider>
              <Router>
                <App />
              </Router>
            </ThemeProvider>
          </AlertProvider>
        </ChatProvider>
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>,
)
