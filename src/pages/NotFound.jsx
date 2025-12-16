import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center'
    }}>
      <AlertTriangle size={64} color="#ef4444" style={{ marginBottom: '1rem' }} />
      <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: '#1f2937' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#4b5563' }}>Page Not Found</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;