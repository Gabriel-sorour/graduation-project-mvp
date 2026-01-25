import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext'; // 1. استدعاء الكونتكست
import './Footer.css';

function Footer() {
  const { language } = useLanguage();

  const t = {
    description: language === 'ar'
      ? 'رفيقك الذكي في الطهي. نقلل هدر الطعام، وجبة لذيذة تلو الأخرى.'
      : 'Your smart cooking companion. Reducing food waste, one delicious meal at a time.',
    contactUs: language === 'ar' ? 'تواصل معنا' : 'Contact Us',
    cairo: language === 'ar' ? 'القاهرة، مصر' : 'Cairo, Egypt',
    learnMore: language === 'ar' ? 'اعرف المزيد' : 'Learn More',
    aboutUs: language === 'ar' ? 'من نحن' : 'About Us',
    privacy: language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy',
    copyright: language === 'ar'
      ? `© ${new Date().getFullYear()} Chef Sage. جميع الحقوق محفوظة.`
      : `© ${new Date().getFullYear()} Chef Sage. All rights reserved.`
  };

  return (
    <footer className="site-footer" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-brand">
          <h3><ChefHat size={28} /> Chef Sage</h3>
          <p>
            {t.description}
          </p>
          <div className="social-icons">
            <a href="#" className="social-icon"><Facebook size={20} /></a>
            <a href="#" className="social-icon"><Twitter size={20} /></a>
            <a href="#" className="social-icon"><Instagram size={20} /></a>
          </div>
        </div>

        {/* Contact Section */}
        <div className="footer-links">
          <h4>{t.contactUs}</h4>
          <ul>
            <li>
              <a href="mailto:support@chefsage.com">
                <Mail size={16} /> support@chefsage.com
              </a>
            </li>

            <li>
              <a
                href="#"
                dir="ltr"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: language === 'ar' ? 'flex-end' : 'flex-start',
                  width: '100%'
                }}
              >
                <Phone size={16} /> +20 123 456 7890
              </a>
            </li>

            <li>
              <a href="#">
                <MapPin size={16} /> {t.cairo}
              </a>
            </li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div className="footer-links">
          <h4>{t.learnMore}</h4>
          <ul>
            <li>
              <Link to="/about" className="hover:text-green-500 transition-colors">
                {language === 'ar' ? 'من نحن' : 'About Us'}
              </Link>
            </li>
            <li><Link to="">{t.privacy}</Link></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>{t.copyright}</p>
      </div>
    </footer>
  );
}

export default Footer;