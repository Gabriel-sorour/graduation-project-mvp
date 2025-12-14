import React from 'react'; 
import { LayoutDashboard, ShoppingBag, Heart } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import PantryTab from '../components/dashboard/PantryTab';
import FavoritesTap from '../components/dashboard/FavoritesTap';
import ShoppingListTab from '../components/dashboard/ShoppingListTab';
import '../styles/Dashboard.css';

function Dashboard() {

  // Handle back button inside Dashboard taps
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'pantry';

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  return (
    <>
      <title>Dash</title>

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <button
            className={`sidebar-btn ${activeTab === 'pantry' ? 'active' : ''}`}
            onClick={() => handleTabChange('pantry')} 
          >
            <LayoutDashboard size={20} /> Virtual Pantry
          </button>

          <button
            className={`sidebar-btn ${activeTab === 'shopping' ? 'active' : ''}`}
            onClick={() => handleTabChange('shopping')}
          >
            <ShoppingBag size={20} /> Shopping List
          </button>

          <button
            className={`sidebar-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => handleTabChange('favorites')}
          >
            <Heart size={20} /> Favorites
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