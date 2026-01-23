import React, { useState, useEffect } from 'react';
import { X, Save, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './IngredientModal.css'; // استيراد ملف الستايل

function IngredientModal({ isOpen, onClose, ingredientToEdit, onRefresh }) {
  const { token } = useAuth();
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    category: 'Vegetables'
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setErrorMessage('');
    if (ingredientToEdit) {
      setFormData({
        name_en: ingredientToEdit.name_en || '',
        name_ar: ingredientToEdit.name_ar || '',
        category: ingredientToEdit.category || 'Vegetables'
      });
    } else {
      setFormData({ name_en: '', name_ar: '', category: 'Vegetables' });
    }
  }, [ingredientToEdit, isOpen]);

  if (!isOpen) return null;

  const getErrorTranslation = (errCode) => {
    const isAr = language === 'ar';
    const messages = {
      'ERR_UNIQUE_EN': isAr ? 'هذا الاسم الإنجليزي مسجل مسبقاً.' : 'This English name is already registered.',
      'ERR_UNIQUE_AR': isAr ? 'هذا الاسم العربي موجود بالفعل.' : 'This Arabic name already exists.',
      'ERR_UNIQUE_BOTH': isAr ? 'الاسمان العربي والإنجليزي مسجلان مسبقاً.' : 'Both names are already registered.',
    };
    return messages[errCode] || (isAr ? 'حدث خطأ غير متوقع.' : 'An unexpected error occurred.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const isEdit = !!ingredientToEdit;
    const url = isEdit 
      ? `http://127.0.0.1:8000/api/admin/ingredients/${ingredientToEdit.id}`
      : 'http://127.0.0.1:8000/api/admin/ingredients';
    
    try {
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        onRefresh();
        onClose();
      } else {
        setErrorMessage(getErrorTranslation(data.message));
      }
    } catch (error) {
      setErrorMessage(language === 'ar' ? "خطأ في الاتصال" : "Connection error");
      console.log(error);
      
    } finally {
      setLoading(false);
    }
  };

  const t = {
    add: language === 'ar' ? 'إضافة مكون جديد' : 'Add New Ingredient',
    edit: language === 'ar' ? 'تعديل المكون' : 'Edit Ingredient',
    enLabel: language === 'ar' ? 'الاسم بالإنجليزي' : 'English Name',
    arLabel: language === 'ar' ? 'الاسم بالعربي' : 'Arabic Name',
    catLabel: language === 'ar' ? 'القسم' : 'Category',
    cancel: language === 'ar' ? 'إلغاء' : 'Cancel',
    save: language === 'ar' ? 'حفظ' : 'Save',
    saving: language === 'ar' ? 'جاري الحفظ...' : 'Saving...'
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="modal-header">
          <h3>{ingredientToEdit ? t.edit : t.add}</h3>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        {errorMessage && (
          <div className="error-alert">
            <AlertCircle size={18} />
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.enLabel}</label>
            <input 
              type="text" required className="form-input"
              value={formData.name_en}
              onChange={(e) => setFormData({...formData, name_en: e.target.value})}
              placeholder="Tomato"
            />
          </div>

          <div className="form-group">
            <label>{t.arLabel}</label>
            <input 
              type="text" required className="form-input"
              value={formData.name_ar}
              onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
              placeholder="طماطم" dir="rtl"
            />
          </div>

          <div className="form-group">
            <label>{t.catLabel}</label>
            <select 
              className="form-input"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
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

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="cancel-btn">{t.cancel}</button>
            <button type="submit" disabled={loading} className="save-btn">
              {loading ? (
                <><Loader size={16} className="spin" /> {t.saving}</>
              ) : (
                <><Save size={16} /> {t.save}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IngredientModal;