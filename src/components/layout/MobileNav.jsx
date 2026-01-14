import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/MobileNav.css';

function MobileNav() {
  const location = useLocation();
  const { language } = useLanguage();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  const t = {
    home: language === 'ar' ? 'الرئيسية' : 'Home',
    explore: language === 'ar' ? 'استكشف' : 'Explore',
    dash: language === 'ar' ? 'لوحتي' : 'Dash'
  };

  return (
    <div className="mobile-nav-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Link to="/" className={`mobile-link ${isActive('/')}`}>
        <Home size={24} />
        <span>{t.home}</span>
      </Link>

      <Link to="/explore" className={`mobile-link ${isActive('/explore')}`}>
        <Compass size={24} />
        <span>{t.explore}</span>
      </Link>

      <Link to="/dashboard" className={`mobile-link ${isActive('/dashboard')}`}>
        <LayoutDashboard size={24} />
        <span>{t.dash}</span>
      </Link>
    </div>
  );
}

export default MobileNav;