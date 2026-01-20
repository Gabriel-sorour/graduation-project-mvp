import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Moon, Sun, Globe, Shield, Home } from 'lucide-react'; // ✅ ضفت Home

const AdminProfilePage = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const t = {
    title: language === 'ar' ? 'الملف الشخصي' : 'Admin Profile',
    role: language === 'ar' ? 'مدير النظام' : 'Administrator',
    settings: language === 'ar' ? 'الإعدادات' : 'Settings',
    darkMode: language === 'ar' ? 'الوضع الليلي' : 'Dark Mode',
    lang: language === 'ar' ? 'اللغة' : 'Language',
    backToSite: language === 'ar' ? 'الرجوع للموقع' : 'Back to Website', // ✅
    logout: language === 'ar' ? 'تسجيل الخروج' : 'Logout',
  };

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '20px' }}>
      
      <div className="admin-header" style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>{t.title}</h1>
      </div>

      {/* User Info Card */}
      <div className="admin-recipe-card" style={{ textAlign: 'center', padding: '40px 20px', marginBottom: '30px' }}>
        <div style={{ 
          width: '80px', height: '80px', background: 'var(--primary)', color: 'white', 
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 15px auto', fontSize: '2rem', fontWeight: 'bold'
        }}>
          {user?.name?.charAt(0).toUpperCase() || 'A'}
        </div>
        <h2 style={{ margin: '10px 0', color: 'var(--dark)' }}>{user?.name || 'Admin User'}</h2>
        <p style={{ color: 'var(--gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Shield size={16} /> {t.role}
        </p>
        <p style={{ color: 'var(--gray)', marginTop: '5px' }}>{user?.email}</p>
      </div>

      {/* Settings Section */}
      <h3 style={{ margin: '0 0 15px', color: 'var(--dark)', fontSize: '1.1rem' }}>{t.settings}</h3>
      
      <div className="admin-recipe-card" style={{ padding: '0', overflow: 'hidden' }}>
        
        {/* Dark Mode Toggle */}
        <div 
          onClick={toggleTheme}
          style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            padding: '20px', borderBottom: '1px solid var(--border-color)', cursor: 'pointer',
            transition: 'background 0.2s'
          }} 
          onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-body)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--dark)' }}>
            {isDarkMode ? <Moon size={22} color="#a855f7" /> : <Sun size={22} color="#eab308" />}
            <span style={{ fontWeight: '500' }}>{t.darkMode}</span>
          </div>
          
          <div style={{ 
            width: '46px', height: '24px', background: isDarkMode ? 'var(--primary)' : '#cbd5e1',
            borderRadius: '20px', position: 'relative', transition: '0.3s'
          }}>
            <div style={{
              width: '18px', height: '18px', background: 'white', borderRadius: '50%',
              position: 'absolute', top: '3px', 
              left: isDarkMode ? (language === 'ar' ? '3px' : '25px') : (language === 'ar' ? '25px' : '3px'), 
              right: isDarkMode ? (language === 'ar' ? '25px' : 'auto') : (language === 'ar' ? '3px' : 'auto'),
              transition: '0.3s'
            }} />
          </div>
        </div>

        {/* Language Toggle */}
        <div 
          onClick={toggleLanguage}
          style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            padding: '20px', cursor: 'pointer', transition: 'background 0.2s' 
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-body)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--dark)' }}>
            <Globe size={22} color="#3b82f6" />
            <span style={{ fontWeight: '500' }}>{t.lang}</span>
          </div>
          <span style={{ 
            background: 'var(--bg-body)', padding: '6px 12px', borderRadius: '8px', 
            fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--dark)',
            border: '1px solid var(--border-color)'
          }}>
            {language === 'en' ? 'English' : 'العربية'}
          </span>
        </div>

      </div>

      {/* Buttons Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '25px' }}>
        
        {/* ✅ Back to Site Button */}
        <button 
          onClick={() => navigate('/')}
          style={{
            width: '100%', padding: '16px', borderRadius: '12px',
            background: 'var(--white)', color: 'var(--primary)', 
            border: '2px solid var(--primary)',
            fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: '10px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.color = 'var(--primary)'; }}
        >
          <Home size={20} />
          {t.backToSite}
        </button>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          style={{
            width: '100%', padding: '16px', borderRadius: '12px',
            background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca',
            fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: '10px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#fecaca'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
        >
          <LogOut size={20} />
          {t.logout}
        </button>
      </div>

    </div>
  );
};

export default AdminProfilePage;