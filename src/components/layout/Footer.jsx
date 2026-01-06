import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        {/* Brand Section */}
        <div className="footer-brand">
          <h3><ChefHat size={28} /> Chef Sage</h3>
          <p>
            Your smart cooking companion. Reducing food waste, one delicious meal at a time.
          </p>
          <div className="social-icons">
            <a href="#" className="social-icon"><Facebook size={20} /></a>
            <a href="#" className="social-icon"><Twitter size={20} /></a>
            <a href="#" className="social-icon"><Instagram size={20} /></a>
          </div>
        </div>

        {/* Contact Section */}
        <div className="footer-links">
          <h4>Contact Us</h4>
          <ul>
            <li>
              {/* <a href="mailto:support@chefsage.com"> */}
              <a href="#">
                <Mail size={16} /> support@chefsage.com
              </a>
            </li>
            <li>
              <a href="#">
                <Phone size={16} /> +20 123 456 7890
              </a>
            </li>
            <li>
              <a href="#">
                <MapPin size={16} /> Cairo, Egypt
              </a>
            </li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div className="footer-links">
            <h4>Learn More</h4>
             <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
             </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Chef Sage. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;