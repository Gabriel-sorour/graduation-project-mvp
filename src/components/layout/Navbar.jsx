import { Link, useLocation } from 'react-router-dom'; // useLocation to check active page
import { ChefHat, User } from 'lucide-react';


function Navbar() {
  const location = useLocation();
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
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;