import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, Edit, Plus, ChefHat, Clock, Flame, 
  RotateCcw, AlertTriangle, ChevronLeft, ChevronRight 
} from 'lucide-react';

function RecipesPage() {
  const { token } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    times: [],
    calories: []
  });

  const [filters, setFilters] = useState({
    id: '',
    title: '',
    category_id: '',
    time: '',
    calories: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/admin/recipes/options', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setFilterOptions(data))
    .catch(err => console.error("Error loading options:", err));
  }, [token]);

  const fetchRecipes = (page = 1) => {
    setLoading(true);
    
    const queryParams = new URLSearchParams({ page: page });
    Object.keys(filters).forEach(key => {
      if (filters[key]) queryParams.append(key, filters[key]);
    });

    fetch(`http://127.0.0.1:8000/api/admin/recipes?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(response => {
        setRecipes(response.data || []);
        if (response.current_page) {
            setCurrentPage(response.current_page);
            setTotalPages(response.last_page);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching recipes:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchRecipes(currentPage);
    }, 400); 
    return () => clearTimeout(timer);
  }, [currentPage, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); 
  };

  const resetFilters = () => {
    setFilters({ id: '', title: '', category_id: '', time: '', calories: '' });
    setCurrentPage(1);
  };

  const confirmDelete = (id) => {
    setRecipeToDelete(id);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!recipeToDelete) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/recipes/${recipeToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setRecipes(recipes.filter(r => r.id !== recipeToDelete));
        setShowDeleteModal(false);
      } else {
        alert("Failed to delete");
      }
    } catch (err) { console.error(err); }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `http://127.0.0.1:8000/storage/${path}`;
  };

  const formatTime = (timeValue) => {
    if (!timeValue) return '';
    const cleanTime = String(timeValue).replace(/\s*min\s*/gi, '').trim();
    return `${cleanTime} ${language === 'ar' ? 'دقيقة' : 'min'}`;
  };

  const t = {
    title: language === 'ar' ? 'إدارة الوصفات' : 'Recipes Management',
    add: language === 'ar' ? 'إضافة وصفة' : 'Add Recipe',
    reset: language === 'ar' ? 'إعادة ضبط' : 'Reset',
    id: language === 'ar' ? 'الرقم' : 'ID',
    name: language === 'ar' ? 'اسم الوصفة' : 'Recipe Name',
    category: language === 'ar' ? 'القسم' : 'Category',
    time: language === 'ar' ? 'الوقت' : 'Time',
    calories: language === 'ar' ? 'السعرات' : 'Calories',
    actions: language === 'ar' ? 'إجراءات' : 'Actions',
    all_cat: language === 'ar' ? 'كل الأقسام' : 'All Categories',
    all_time: language === 'ar' ? 'كل الأوقات' : 'All Times',
    all_cal: language === 'ar' ? 'كل السعرات' : 'All Calories',
    deleteTitle: language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete',
    deleteMsg: language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?',
    cancel: language === 'ar' ? 'إلغاء' : 'Cancel',
    confirm: language === 'ar' ? 'حذف' : 'Delete',
    pageOf: language === 'ar' ? 'من' : 'of',
    pageTitle: language === 'ar' ? 'صفحة' : 'Page'
  };

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ChefHat /> {t.title}
        </h1>
        <button 
            onClick={() => navigate('/admin/recipes/create')} 
            className="btn-primary" 
            style={{ 
                background: 'var(--primary)', color: 'white', border: 'none', 
                padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', 
                display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold'
            }}
        >
          <Plus size={18} /> {t.add}
        </button>
      </div>

      <div style={{ 
          background: 'var(--white)', padding: '15px', borderRadius: '12px', 
          marginBottom: '20px', border: '1px solid var(--border-color)',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', alignItems: 'end'
      }}>
        
        <div>
            <label style={{fontSize:'12px', fontWeight:'bold', display:'block', marginBottom:'5px'}}>{t.id}</label>
            <input 
                type="number" name="id" placeholder="#" 
                value={filters.id} onChange={handleFilterChange}
                style={inputStyle} 
            />
        </div>

        <div style={{ flex: 2, minWidth: '200px' }}>
            <label style={{fontSize:'12px', fontWeight:'bold', display:'block', marginBottom:'5px'}}>{t.name}</label>
            <input 
                type="text" name="title" placeholder={t.name} 
                value={filters.title} onChange={handleFilterChange}
                style={inputStyle} 
            />
        </div>

        <div>
            <label style={{fontSize:'12px', fontWeight:'bold', display:'block', marginBottom:'5px'}}>{t.category}</label>
            <select name="category_id" value={filters.category_id} onChange={handleFilterChange} style={inputStyle}>
                <option value="">{t.all_cat}</option>
                {filterOptions.categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                        {language === 'ar' ? cat.name_ar : cat.name_en}
                    </option>
                ))}
            </select>
        </div>

        <div>
            <label style={{fontSize:'12px', fontWeight:'bold', display:'block', marginBottom:'5px'}}>{t.time}</label>
            <select name="time" value={filters.time} onChange={handleFilterChange} style={inputStyle}>
                <option value="">{t.all_time}</option>
                {filterOptions.times.map((tVal, idx) => (
                    <option key={idx} value={tVal}>{formatTime(tVal)}</option>
                ))}
            </select>
        </div>

        <div>
            <label style={{fontSize:'12px', fontWeight:'bold', display:'block', marginBottom:'5px'}}>{t.calories}</label>
            <select name="calories" value={filters.calories} onChange={handleFilterChange} style={inputStyle}>
                <option value="">{t.all_cal}</option>
                {filterOptions.calories.map((cVal, idx) => (
                    <option key={idx} value={cVal}>{cVal} kcal</option>
                ))}
            </select>
        </div>

        <button 
            onClick={resetFilters}
            title={t.reset}
            style={{ 
                height: '42px', background: '#f1f5f9', border: '1px solid #cbd5e1', 
                borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
        >
            <RotateCcw size={18} color="#64748b" />
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t.id}</th>
              <th>{t.name}</th>
              <th>{t.category}</th>
              <th>{t.time} / {t.calories}</th>
              <th>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="5" style={{textAlign:'center', padding:'20px'}}>Loading...</td></tr>
            ) : recipes.length > 0 ? (
                recipes.map(recipe => (
                  <tr key={recipe.id}>
                    <td>#{recipe.id}</td>
                    
                    <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                            src={getImageUrl(recipe.image)} alt="" 
                            style={{width:'40px', height:'40px', borderRadius:'6px', objectFit:'cover'}}
                            onError={(e) => e.target.src = 'https://placehold.co/40x40'}
                        />
                        <div>
                            <div style={{fontWeight:'bold'}}>{language==='ar'?(recipe.title_ar||recipe.title_en):recipe.title_en}</div>
                        </div>
                    </td>

                    <td>
                        <span style={{padding:'4px 10px', background:'#e0e7ff', color:'#4338ca', borderRadius:'20px', fontSize:'12px', fontWeight:'500'}}>
                            {recipe.category_info 
                                ? (language === 'ar' ? recipe.category_info.name_ar : recipe.category_info.name_en) 
                                : (recipe.category || 'General')
                            }
                        </span>
                    </td>

                    <td>
                        <div style={{fontSize:'12px', color:'var(--gray)', display:'flex', gap:'8px'}}>
                            <span style={{display:'flex', alignItems:'center', gap:'3px'}}><Clock size={12}/> {formatTime(recipe.time)}</span>
                            <span style={{display:'flex', alignItems:'center', gap:'3px'}}><Flame size={12}/> {recipe.calories} kcal</span>
                        </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => navigate(`/admin/recipes/edit/${recipe.id}`)} className="action-btn edit"><Edit size={18} /></button>
                        <button onClick={() => confirmDelete(recipe.id)} className="action-btn delete"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
            ) : (
                <tr><td colSpan="5" style={{textAlign:'center', padding:'30px'}}>No recipes found matching filters.</td></tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination المطور والممركز */}
        <div style={{ padding: '15px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
            <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)} 
                style={{ ...pageBtnStyle, opacity: currentPage === 1 ? 0.4 : 1 }}
            >
                <ChevronLeft size={16}/>
            </button>
            
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-main)' }}>
                {t.pageTitle} {currentPage} {t.pageOf} {totalPages}
            </span>
            
            <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => p + 1)} 
                style={{ ...pageBtnStyle, opacity: currentPage === totalPages ? 0.4 : 1 }}
            >
                <ChevronRight size={16}/>
            </button>
        </div>
      </div>

      {showDeleteModal && (
        <div style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ background:'white', padding:'30px', borderRadius:'16px', width:'350px', textAlign:'center' }}>
                <div style={{width:'60px', height:'60px', background:'#fee2e2', borderRadius:'50%', margin:'0 auto 15px', display:'flex', alignItems:'center', justifyContent:'center', color:'#ef4444'}}>
                    <AlertTriangle size={32}/>
                </div>
                <h3>{t.deleteTitle}</h3>
                <p style={{color:'#64748b', margin:'10px 0 20px'}}>{t.deleteMsg}</p>
                <div style={{display:'flex', gap:'10px', justifyContent:'center'}}>
                    <button onClick={()=>setShowDeleteModal(false)} style={{padding:'10px 20px', border:'1px solid #ddd', background:'white', borderRadius:'8px', cursor:'pointer'}}>{t.cancel}</button>
                    <button onClick={executeDelete} style={{padding:'10px 20px', border:'none', background:'#ef4444', color:'white', borderRadius:'8px', cursor:'pointer'}}>{t.confirm}</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
    width: '100%', padding: '10px', borderRadius: '8px', 
    border: '1px solid var(--border-color)', background: 'var(--white)', color: 'var(--dark)'
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

export default RecipesPage;