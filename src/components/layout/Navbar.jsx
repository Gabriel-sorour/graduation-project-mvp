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

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <div className="logo-icon">
            <ChefHat size={24} />
          </div>
          <span className="logo-text">
            {language === 'ar' ? (
               <>ساج <span>كتشن</span></>
            ) : (
               <>Sage<span>Kitchen</span></>
            )}
          </span>
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

        {/* Auth & Settings */}
        <div className="nav-auth">
          <div className="settings-pill">
            <button 
              className="pill-btn lang-toggle" 
              onClick={toggleLanguage}
              title={language === 'ar' ? "Switch to English" : "تغيير للعربية"}
            >
              <Globe size={15} />
              <span className= {language === 'ar' ? "lang-text" : "lang-text-ar"}>
                  {language === 'ar' ? 'EN' : 'ع'}
              </span>
            </button>

            <div className="pill-divider"></div>

            <button 
              className="pill-btn theme-toggle" 
              onClick={toggleTheme}
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
              {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>

          {user ? (
            <Link to="/profile" className={`nav-avatar ${isActive('/profile')}`} title={user.name}>
              {user.avatar ? (
                 <img src={user.avatar} alt="Avatar" />
              ) : (
                 <User size={20} />
              )}
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