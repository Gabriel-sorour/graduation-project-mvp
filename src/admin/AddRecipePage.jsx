import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useAlert } from '../context/AlertContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft, Upload } from 'lucide-react';
import './AdminRecipeForm.css';

function AddRecipePage() {
  const { token } = useAuth();
  const { language } = useLanguage();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title_en: '', title_ar: '',
    description_en: '', description_ar: '',
    category_id: '', // Changed from 'category' to 'category_id'
    meal_type: '',
    cuisine: '',
    time: '30',
    difficulty: 'Easy',
    calories: '',
    temperature: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [selectedIngredients, setSelectedIngredients] = useState([
    { id: '', quantity: '', unit: '' }
  ]);
  const [steps, setSteps] = useState([
    { instruction_en: '', instruction_ar: '' }
  ]);

  useEffect(() => {
    // Fetch Ingredients
    fetch('http://127.0.0.1:8000/api/admin/ingredients?all=1', {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    })
    .then(res => res.json())
    .then(data => setAvailableIngredients(data.data || data))
    .catch(err => console.error(err));

    // Fetch Categories from our new table
    fetch('http://127.0.0.1:8000/api/admin/recipes/options', {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    })
    .then(res => res.json())
    .then(data => setCategories(data.categories || []))
    .catch(err => console.error(err));
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const list = [...selectedIngredients];
    list[index][field] = value;
    setSelectedIngredients(list);
  };
  
  const addIngredientRow = () => setSelectedIngredients([...selectedIngredients, { id: '', quantity: '', unit: '' }]);
  
  const removeIngredientRow = (index) => {
    const list = [...selectedIngredients];
    list.splice(index, 1);
    setSelectedIngredients(list);
  };

  const handleStepChange = (index, field, value) => {
    const list = [...steps];
    list[index][field] = value;
    setSteps(list);
  };

  const addStepRow = () => setSteps([...steps, { instruction_en: '', instruction_ar: '' }]);
  
  const removeStepRow = (index) => {
    const list = [...steps];
    list.splice(index, 1);
    setSteps(list);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();

    Object.keys(formData).forEach(key => {
        if(formData[key]) data.append(key, formData[key]);
    });
    if (imageFile) data.append('image', imageFile);

    selectedIngredients.forEach((ing, index) => {
        if (ing.id) {
            data.append(`ingredients[${index}][id]`, ing.id);
            data.append(`ingredients[${index}][quantity]`, ing.quantity);
            data.append(`ingredients[${index}][unit]`, ing.unit);
        }
    });

    steps.forEach((step, index) => {
        if (step.instruction_en) {
            data.append(`steps[${index}][instruction_en]`, step.instruction_en);
            data.append(`steps[${index}][instruction_ar]`, step.instruction_ar);
        }
    });

    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/recipes', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        body: data
      });
      const result = await res.json();
      
      if (res.ok) {
        showAlert(
            language === 'ar' ? 'تم بنجاح' : 'Success',
            language === 'ar' ? 'تم إضافة الوصفة بنجاح' : 'Recipe Created Successfully'
        );
        navigate('/admin/recipes');
      } else {
        const errorMsg = result.message || JSON.stringify(result.errors);
        showAlert(language === 'ar' ? 'خطأ' : 'Error', errorMsg);
      }
    } catch (error) {
      console.error(error);
      showAlert(
          language === 'ar' ? 'خطأ' : 'Error',
          language === 'ar' ? 'فشل إرسال البيانات' : 'Failed to submit recipe'
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine if meal_type should be enabled
  const selectedCategoryName = categories.find(c => c.id == formData.category_id)?.name_en;
  const isMeal = selectedCategoryName === 'Meal';

  return (
    <div className="admin-recipe-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="admin-recipe-header">
        <button onClick={() => navigate(-1)} className="admin-back-btn">
            <ArrowLeft className={language === 'ar' ? 'rotate-180' : ''} />
        </button>
        <h1>{language === 'ar' ? 'إضافة وصفة جديدة' : 'Add New Recipe'}</h1>
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
                    <select 
                        name="category_id" 
                        className="admin-form-input" 
                        value={formData.category_id} 
                        onChange={handleChange}
                        required
                    >
                        <option value="">{language === 'ar' ? 'اختر التصنيف' : 'Select Category'}</option>
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
                        style={{ opacity: !isMeal ? 0.6 : 1 }}
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
                    <label>{language === 'ar' ? 'الوقت (دقيقة)' : 'Time (Minutes)'}</label>
                    <input type="number" name="time" className="admin-form-input" value={formData.time} onChange={handleChange} required />
                </div>
                <div className="admin-form-group">
                    <label>{language === 'ar' ? 'السعرات' : 'Calories'}</label>
                    <input type="number" name="calories" className="admin-form-input" value={formData.calories} onChange={handleChange} />
                </div>
                <div className="admin-form-group">
                    <label>{language === 'ar' ? 'المطبخ' : 'Cuisine'}</label>
                    <input type="text" name="cuisine" className="admin-form-input" value={formData.cuisine} onChange={handleChange} placeholder="e.g. Egyptian" />
                </div>
            </div>
            
            <div className="admin-form-group" style={{marginTop:'15px'}}>
                <label>Description (EN)</label>
                <textarea name="description_en" className="admin-form-input" value={formData.description_en} onChange={handleChange} rows="3"></textarea>
            </div>
            <div className="admin-form-group">
                <label>Description (AR)</label>
                <textarea name="description_ar" className="admin-form-input" value={formData.description_ar} onChange={handleChange} rows="3" dir="rtl"></textarea>
            </div>
        </div>

        <div className="admin-recipe-card">
            <h3 className="admin-card-title">{language === 'ar' ? 'صورة الوصفة' : 'Recipe Image'}</h3>
            <div className="admin-image-upload-area">
                <input type="file" onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} id="img-upload" />
                <label htmlFor="img-upload" className="admin-upload-label">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="admin-preview-img" />
                    ) : (
                        <>
                            <Upload size={40} />
                            <span>{language === 'ar' ? 'اضغط لرفع صورة' : 'Click to upload image'}</span>
                        </>
                    )}
                </label>
            </div>
        </div>

        <div className="admin-recipe-card">
            <div className="admin-section-header">
                <h3 className="admin-card-title">{language === 'ar' ? 'المكونات' : 'Ingredients'}</h3>
                <button type="button" onClick={addIngredientRow} className="admin-add-btn">
                    <Plus size={16}/> {language === 'ar' ? 'إضافة' : 'Add'}
                </button>
            </div>
            {selectedIngredients.map((ing, index) => (
                <div key={index} className="admin-row-item">
                    <div style={{ flex: 2 }}>
                        <select 
                            value={ing.id} 
                            onChange={(e) => handleIngredientChange(index, 'id', e.target.value)}
                            className="admin-form-input"
                            required
                        >
                            <option value="">{language === 'ar' ? 'اختر مكون' : 'Select Ingredient'}</option>
                            {availableIngredients.map(ai => (
                                <option key={ai.id} value={ai.id}>{ai.name_en} / {ai.name_ar}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <input type="text" value={ing.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} className="admin-form-input" placeholder={language === 'ar' ? 'الكمية' : 'Qty'} required />
                    </div>
                    <div style={{ flex: 1 }}>
                        <input type="text" value={ing.unit} onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)} className="admin-form-input" placeholder={language === 'ar' ? 'الوحدة' : 'Unit'} />
                    </div>
                    <button type="button" onClick={() => removeIngredientRow(index)} className="admin-remove-btn">
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>

        <div className="admin-recipe-card">
            <div className="admin-section-header">
                <h3 className="admin-card-title">{language === 'ar' ? 'الخطوات' : 'Steps'}</h3>
                <button type="button" onClick={addStepRow} className="admin-add-btn">
                    <Plus size={16}/> {language === 'ar' ? 'إضافة' : 'Add'}
                </button>
            </div>
            {steps.map((step, index) => (
                <div key={index} className="admin-step-row">
                    <div className="admin-step-header">
                        <span>{language === 'ar' ? 'خطوة' : 'Step'} {index + 1}</span>
                        <button type="button" onClick={() => removeStepRow(index)} className="admin-remove-btn" style={{height:'30px', width:'30px'}}>
                            <Trash2 size={14} />
                        </button>
                    </div>
                    <div className="admin-grid-2">
                        <input type="text" placeholder="English Instruction" value={step.instruction_en} onChange={(e) => handleStepChange(index, 'instruction_en', e.target.value)} className="admin-form-input" required />
                        <input type="text" placeholder="التعليمات بالعربي" value={step.instruction_ar} onChange={(e) => handleStepChange(index, 'instruction_ar', e.target.value)} className="admin-form-input" dir="rtl" required />
                    </div>
                </div>
            ))}
        </div>

        <div className="admin-submit-container">
            <button type="submit" disabled={loading} className="admin-save-btn">
                {loading ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : <><Save size={20} /> {language === 'ar' ? 'حفظ الوصفة' : 'Save Recipe'}</>}
            </button>
        </div>
      </form>
    </div>
  );
}

export default AddRecipePage;