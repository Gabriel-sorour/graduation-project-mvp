import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Mail, LayoutDashboard } from 'lucide-react';
import '../../styles/Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  const t = {
    signOut: language === 'ar' ? 'تسجيل الخروج' : 'Sign Out',
    dashboard: language === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard',
    darkMode: language === 'ar' ? 'الوضع الليلي' : 'Dark Mode'
  };

  return (
    <div className="profile-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="profile-card">
        {/* Header Background */}
        <div className="profile-header">
          <div className="profile-avatar-wrapper">
             {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="profile-avatar-img" 
                />
             ) : (
                <div className="profile-avatar-placeholder">
                  <User size={48} />
                </div>
             )}
          </div>
        </div>

        {/* User Info */}
        <div className="profile-info">
          <h2>{user.name}</h2>
          
          <div className="profile-email-container">
            <Mail size={16} />
            <span className="profile-email" dir="ltr">{user.email}</span>
          </div>
        </div>

        <hr className="divider" />

        {/* Actions */}
        <div className="profile-actions">
          
          {user.role === 'admin' && (
            <button 
              onClick={() => navigate('/admin')} 
              className="btn-dashboard"
            >
              <LayoutDashboard size={20} />
              {t.dashboard}
            </button>
          )}

          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={20} className={language === 'ar' ? 'rotate-180' : ''} />
            {t.signOut}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;