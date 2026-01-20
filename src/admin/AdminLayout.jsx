import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import './Admin.css';
import { useAuth } from '../context/AuthContext';

function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            Loading...
        </div>
    );
  }

  // Protection: Return to Home if not admin
  if (!user || user.role !== 'admin') {
     return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;