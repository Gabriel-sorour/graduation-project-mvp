import React, { useState, useEffect, useRef } from 'react';
import { Trash2, ShoppingCart, Check, Search } from 'lucide-react';
import { getShoppingList, addItem, updateItemStatus, deleteItem, getAllIngredients } from '../../utils/shoppingService';

import './ShoppingListTab.css';

const ShoppingListTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
   
  // Autocomplete States
  const [inputValue, setInputValue] = useState("");
  const [allIngredients, setAllIngredients] = useState([]); 
  const [suggestions, setSuggestions] = useState([]);
   
  const wrapperRef = useRef(null);

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const listData = await getShoppingList();
        const ingredientsData = await getAllIngredients();
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
  }, []);

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

    // Clear input immediately for better UX
    setInputValue("");
    setSuggestions([]);

    try {
      const addedItem = await addItem(finalName);
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
    // Optimistic Update
    setItems(prev => prev.map(item => item.id === id ? { ...item, is_checked: newStatus } : item));
    
    const success = await updateItemStatus(id, newStatus);
    
    if (!success) {
        setItems(prev => prev.map(item => item.id === id ? { ...item, is_checked: currentStatus } : item));
    }
  };

  // Delete Item
  const handleDelete = async (id) => {
    const originalItems = [...items];
    // Optimistic Update
    setItems(prev => prev.filter(item => item.id !== id));
    
    const success = await deleteItem(id);
    
    if (!success) {
        setItems(originalItems);
    }
  };

  if (loading) return <div className="empty-state">Loading...</div>;

  return (
    <div className="shopping-container">
       
      {/* Header */}
      <div className="shopping-header">
        <h2 className="shopping-title">
          <ShoppingCart size={24} /> Shopping List
        </h2>
        <p className="shopping-subtitle">Manage ingredients you need to buy.</p>
      </div>

      {/* Autocomplete Input */}
      <div ref={wrapperRef} className="search-wrapper">
        <div className="search-input-group">
          <Search size={20} className="search-icon" />
           
          <input
            type="search"
            className="search-input"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem(inputValue)}
            placeholder="Type to search ingredients..."
          />
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="suggestions-dropdown">
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
             Your list is empty. Start typing to add items!
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