import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react'; 
import { getPantryItems, addPantryItem, deletePantryItem } from '../../utils/pantryService';
import { getAllIngredients } from '../../utils/shoppingService'; 
import { useLanguage } from '../../context/LanguageContext'; // 1. استدعاء الكونتكست

function PantryTab() {
  const { language } = useLanguage();

  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Data on Mount & When Language Changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const pantryData = await getPantryItems(language);
        setItems(Array.isArray(pantryData) ? pantryData : []);

        const ingredientsData = await getAllIngredients(language);
        setAllIngredients(Array.isArray(ingredientsData) ? ingredientsData : []);
      } catch (error) {
        console.error("Error loading pantry data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [language]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filtered = allIngredients.filter(ingredient => 
        ingredient.toLowerCase().includes(value.toLowerCase()) && 
        !items.some(item => item.item_name.toLowerCase() === ingredient.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = async (suggestion) => {
    setInputValue("");
    setSuggestions([]);

    try {
      const newItem = await addPantryItem(suggestion, language);
      
      if (newItem) {
        setItems(prev => [...prev, newItem]);
      }
    } catch (error) {
      console.error("Error adding pantry item:", error);
    }
  };

  const handleRemoveItem = async (id) => {
    const originalItems = [...items];
    setItems(prev => prev.filter(item => item.id !== id));

    const success = await deletePantryItem(id);
    
    if (!success) {
      setItems(originalItems);
    }
  };

  const t = {
    loading: language === 'ar' ? 'جاري تحميل المخزن...' : 'Loading pantry...',
    title: language === 'ar' ? 'مخزني' : 'My Pantry',
    itemsCount: language === 'ar' ? 'عنصر' : 'items',
    placeholder: language === 'ar' ? 'ابحث عن مكون لإضافته...' : 'Type to search ingredients...',
    empty: language === 'ar' ? 'مخزنك فارغ. ابدأ بإضافة المكونات!' : 'Your pantry is empty. Start adding ingredients!'
  };

  if (loading && items.length === 0) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
        {t.loading}
      </div>
    );
  }

  return (
    <div className={language === 'ar' ? 'rtl-content' : ''}>
      <div className="section-header">
        <h2>{t.title}</h2>
        <span className="text-gray-400 text-sm">{items.length} {t.itemsCount}</span>
      </div>

      <div className="pantry-input-group">
        <div className="input-wrapper">

          <Search className={`search-icon ${language === 'ar' ? 'search-icon-rtl' : ''}`} size={18} />
          
          <input 
            type="text" 
            className="pantry-input"
            placeholder={t.placeholder}
            value={inputValue}
            onChange={handleInputChange}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
          
          {/* Show suggestions */}
          {suggestions.length > 0 && (
            <div className="suggestions-list" style={{textAlign: language === 'ar' ? 'right' : 'left'}}>
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="suggestion-item"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pantry-grid">
        {items.map((item, index) => (
          <div key={item.id || index} className="pantry-item">
            <span>{item.item_name}</span>
            <button 
              className="btn-remove" 
              onClick={() => handleRemoveItem(item.id)}
              style={{ marginLeft: language === 'ar' ? 0 : 'auto', marginRight: language === 'ar' ? 'auto' : 0 }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {items.length === 0 && !loading && (
          <p style={{ color: 'var(--gray)', fontStyle: 'italic', width: '100%', textAlign: 'center' }}>
            {t.empty}
          </p>
        )}
      </div>
    </div>
  );
}

export default PantryTab;