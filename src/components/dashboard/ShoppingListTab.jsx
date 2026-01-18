import React, { useState, useEffect, useRef } from 'react';
import { Trash2, ShoppingCart, Check, Search } from 'lucide-react';
import { getShoppingList, addItem, updateItemStatus, deleteItem, getAllIngredients } from '../../utils/shoppingService';
import { useLanguage } from '../../context/LanguageContext';

import './ShoppingListTab.css';

const ShoppingListTab = () => {
  const { language } = useLanguage();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
   
  const [inputValue, setInputValue] = useState("");
  const [allIngredients, setAllIngredients] = useState([]); 
  const [suggestions, setSuggestions] = useState([]);
   
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const listData = await getShoppingList(language);
        const ingredientsData = await getAllIngredients(language);
        
        let finalItems = [];
        if (Array.isArray(listData)) {
            finalItems = listData;
        } else if (listData && Array.isArray(listData.data)) {
            finalItems = listData.data;
        }

        setItems(finalItems);
        setAllIngredients(Array.isArray(ingredientsData) ? ingredientsData : []);
      } catch (error) {
        console.error("Failed to load shopping data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [language]);

  const normalizeText = (text) => {
    if (typeof text !== 'string') return "";
    return text.toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const normalizedInput = normalizeText(value);

      const filtered = allIngredients.filter(ingredient => {
        const normalizedIngredient = normalizeText(ingredient);
        const matchesSearch = normalizedIngredient.includes(normalizedInput);
        
        const isAlreadyAdded = items.some(item => 
          normalizeText(item.item_name) === normalizedIngredient
        );

        return matchesSearch && !isAlreadyAdded;
      });
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleAddItem = async (nameToAdd) => {
    if (!nameToAdd || !nameToAdd.trim()) return;
     
    const finalName = nameToAdd.trim();
    const normalizedName = normalizeText(finalName);

    const exists = items.some(item => normalizeText(item.item_name) === normalizedName);
    if (exists) {
      setInputValue(""); 
      setSuggestions([]);
      return;
    }

    setInputValue("");
    setSuggestions([]);

    try {
      const addedItem = await addItem(finalName, language);
      if (addedItem) {
        setItems(prev => [...prev, addedItem]);
      }
    } catch (error) {
      console.error("Failed to add item", error);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    handleAddItem(suggestion);
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    setItems(prev => prev.map(item => item.id === id ? { ...item, is_checked: newStatus } : item));
    
    const success = await updateItemStatus(id, newStatus);
    
    if (!success) {
        setItems(prev => prev.map(item => item.id === id ? { ...item, is_checked: currentStatus } : item));
    }
  };

  const handleDelete = async (id) => {
    const originalItems = [...items];
    setItems(prev => prev.filter(item => item.id !== id));
    
    const success = await deleteItem(id);
    
    if (!success) {
        setItems(originalItems);
    }
  };

  const t = {
    loading: language === 'ar' ? 'جاري التحميل...' : 'Loading...',
    title: language === 'ar' ? 'قائمة التسوق' : 'Shopping List',
    subtitle: language === 'ar' ? 'أدر المكونات التي تحتاج لشرائها.' : 'Manage ingredients you need to buy.',
    placeholder: language === 'ar' ? 'اكتب للبحث عن مكون...' : 'Type to search ingredients...',
    empty: language === 'ar' ? 'القائمة فارغة. ابدأ بالكتابة لإضافة عناصر!' : 'Your list is empty. Start typing to add items!'
  };

  if (loading) return <div className="empty-state">{t.loading}</div>;

  return (
    <div className={`shopping-container ${language === 'ar' ? 'rtl-content' : ''}`}>
       
      <div className="shopping-header">
        <h2 className="shopping-title">
          <ShoppingCart size={24} /> {t.title}
        </h2>
        <p className="shopping-subtitle">{t.subtitle}</p>
      </div>

      <div ref={wrapperRef} className="search-wrapper">
        <div className="search-input-group">
          
          <Search size={20} className={`search-icon ${language === 'ar' ? 'search-icon-rtl' : ''}`} />
           
          <input
            type="search"
            className="search-input"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem(inputValue)}
            placeholder={t.placeholder}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>

        {suggestions.length > 0 && (
          <div className="suggestions-dropdown" style={{textAlign: language === 'ar' ? 'right' : 'left'}}>
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

      <div className="shopping-list">
        {items.length === 0 && !loading ? (
           <div className="empty-state">
             {t.empty}
           </div>
        ) : (
          items.map(item => (
            <div 
              key={item.id} 
              className={`list-item ${item.is_checked ? 'checked' : ''}`}
            >
              <div className="item-left">
                <div 
                  onClick={() => handleToggle(item.id, item.is_checked)}
                  className={`custom-checkbox ${item.is_checked ? 'checked' : ''}`}
                >
                  {!!item.is_checked && <Check size={14} color="white" strokeWidth={3} />}
                </div>
                 
                <span className={`item-name ${item.is_checked ? 'checked' : ''}`}>
                  {item.display_name || item.item_name}
                </span>
              </div>

              <button onClick={() => handleDelete(item.id)} className="btn-delete">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShoppingListTab;