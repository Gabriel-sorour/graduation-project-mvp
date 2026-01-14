import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, User, Sun, Moon, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/Navbar.css';

function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const { language, toggleLanguage } = useLanguage();

  // --- Dark Mode Logic ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  // -----------------------

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <div className="logo-icon">
            <ChefHat size={24} />
          </div>
          Sage<span>Kitchen</span>
        </Link>

        {/* Links */}
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <Link to="/explore" className={`nav-link ${isActive('/explore')}`}>
            {language === 'ar' ? 'استكشف' : 'Explore'}
          </Link>
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
            {language === 'ar' ? 'لوحتي' : 'Dashboard'}
          </Link>
        </div>

        {/* Auth / Profile / Toggles */}
        <div className="nav-auth">
          
          {/* Language Toggle Button */}
          <button 
            className="theme-toggle-btn" 
            onClick={toggleLanguage}
            title={language === 'ar' ? "Switch to English" : "تغيير للعربية"}
          >
            <Globe size={20} />
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', marginLeft: '4px' }}>
                {language === 'ar' ? 'EN' : 'عربي'}
            </span>
          </button>

          {/* Dark Mode Button */}
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <Link to="/profile" className={`nav-avatar ${isActive('/profile')}`} title={user.name}>
              <User size={20} />
            </Link>
          ) : (
            <Link to="/login" className="btn-primary">
              {language === 'ar' ? 'دخول' : 'Sign In'}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;