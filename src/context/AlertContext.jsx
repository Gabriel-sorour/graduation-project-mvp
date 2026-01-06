import React, { createContext, useContext, useState } from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import './CustomAlert.css';

const AlertContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
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

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      
      {alertState.isOpen && (
        <div className="alert-overlay" onClick={closeAlert}>
          <div className="alert-box" onClick={(e) => e.stopPropagation()}>
            
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
                    Cancel
                  </button>
                  <button className="alert-btn confirm" onClick={handleConfirm}>
                    Yes, Confirm
                  </button>
                </>
              ) : (
                <button className="alert-btn ok" onClick={closeAlert}>
                  Okay
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};