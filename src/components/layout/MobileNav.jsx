import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, LayoutDashboard } from 'lucide-react';
import '../../styles/MobileNav.css';

function MobileNav() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="mobile-nav-container">
      <Link to="/" className={`mobile-link ${isActive('/')}`}>
        <Home size={24} />
        <span>Home</span>
      </Link>

      <Link to="/explore" className={`mobile-link ${isActive('/explore')}`}>
        <Compass size={24} />
        <span>Explore</span>
      </Link>

      <Link to="/dashboard" className={`mobile-link ${isActive('/dashboard')}`}>
        <LayoutDashboard size={24} />
        <span>Dash</span>
      </Link>
    </div>
  );
}

export default MobileNav;