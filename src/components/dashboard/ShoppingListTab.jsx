import React, { useState, useEffect, useRef } from 'react';
import { Trash2, ShoppingCart, Check, Search } from 'lucide-react';
import { getShoppingList, addItem, updateItemStatus, deleteItem, getAllIngredients } from '../../utils/shoppingService';
import { useLanguage } from '../../context/LanguageContext'; // 1. استدعاء الكونتكست

import './ShoppingListTab.css';

const ShoppingListTab = () => {
  const { language } = useLanguage();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
   
  // Autocomplete States
  const [inputValue, setInputValue] = useState("");
  const [allIngredients, setAllIngredients] = useState([]); 
  const [suggestions, setSuggestions] = useState([]);
   
  const wrapperRef = useRef(null);

  // Load Data on Mount & Language Change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const listData = await getShoppingList(language);
        const ingredientsData = await getAllIngredients(language);
        
        setItems(Array.isArray(listData) ? listData : []);
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
  // Handle Input & Filter
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

  // Add Item Logic
  const handleAddItem = async (nameToAdd) => {
    if (!nameToAdd || !nameToAdd.trim()) return;
     
    const finalName = nameToAdd.trim();

    // Check Duplicates
    const exists = items.some(item => item.item_name.toLowerCase() === finalName.toLowerCase());
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

  // Toggle Status
  const handleToggle = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    setItems(prev => prev.map(item => item.id === id ? { ...item, is_checked: newStatus } : item));
    
    const success = await updateItemStatus(id, newStatus);
    
    if (!success) {
        setItems(prev => prev.map(item => item.id === id ? { ...item, is_checked: currentStatus } : item));
    }
  };

  // Delete Item
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
       
      {/* Header */}
      <div className="shopping-header">
        <h2 className="shopping-title">
          <ShoppingCart size={24} /> {t.title}
        </h2>
        <p className="shopping-subtitle">{t.subtitle}</p>
      </div>

      {/* Autocomplete Input */}
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

        {/* Suggestions Dropdown */}
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

      {/* List Items */}
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
                  {item.item_name}
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