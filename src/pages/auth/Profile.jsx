import React from 'react';
import { useAuth } from '../../context/AuthContext';
// import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Mail, Moon, Sun } from 'lucide-react';
import '../../styles/Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  // const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="profile-container">
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
            <span className="profile-email">{user.email}</span>
          </div>
        </div>

        <hr className="divider" />
        
{/*        
        <div className="profile-settings">
          <div className="setting-item">
            <div className="setting-label">
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              <span>Dark Mode</span>
            </div>
            
            <label className="theme-switch">
              <input 
                type="checkbox" 
                checked={isDarkMode} 
                onChange={toggleTheme} 
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div> */}

        {/* Actions */}
        <div className="profile-actions">
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;