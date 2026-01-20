import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext'; // ✅ استدعاء اللغة
import { useNavigate } from 'react-router-dom'; // ✅ للتنقل
import { Users, Utensils, Carrot, Loader } from 'lucide-react';

function DashboardHome() {
  const { token, user } = useAuth();
  const { language } = useLanguage(); // ✅ استخدام اللغة
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_users: 0,
    total_recipes: 0,
    total_ingredients: 0,
    latest_recipes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/admin/stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      setStats(data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error loading stats:", err);
      setLoading(false);
    });
  }, [token]);

  // ✅ قاموس الترجمة
  const t = {
    overview: language === 'ar' ? 'نظرة عامة' : 'Dashboard Overview',
    welcome: language === 'ar' ? `مرحباً بك، ${user?.name || 'أدمن'}!` : `Welcome back, ${user?.name || 'Admin'}!`,
    users: language === 'ar' ? 'المستخدمين' : 'Total Users',
    recipes: language === 'ar' ? 'الوصفات' : 'Total Recipes',
    ingredients: language === 'ar' ? 'المكونات' : 'Ingredients',
    recent: language === 'ar' ? 'آخر الوصفات المضافة' : 'Recently Added Recipes',
    col_id: language === 'ar' ? '#' : 'ID',
    col_name: language === 'ar' ? 'اسم الوصفة' : 'Recipe Name',
    col_date: language === 'ar' ? 'تاريخ الإضافة' : 'Date Added',
    col_status: language === 'ar' ? 'الحالة' : 'Status',
    no_activity: language === 'ar' ? 'لا يوجد نشاط حديث' : 'No recent activity',
    active: language === 'ar' ? 'نشط' : 'Active'
  };

  if (loading) return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'50vh'}}>
        <Loader className="spin" color="var(--primary)" />
    </div>
  );

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="admin-header">
        <div>
          <h1>{t.overview}</h1>
          <p style={{ color: 'var(--gray)' }}>{t.welcome}</p>
        </div>
      </div>

      {/* Stats Grid - بيستخدم الكلاسات من Admin.css */}
      <div className="stat-grid">
        
        {/* Users Card */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>{t.users}</h3>
            <p>{stats.total_users}</p>
          </div>
        </div>

        {/* Recipes Card - قابل للضغط */}
        <div className="stat-card" onClick={() => navigate('/admin/recipes')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
            <Utensils size={24} />
          </div>
          <div className="stat-info">
            <h3>{t.recipes}</h3>
            <p>{stats.total_recipes}</p>
          </div>
        </div>

        {/* Ingredients Card - قابل للضغط */}
        <div className="stat-card" onClick={() => navigate('/admin/ingredients')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Carrot size={24} />
          </div>
          <div className="stat-info">
            <h3>{t.ingredients}</h3>
            <p>{stats.total_ingredients}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="admin-table-container" style={{ marginTop: '2rem' }}>
        <h3 style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--dark)' }}>
          {t.recent}
        </h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t.col_id}</th>
              <th>{t.col_name}</th>
              <th>{t.col_date}</th>
              <th>{t.col_status}</th>
            </tr>
          </thead>
          <tbody>
            {stats.latest_recipes && stats.latest_recipes.length > 0 ? (
              stats.latest_recipes.map(recipe => (
                <tr key={recipe.id}>
                  <td>#{recipe.id}</td>
                  <td style={{ fontWeight: '500' }}>
                    {language === 'ar' ? (recipe.title_ar || recipe.title_en) : recipe.title_en}
                  </td>
                  <td>
                    {new Date(recipe.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                  </td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      background: 'rgba(22, 163, 74, 0.1)', 
                      color: '#16a34a', 
                      borderRadius: '6px', 
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {t.active}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--gray)' }}>{t.no_activity}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardHome;