import React, { useEffect, useRef } from 'react'; // 1. Import useEffect & useRef
import { LayoutDashboard, ShoppingBag, Heart, Refrigerator } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import PantryTab from '../components/dashboard/PantryTab';
import FavoritesTap from '../components/dashboard/FavoritesTap';
import ShoppingListTab from '../components/dashboard/ShoppingListTab';
import '../styles/Dashboard.css';

function Dashboard() {

  // Handle back button inside Dashboard taps
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'favorites';

  const sidebarRef = useRef(null);

  // Auto-Scroll Logic (The Snap Effect)
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

  return (
    <>
      <title>Dash</title>

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar" ref={sidebarRef}>
          <button
            className={`sidebar-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => handleTabChange('favorites')}
          >
            <Heart size={20} /> Favorites
          </button>

          <button
            className={`sidebar-btn ${activeTab === 'pantry' ? 'active' : ''}`}
            onClick={() => handleTabChange('pantry')}
          >
            <Refrigerator size={20} /> Virtual Pantry
          </button>

          <button
            className={`sidebar-btn ${activeTab === 'shopping' ? 'active' : ''}`}
            onClick={() => handleTabChange('shopping')}
          >
            <ShoppingBag size={20} /> Shopping List
          </button>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">

          {activeTab === 'pantry' && <PantryTab />}

          {activeTab === 'shopping' && (
            <div>
              <div className="section-header">
                <h2>Shopping List</h2>
              </div>
              <ShoppingListTab />
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <div className="section-header">
                <h2>My Favorites</h2>
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