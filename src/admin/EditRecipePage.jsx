import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext'; 
import { useAlert } from '../context/AlertContext'; 
import { Save, Plus, Trash2, ArrowLeft, Loader, Upload } from 'lucide-react';
import './AdminRecipeForm.css';

const EditRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { language } = useLanguage(); 
  const { showAlert } = useAlert(); 

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    title_en: '', title_ar: '',
    description_en: '', description_ar: '',
    category_id: '', 
    meal_type: '', 
    cuisine: '',
    time: '', 
    difficulty: 'Easy',
    calories: '', 
    temperature: '',
    image: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [oldImage, setOldImage] = useState(null);
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };
        
        // 1. جلب المكونات والأقسام أولاً
        const ingRes = await fetch('http://127.0.0.1:8000/api/admin/ingredients?all=1', { headers });
        const ingData = await ingRes.json();
        setAvailableIngredients(ingData.data || ingData);

        const optionsRes = await fetch('http://127.0.0.1:8000/api/admin/recipes/options', { headers });
        const optionsData = await optionsRes.json();
        setCategories(optionsData.categories || []);

        // 2. جلب بيانات الوصفة
        const recipeRes = await fetch(`http://127.0.0.1:8000/api/admin/recipes/${id}`, { headers });
        if (!recipeRes.ok) throw new Error('Failed to fetch recipe');
        const recipe = await recipeRes.json();
        
        // دالة مساعدة لتحويل أول حرف لـ Capital ليتطابق مع الـ Select Options
        const formatValue = (val) => {
          if (!val) return '';
          const str = String(val).trim();
          return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        };

        // تنظيف الوقت من أي نصوص (مثل "20 min" تتحول لـ 20)
        const cleanTime = recipe.time ? parseInt(recipe.time) : '';

        // تعبئة الفورم مع حماية ضد الـ null
        setFormData({
          title_en: recipe.title_en || '',
          title_ar: recipe.title_ar || '',
          description_en: recipe.description_en || '',
          description_ar: recipe.description_ar || '',
          category_id: recipe.category_id || '', 
          meal_type: formatValue(recipe.meal_type),
          cuisine: recipe.cuisine || '',
          time: cleanTime, 
          difficulty: formatValue(recipe.difficulty) || 'Easy',
          calories: recipe.calories || '',
          temperature: formatValue(recipe.temperature),
          image: null
        });

        if (recipe.image) {
            setOldImage(recipe.image.startsWith('http') ? recipe.image : `http://127.0.0.1:8000/storage/${recipe.image}`);
        }

        // تعبئة المكونات من العلاقة pivot
        const formattedIngs = (recipe.ingredients || []).map(ing => ({
          id: ing.id || '',
          quantity: ing.pivot?.quantity || '',
          unit: ing.pivot?.unit || ''
        }));
        setRecipeIngredients(formattedIngs);

        // تعبئة الخطوات من جدول الـ steps
        const formattedSteps = (recipe.steps || []).map(step => ({
           instruction_en: step.instruction_en || '',
           instruction_ar: step.instruction_ar || ''
        }));
        setSteps(formattedSteps);

        setLoading(false);
      } catch (error) {
        console.error("Error loading recipe:", error);
        setLoading(false);
        showAlert(language === 'ar' ? 'خطأ' : 'Error', 'Failed to fetch recipe');
      }
    };
    if(token) fetchData();
  }, [id, token, language, showAlert]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...recipeIngredients];
    updated[index][field] = value;
    setRecipeIngredients(updated);
  };
  
  const addIngredientRow = () => setRecipeIngredients([...recipeIngredients, { id: '', quantity: '', unit: '' }]);
  const removeIngredientRow = (index) => setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index));

  const handleStepChange = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };
  
  const addStepRow = () => setSteps([...steps, { instruction_en: '', instruction_ar: '' }]);
  const removeStepRow = (index) => setSteps(steps.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // استخدام FormData لدعم رفع الصور مع الـ PUT (عن طريق _method)
    const data = new FormData();
    data.append('_method', 'PUT'); 

    Object.keys(formData).forEach(key => {
        if (key === 'image') { 
          if (formData.image) data.append('image', formData.image); 
        } else {
          data.append(key, formData[key] ?? '');
        }
    });

    recipeIngredients.forEach((ing, index) => {
      if(ing.id) {
        data.append(`ingredients[${index}][id]`, ing.id);
        data.append(`ingredients[${index}][quantity]`, ing.quantity);
        data.append(`ingredients[${index}][unit]`, ing.unit);
      }
    });

    steps.forEach((step, index) => {
      if(step.instruction_en || step.instruction_ar) {
        data.append(`steps[${index}][instruction_en]`, step.instruction_en || '');
        data.append(`steps[${index}][instruction_ar]`, step.instruction_ar || '');
      }
    });

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/recipes/${id}`, {
        method: 'POST', // Laravel يطلب POST عند وجود ملفات مع _method=PUT
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }
      
      showAlert(language === 'ar' ? 'تم بنجاح' : 'Success', 'Recipe updated successfully!');
      navigate('/admin/recipes');
    } catch (error) {
      console.error(error);
      showAlert(language === 'ar' ? 'خطأ' : 'Error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCategoryName = categories.find(c => c.id == formData.category_id)?.name_en;
  const isMeal = selectedCategoryName === 'Meal';

  if (loading) return <div className="admin-recipe-container" style={{textAlign:'center', padding:'100px'}}><Loader className="spin" size={40} /></div>;

  return (
    <div className="admin-recipe-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="admin-recipe-header">
        <button className="admin-back-btn" onClick={() => navigate('/admin/recipes')}>
          <ArrowLeft size={20} className={language === 'ar' ? 'rotate-180' : ''} />
        </button>
        <h1>{language === 'ar' ? 'تعديل الوصفة' : 'Edit Recipe'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-recipe-card">
          <h3 className="admin-card-title">{language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}</h3>
          <div className="admin-grid-2">
            <div className="admin-form-group">
              <label>Title (EN)</label>
              <input type="text" name="title_en" className="admin-form-input" value={formData.title_en} onChange={handleChange} required />
            </div>
            <div className="admin-form-group">
              <label>Title (AR)</label>
              <input type="text" name="title_ar" className="admin-form-input" value={formData.title_ar} onChange={handleChange} required dir="rtl" />
            </div>

            <div className="admin-form-group">
                <label>{language === 'ar' ? 'التصنيف' : 'Category'}</label>
                <select name="category_id" className="admin-form-input" value={formData.category_id} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {language === 'ar' ? cat.name_ar : cat.name_en}
                        </option>
                    ))}
                </select>
            </div>

            <div className="admin-form-group">
                <label>Meal Type {!isMeal && '(Optional)'}</label>
                <select 
                    name="meal_type" 
                    className="admin-form-input" 
                    value={formData.meal_type} 
                    onChange={handleChange}
                    disabled={!isMeal}
                >
                    <option value="">Select Type</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                </select>
            </div>

             <div className="admin-form-group">
                <label>{language === 'ar' ? 'درجة الحرارة' : 'Temperature'}</label>
                <select name="temperature" className="admin-form-input" value={formData.temperature} onChange={handleChange}>
                    <option value="">Any</option>
                    <option value="Hot">Hot</option>
                    <option value="Cold">Cold</option>
                </select>
            </div>

            <div className="admin-form-group">
              <label>{language === 'ar' ? 'الصعوبة' : 'Difficulty'}</label>
              <select name="difficulty" className="admin-form-input" value={formData.difficulty} onChange={handleChange}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            
            <div className="admin-form-group">
                <label>{language === 'ar' ? 'الوقت (دقيقة)' : 'Time (mins)'}</label>
                <input type="number" name="time" className="admin-form-input" value={formData.time} onChange={handleChange} required />
            </div>
            <div className="admin-form-group">
               <label>{language === 'ar' ? 'السعرات' : 'Calories'}</label>
               <input type="number" name="calories" className="admin-form-input" value={formData.calories} onChange={handleChange} />
            </div>
          </div>
          
          <div className="admin-form-group" style={{marginTop:'15px'}}>
               <label>Description (EN)</label>
               <textarea name="description_en" className="admin-form-input" value={formData.description_en} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
               <label>Description (AR)</label>
               <textarea name="description_ar" className="admin-form-input" value={formData.description_ar} onChange={handleChange} dir="rtl" />
          </div>
        </div>

        <div className="admin-recipe-card">
          <h3 className="admin-card-title">{language === 'ar' ? 'صورة الوصفة' : 'Recipe Image'}</h3>
          <div className="admin-image-upload-area">
            <input type="file" accept="image/*" onChange={handleImageChange} id="edit-img-upload" style={{display:'none'}} />
            <label htmlFor="edit-img-upload" className="admin-upload-label">
                {previewImage ? (
                    <img src={previewImage} alt="Preview" className="admin-preview-img" />
                ) : oldImage ? (
                    <img src={oldImage} alt="Current" className="admin-preview-img" />
                ) : (
                    <>
                        <Upload size={40} color="#94a3b8" />
                        <span>{language === 'ar' ? 'تغيير الصورة' : 'Upload New Image'}</span>
                    </>
                )}
            </label>
          </div>
        </div>

        <div className="admin-recipe-card">
          <div className="admin-section-header">
            <h3 className="admin-card-title">{language === 'ar' ? 'المكونات' : 'Ingredients'}</h3>
            <button type="button" className="admin-add-btn" onClick={addIngredientRow}>
                <Plus size={16} /> {language === 'ar' ? 'إضافة' : 'Add'}
            </button>
          </div>
          {recipeIngredients.map((ing, index) => (
            <div key={index} className="admin-row-item">
                <div style={{flex: 2}}>
                  <select 
                    value={ing.id} 
                    onChange={(e) => handleIngredientChange(index, 'id', e.target.value)}
                    className="admin-form-input"
                    required
                  >
                    <option value="">{language === 'ar' ? 'اختر مكون' : 'Select Ingredient'}</option>
                    {availableIngredients.map(item => (
                      <option key={item.id} value={item.id}>{item.name_en} / {item.name_ar}</option>
                    ))}
                  </select>
                </div>
                <div style={{flex: 1}}>
                  <input type="text" placeholder="Qty" value={ing.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} className="admin-form-input" />
                </div>
                <div style={{flex: 1}}>
                  <input type="text" placeholder="Unit" value={ing.unit} onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)} className="admin-form-input" />
                </div>
                <button type="button" className="admin-remove-btn" onClick={() => removeIngredientRow(index)}>
                    <Trash2 size={16} />
                </button>
            </div>
          ))}
        </div>

        <div className="admin-recipe-card">
          <div className="admin-section-header">
            <h3 className="admin-card-title">{language === 'ar' ? 'الخطوات' : 'Instructions'}</h3>
            <button type="button" className="admin-add-btn" onClick={addStepRow}>
                <Plus size={16} /> {language === 'ar' ? 'إضافة' : 'Add'}
            </button>
          </div>
          {steps.map((step, index) => (
            <div key={index} className="admin-step-row">
                <div className="admin-step-header">
                    <span>{language === 'ar' ? 'خطوة' : 'Step'} {index + 1}</span>
                    <button type="button" className="admin-remove-btn" onClick={() => removeStepRow(index)}>
                        <Trash2 size={14} />
                    </button>
                </div>
                <div className="admin-grid-2">
                  <input type="text" placeholder="English" value={step.instruction_en} onChange={(e) => handleStepChange(index, 'instruction_en', e.target.value)} className="admin-form-input" required />
                  <input type="text" placeholder="العربية" value={step.instruction_ar} onChange={(e) => handleStepChange(index, 'instruction_ar', e.target.value)} className="admin-form-input" dir="rtl" required />
                </div>
            </div>
          ))}
        </div>

        <div className="admin-submit-container">
          <button type="submit" className="admin-save-btn" disabled={submitting}>
            {submitting ? (language === 'ar' ? 'جاري التحديث...' : 'Updating...') : <><Save size={18} /> {language === 'ar' ? 'تحديث الوصفة' : 'Update Recipe'}</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipePage;