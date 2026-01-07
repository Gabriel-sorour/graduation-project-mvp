import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Navbar.css';

function Navbar() {
  const location = useLocation();
  const { user } = useAuth();

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
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/explore" className={`nav-link ${isActive('/explore')}`}>Explore</Link>
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>Dashboard</Link>
        </div>

        {/* Auth / Profile */}
        <div className="nav-auth">
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
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;