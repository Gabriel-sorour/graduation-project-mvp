import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext'; // 1. استدعاء هوك اللغة

const NotFound = () => {
  const { language } = useLanguage();

  const t = {
    title: language === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found',
    description: language === 'ar'
      ? 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
      : "The page you are looking for doesn't exist or has been moved.",
    homeBtn: language === 'ar' ? 'العودة للرئيسية' : 'Go Back Home'
  };

  return (
    <div className="container" dir={language === 'ar' ? 'rtl' : 'ltr'} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center'
    }}>
      <AlertTriangle size={64} color="#ef4444" style={{ marginBottom: '1rem' }} />

      <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: '#1f2937' }}>404</h1>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#4b5563' }}>
        {t.title}
      </h2>

      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        {t.description}
      </p>

      <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
        {t.homeBtn}
      </Link>
    </div>
  );
};

export default NotFound;