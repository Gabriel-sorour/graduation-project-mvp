import React, { useEffect, useRef } from 'react';
import { LayoutDashboard, ShoppingBag, Heart, Refrigerator } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import PantryTab from '../components/dashboard/PantryTab';
import FavoritesTap from '../components/dashboard/FavoritesTap';
import ShoppingListTab from '../components/dashboard/ShoppingListTab';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Dashboard.css';

function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'pantry';
  const sidebarRef = useRef(null);

  const { language } = useLanguage();

  // Auto-Scroll Logic
  useEffect(() => {
    const activeBtn = document.querySelector('.sidebar-btn.active');
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTab]);

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const t = {
    favorites: language === 'ar' ? 'المفضلة' : 'Favorites',
    pantry: language === 'ar' ? 'مخزني الافتراضي' : 'Virtual Pantry',
    shopping: language === 'ar' ? 'قائمة التسوق' : 'Shopping List',
    myFavoritesTitle: language === 'ar' ? 'وصفاتي المفضلة' : 'My Favorites'
  };

  return (
    <>
      <title>Dashboard</title>
      <div className={`dashboard-container ${language === 'ar' ? 'dashboard-rtl' : ''}`}>
        
        {/* Sidebar */}
        <aside className="dashboard-sidebar" ref={sidebarRef}>
          <button
            className={`sidebar-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => handleTabChange('favorites')}
          >
            <Heart size={20} /> {t.favorites}
          </button>

          <button
            className={`sidebar-btn ${activeTab === 'pantry' ? 'active' : ''}`}
            onClick={() => handleTabChange('pantry')}
          >
            <Refrigerator size={20} /> {t.pantry}
          </button>

          <button
            className={`sidebar-btn ${activeTab === 'shopping' ? 'active' : ''}`}
            onClick={() => handleTabChange('shopping')}
          >
            <ShoppingBag size={20} /> {t.shopping}
          </button>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">

          {activeTab === 'pantry' && <PantryTab />}

          {activeTab === 'shopping' && (
            <div>
              <ShoppingListTab />
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <div className="section-header">
                <h2>{t.myFavoritesTitle}</h2>
              </div>
              <FavoritesTap />
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default Dashboard;