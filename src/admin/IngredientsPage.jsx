import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext'; 
import { Trash2, Edit, Plus, Search, RotateCcw, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import IngredientModal from './IngredientModal';

function IngredientsPage() {
  const { token } = useAuth();
  const { language } = useLanguage();
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterId, setFilterId] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // مصفوفة الأقسام مترجمة
  const categoriesList = [
    { en: "Vegetables", ar: "خضروات" },
    { en: "Fruits", ar: "فواكه" },
    { en: "Meat & Poultry", ar: "لحوم ودواجن" },
    { en: "Dairy", ar: "ألبان" },
    { en: "Spices", ar: "توابل" },
    { en: "Grains", ar: "حبوب" },
    { en: "Oils", ar: "زيوت" },
    { en: "Others", ar: "أخرى" }
  ];

  const fetchIngredients = useCallback((page = 1) => {
    setLoading(true);
    const url = new URL(`http://127.0.0.1:8000/api/admin/ingredients`);
    url.searchParams.append('page', page);
    if (search) url.searchParams.append('search', search);
    if (filterCategory) url.searchParams.append('category', filterCategory);
    if (filterId) url.searchParams.append('id', filterId);

    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(response => {
        setIngredients(response.data || []);
        setCurrentPage(response.current_page || 1);
        setTotalPages(response.last_page || 1);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching ingredients:", err);
        setLoading(false);
      });
  }, [token, search, filterCategory, filterId]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchIngredients(currentPage);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, filterCategory, filterId, currentPage, fetchIngredients]);

  const handleDelete = async (id) => {
    if (!window.confirm(language === 'ar' ? "هل أنت متأكد من الحذف؟" : "Are you sure?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/ingredients/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchIngredients(currentPage);
    } catch (err) { console.error(err); }
  };

  const t = {
    title: language === 'ar' ? 'إدارة المكونات' : 'Ingredients Management',
    sub: language === 'ar' ? 'إدارة محتويات المخزن ومكونات الوصفات' : 'Manage pantry items and recipe ingredients',
    addBtn: language === 'ar' ? 'إضافة مكون جديد' : 'Add New Ingredient',
    search: language === 'ar' ? 'ابحث بالاسم...' : 'Search by name...',
    category: language === 'ar' ? 'القسم' : 'Category',
    all: language === 'ar' ? 'الكل' : 'All',
    id: language === 'ar' ? 'الرقم' : 'ID'
  };

  const pageBtnStyle = {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    border: '1px solid #cbd5e1',
    background: 'white',
    cursor: 'pointer',
    color: '#334155',
    transition: 'all 0.2s'
  };

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="admin-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>{t.title}</h1>
          <p>{t.sub}</p>
        </div>
        <button 
          onClick={() => { setEditingIngredient(null); setIsModalOpen(true); }} 
          className="btn-primary" 
          style={{ 
            display: 'flex', gap: '8px', alignItems: 'center', 
            background: 'var(--primary)', color: 'white', padding: '10px 20px', 
            borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' 
          }}
        >
          <Plus size={18} /> {t.addBtn}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', top: '12px', [language === 'ar' ? 'right' : 'left']: '12px', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder={t.search}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            style={{ width: '100%', padding: language === 'ar' ? '10px 40px 10px 10px' : '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
        </div>
        
        <input 
          type="number" 
          placeholder={t.id}
          value={filterId}
          onChange={(e) => { setFilterId(e.target.value); setCurrentPage(1); }}
          style={{ width: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
        />

        <select 
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', minWidth: '150px' }}
        >
          <option value="">{t.category}: {t.all}</option>
          {categoriesList.map(c => (
            <option key={c.en} value={c.en}>
              {language === 'ar' ? c.ar : c.en}
            </option>
          ))}
        </select>

        <button onClick={() => { setSearch(''); setFilterCategory(''); setFilterId(''); setCurrentPage(1); }} 
          style={{ padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="admin-table-container">
        {loading ? <div style={{padding: '50px', textAlign: 'center'}}><Loader className="spin" /></div> : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{language === 'ar' ? 'الاسم (EN)' : 'Name (EN)'}</th>
              <th>{language === 'ar' ? 'الاسم (AR)' : 'Name (AR)'}</th>
              <th>{t.category}</th>
              <th>{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.length > 0 ? ingredients.map(ing => (
              <tr key={ing.id}>
                <td>#{ing.id}</td>
                <td style={{ fontWeight: '500' }}>{ing.name_en}</td>
                <td>{ing.name_ar}</td>
                <td>
                  <span style={{ padding: '4px 10px', background: '#f1f5f9', color: '#1e293b', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                    {language === 'ar' ? (categoriesList.find(c => c.en === ing.category)?.ar || ing.category) : ing.category}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => { setEditingIngredient(ing); setIsModalOpen(true); }} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}><Edit size={18} /></button>
                    <button onClick={() => handleDelete(ing.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            )) : (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '40px'}}>{language === 'ar' ? 'لا يوجد نتائج' : 'No results found'}</td></tr>
            )}
          </tbody>
        </table>
        )}

        <div style={{ padding: '15px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
            <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)} 
                style={{ ...pageBtnStyle, opacity: currentPage === 1 ? 0.5 : 1 }}
            >
                <ChevronLeft size={16}/>
            </button>
            
            <span style={{ fontSize: '14px', fontWeight: '500' }}>
                {language === 'ar' ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
            </span>
            
            <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => p + 1)} 
                style={{ ...pageBtnStyle, opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
                <ChevronRight size={16}/>
            </button>
        </div>
      </div>

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