import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Utensils, Users, Carrot, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function AdminSidebar() {
  const { language } = useLanguage();

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <Utensils size={28} />
        <span>AdminPanel</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/admin" 
          end 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          <span className="nav-text">{language === 'ar' ? 'الرئيسية' : 'Dashboard'}</span>
        </NavLink>

        <NavLink 
          to="/admin/recipes" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Utensils size={20} />
          <span className="nav-text">{language === 'ar' ? 'الوصفات' : 'Recipes'}</span>
        </NavLink>

        <NavLink 
          to="/admin/ingredients" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Carrot size={20} />
          <span className="nav-text">{language === 'ar' ? 'المكونات' : 'Ingredients'}</span>
        </NavLink>

        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Users size={20} />
          <span className="nav-text">{language === 'ar' ? 'المستخدمين' : 'Users'}</span>
        </NavLink>

        {/* ✅ شلت زرار الموقع من هنا */}
        
        {/* زر البروفايل نزل تحت عشان يفصل */}
        <NavLink 
          to="/admin/profile" 
          className={({ isActive }) => `nav-item mt-auto ${isActive ? 'active' : ''}`}
        >
          <User size={20} />
          <span className="nav-text">{language === 'ar' ? 'حسابي' : 'Profile'}</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default AdminSidebar;