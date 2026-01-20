import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, User, Shield, Mail } from 'lucide-react';

function UsersPage() {
  const { token, user: currentUser } = useAuth(); // جبنا اليوزر الحالي عشان منمسحش نفسنا بالغلط
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  const fetchUsers = (page = 1) => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/admin/users?page=${page}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(response => {
        setUsers(response.data);
        setCurrentPage(response.current_page);
        setTotalPages(response.last_page);
        setNextPageUrl(response.next_page_url);
        setPrevPageUrl(response.prev_page_url);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This user will be permanently deleted.")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        alert("User deleted successfully");
        fetchUsers(currentPage);
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Users Management</h1>
          <p>View and manage registered users</p>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Info</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>#{user.id}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <User size={14} /> {user.name}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Mail size={12} /> {user.email}
                    </span>
                  </div>
                </td>
                <td>
                  <span style={{ 
                    padding: '4px 10px', 
                    background: user.role === 'admin' ? '#e0f2fe' : '#f1f5f9', 
                    color: user.role === 'admin' ? '#0284c7' : '#475569',
                    borderRadius: '20px', 
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {user.role === 'admin' && <Shield size={12} />}
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  {/* منع حذف النفس */}
                  {currentUser && currentUser.id === user.id ? (
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>(You)</span>
                  ) : (
                    <button 
                        onClick={() => handleDelete(user.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                        title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee' }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>Page {currentPage} of {totalPages}</span>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button disabled={!prevPageUrl} onClick={() => setCurrentPage(p => p - 1)} style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #ddd', borderRadius: '6px', cursor: prevPageUrl ? 'pointer' : 'not-allowed' }}>Prev</button>
                <button disabled={!nextPageUrl} onClick={() => setCurrentPage(p => p + 1)} style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #ddd', borderRadius: '6px', cursor: nextPageUrl ? 'pointer' : 'not-allowed' }}>Next</button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default UsersPage;