import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Edit, Plus } from 'lucide-react';
import IngredientModal from './IngredientModal'; // ✅ استدعاء المودال

function IngredientsPage() {
  const { token } = useAuth();
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  const fetchIngredients = (page = 1) => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/admin/ingredients?page=${page}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(response => {
        setIngredients(response.data);
        setCurrentPage(response.current_page);
        setTotalPages(response.last_page);
        setNextPageUrl(response.next_page_url);
        setPrevPageUrl(response.prev_page_url);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching ingredients:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchIngredients(currentPage);
  }, [currentPage]);

  // Handle Open Create Modal
  const handleAddClick = () => {
    setEditingIngredient(null); // مسح البيانات القديمة عشان دي إضافة جديدة
    setIsModalOpen(true);
  };

  // Handle Open Edit Modal
  const handleEditClick = (ingredient) => {
    setEditingIngredient(ingredient); // تحميل بيانات العنصر للتعديل
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ingredient?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/ingredients/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchIngredients(currentPage);
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Ingredients Management</h1>
          <p>Manage pantry items and recipe ingredients</p>
        </div>
        {/* ✅ تشغيل زر الإضافة */}
        <button onClick={handleAddClick} className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#0f172a', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          <Plus size={18} /> Add New Ingredient
        </button>
      </div>

      <div className="admin-table-container">
        {loading ? <div style={{padding: '20px', textAlign: 'center'}}>Loading...</div> : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name (EN)</th>
              <th>Name (AR)</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.length > 0 ? ingredients.map(ing => (
              <tr key={ing.id}>
                <td>#{ing.id}</td>
                <td style={{ fontWeight: '500' }}>{ing.name_en}</td>
                <td style={{ fontFamily: 'sans-serif' }}>{ing.name_ar}</td>
                <td>
                  <span style={{ padding: '4px 10px', background: '#f1f5f9', borderRadius: '20px', fontSize: '12px', color: '#475569' }}>
                    {ing.category || 'N/A'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {/* ✅ تشغيل زر التعديل */}
                    <button 
                        onClick={() => handleEditClick(ing)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}
                        title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                        onClick={() => handleDelete(ing.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                        title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No ingredients found. Add one!</td></tr>
            )}
          </tbody>
        </table>
        )}

        {/* Pagination Controls */}
        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee' }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>Page {currentPage} of {totalPages}</span>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button disabled={!prevPageUrl} onClick={() => setCurrentPage(p => p - 1)} style={{ padding: '6px 12px', cursor: prevPageUrl ? 'pointer' : 'not-allowed', background: '#f1f5f9', border: '1px solid #ddd', borderRadius: '6px' }}>Prev</button>
                <button disabled={!nextPageUrl} onClick={() => setCurrentPage(p => p + 1)} style={{ padding: '6px 12px', cursor: nextPageUrl ? 'pointer' : 'not-allowed', background: '#f1f5f9', border: '1px solid #ddd', borderRadius: '6px' }}>Next</button>
            </div>
        </div>
      </div>

      {/* ✅ المودال هنا */}
      <IngredientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        ingredientToEdit={editingIngredient}
        onRefresh={() => fetchIngredients(currentPage)}
      />
    </div>
  );
}

export default IngredientsPage;