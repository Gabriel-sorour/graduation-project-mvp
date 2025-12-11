import React, { useState } from 'react';
import { LayoutDashboard, ShoppingBag, Heart } from 'lucide-react';
import '../styles/Dashboard.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('pantry'); // Default Tab

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <button
          className={`sidebar-btn ${activeTab === 'pantry' ? 'active' : ''}`}
          onClick={() => setActiveTab('pantry')}
        >
          <LayoutDashboard size={20} /> Virtual Pantry
        </button>

        <button
          className={`sidebar-btn ${activeTab === 'shopping' ? 'active' : ''}`}
          onClick={() => setActiveTab('shopping')}
        >
          <ShoppingBag size={20} /> Shopping List
        </button>

        <button
          className={`sidebar-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <Heart size={20} /> Favorites
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {activeTab === 'pantry' && (
          <div>
            <div className="section-header">
              <h2>My Pantry</h2>
              <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                + Add Item
              </button>
            </div>
            <p className="text-gray-500">Pantry items will appear here...</p>
          </div>
        )}

        {activeTab === 'shopping' && (
          <div>
            <div className="section-header">
              <h2>Shopping List</h2>
            </div>
            <p className="text-gray-500">Shopping list items will appear here...</p>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            <div className="section-header">
              <h2>My Favorites</h2>
            </div>
            <p className="text-gray-500">Favorite recipes will appear here...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;