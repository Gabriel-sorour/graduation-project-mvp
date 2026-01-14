import React, { createContext, useContext, useState } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import './CustomAlert.css';

const AlertContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const { language } = useLanguage();

  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'alert', // 'alert' or 'confirm'
    title: '',
    message: '',
    onConfirm: null,
  });

  const showAlert = (title, message) => {
    setAlertState({
      isOpen: true,
      type: 'alert',
      title,
      message,
      onConfirm: null,
    });
  };

  const showConfirm = (title, message, onConfirmCallback) => {
    setAlertState({
      isOpen: true,
      type: 'confirm',
      title,
      message,
      onConfirm: onConfirmCallback,
    });
  };

  const closeAlert = () => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = () => {
    if (alertState.onConfirm) {
      alertState.onConfirm();
    }
    closeAlert();
  };

  const t = {
    cancel: language === 'ar' ? 'إلغاء' : 'Cancel',
    confirm: language === 'ar' ? 'نعم، تأكيد' : 'Yes, Confirm',
    ok: language === 'ar' ? 'حسناً' : 'Okay'
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      
      {alertState.isOpen && (
        <div className="alert-overlay" onClick={closeAlert}>
          <div 
            className="alert-box" 
            onClick={(e) => e.stopPropagation()}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            
            <div className="alert-icon-wrapper">
              {alertState.type === 'confirm' ? (
                <AlertTriangle size={28} color="#f59e0b" />
              ) : (
                <Info size={28} color="#f97316" />
              )}
            </div>

            <h3 className="alert-title">{alertState.title}</h3>
            <p className="alert-message">{alertState.message}</p>

            <div className="alert-actions">
              {alertState.type === 'confirm' ? (
                <>
                  <button className="alert-btn cancel" onClick={closeAlert}>
                    {t.cancel}
                  </button>
                  <button className="alert-btn confirm" onClick={handleConfirm}>
                    {t.confirm}
                  </button>
                </>
              ) : (
                <button className="alert-btn ok" onClick={closeAlert}>
                  {t.ok}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};