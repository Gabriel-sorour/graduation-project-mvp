import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function IngredientModal({ isOpen, onClose, ingredientToEdit, onRefresh }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    category: 'Vegetables' // Default category
  });
  const [loading, setLoading] = useState(false);

  // تحديث الفورم لو بنعمل تعديل (Edit Mode)
  useEffect(() => {
    if (ingredientToEdit) {
      setFormData({
        name_en: ingredientToEdit.name_en || '',
        name_ar: ingredientToEdit.name_ar || '',
        category: ingredientToEdit.category || 'Vegetables'
      });
    } else {
      // Reset for create mode
      setFormData({ name_en: '', name_ar: '', category: 'Vegetables' });
    }
  }, [ingredientToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isEdit = !!ingredientToEdit;
    const url = isEdit 
      ? `http://127.0.0.1:8000/api/admin/ingredients/${ingredientToEdit.id}`
      : 'http://127.0.0.1:8000/api/admin/ingredients';
    
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        onRefresh(); // تحديث الجدول
        onClose();   // قفل المودال
        // alert(isEdit ? "Updated Successfully" : "Created Successfully");
      } else {
        const errorData = await res.json();
        alert("Error: " + JSON.stringify(errorData.errors || errorData));
      }
    } catch (error) {
      console.error("Error saving ingredient:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={overlayStyle}>
      <div className="modal-content" style={modalStyle}>
        <div style={headerStyle}>
          <h3>{ingredientToEdit ? 'Edit Ingredient' : 'Add New Ingredient'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div className="form-group">
            <label style={labelStyle}>English Name</label>
            <input 
              type="text" 
              required
              value={formData.name_en}
              onChange={(e) => setFormData({...formData, name_en: e.target.value})}
              style={inputStyle}
              placeholder="e.g. Tomato"
            />
          </div>

          <div className="form-group">
            <label style={labelStyle}>Arabic Name</label>
            <input 
              type="text" 
              required
              value={formData.name_ar}
              onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
              style={inputStyle}
              placeholder="مثال: طماطم"
              dir="rtl"
            />
          </div>

          <div className="form-group">
            <label style={labelStyle}>Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              style={inputStyle}
            >
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Meat & Poultry">Meat & Poultry</option>
              <option value="Dairy">Dairy</option>
              <option value="Spices">Spices</option>
              <option value="Grains">Grains</option>
              <option value="Oils">Oils</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button type="submit" disabled={loading} style={saveBtnStyle}>
              {loading ? 'Saving...' : <><Save size={16} /> Save</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// Simple inline styles for the Modal
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
};

const modalStyle = {
  background: 'white', padding: '20px', borderRadius: '12px', width: '400px', maxWidth: '90%',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const headerStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px',
  borderBottom: '1px solid #eee', paddingBottom: '10px'
};

const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#334155' };
const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' };
const saveBtnStyle = { 
  display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', 
  background: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' 
};
const cancelBtnStyle = { 
  padding: '8px 16px', background: 'white', border: '1px solid #cbd5e1', 
  borderRadius: '6px', cursor: 'pointer', color: '#64748b' 
};

export default IngredientModal;