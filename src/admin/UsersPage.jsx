import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext'; 
import { Trash2, User, Shield, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

function UsersPage() {
  const { token, user: currentUser } = useAuth();
  const { language } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleDelete = async (id) => {
    const confirmMsg = language === 'ar' ? "هل أنت متأكد؟ سيتم حذف المستخدم نهائياً." : "Are you sure? This user will be permanently deleted.";
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        alert(language === 'ar' ? "تم حذف المستخدم بنجاح" : "User deleted successfully");
        fetchUsers(currentPage);
      } else {
        alert(language === 'ar' ? "فشل حذف المستخدم" : "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const t = {
    title: language === 'ar' ? 'إدارة المستخدمين' : 'Users Management',
    sub: language === 'ar' ? 'عرض وإدارة المستخدمين المسجلين' : 'View and manage registered users',
    id: language === 'ar' ? 'الرقم' : 'ID',
    info: language === 'ar' ? 'بيانات المستخدم' : 'User Info',
    role: language === 'ar' ? 'الدور' : 'Role',
    joined: language === 'ar' ? 'تاريخ الانضمام' : 'Joined Date',
    actions: language === 'ar' ? 'إجراءات' : 'Actions',
    you: language === 'ar' ? '(أنت)' : '(You)',
    page: language === 'ar' ? 'صفحة' : 'Page',
    of: language === 'ar' ? 'من' : 'of',
  };

  const pageBtnStyle = {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    border: '1px solid var(--border-color, #cbd5e1)',
    background: 'var(--card-bg, #ffffff)',
    color: 'var(--text-main, #0f172a)',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="admin-header">
        <div>
          <h1>{t.title}</h1>
          <p>{t.sub}</p>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t.id}</th>
              <th>{t.info}</th>
              <th>{t.role}</th>
              <th>{t.joined}</th>
              <th>{t.actions}</th>
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
                <td>{new Date(user.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</td>
                <td>
                  {currentUser && currentUser.id === user.id ? (
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{t.you}</span>
                  ) : (
                    <button 
                        onClick={() => handleDelete(user.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination المطور والممركز */}
        <div style={{ padding: '15px', borderTop: '1px solid var(--border-color, #eee)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
            <button 
              disabled={!prevPageUrl} 
              onClick={() => setCurrentPage(p => p - 1)} 
              style={{ ...pageBtnStyle, opacity: !prevPageUrl ? 0.4 : 1 }}
            >
              <ChevronLeft size={16} />
            </button>
            
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-main)' }}>
              {t.page} {currentPage} {t.of} {totalPages}
            </span>
            
            <button 
              disabled={!nextPageUrl} 
              onClick={() => setCurrentPage(p => p + 1)} 
              style={{ ...pageBtnStyle, opacity: !nextPageUrl ? 0.4 : 1 }}
            >
              <ChevronRight size={16} />
            </button>
        </div>
      </div>
    </div>
  );
}

export default UsersPage;