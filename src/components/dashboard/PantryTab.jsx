import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react'; 
import { getPantryItems, addPantryItem, deletePantryItem } from '../../utils/pantryService';
import { getAllIngredients } from '../../utils/shoppingService'; 

function PantryTab() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Data on Mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Get Pantry Items
        const pantryData = await getPantryItems();
        setItems(Array.isArray(pantryData) ? pantryData : []);

        // 2. Get All Ingredients (for Autocomplete)
        const ingredientsData = await getAllIngredients();
        setAllIngredients(Array.isArray(ingredientsData) ? ingredientsData : []);
      } catch (error) {
        console.error("Error loading pantry data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filtered = allIngredients.filter(ingredient => 
        // Match string
        ingredient.toLowerCase().includes(value.toLowerCase()) && 
        // Prevent duplicates in Pantry
        !items.some(item => item.item_name.toLowerCase() === ingredient.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = async (suggestion) => {
    // Clear UI immediately
    setInputValue("");
    setSuggestions([]);

    try {
      // API Call via Service
      const newItem = await addPantryItem(suggestion);
      
      if (newItem) {
        // Update State locally (No need to re-fetch entire list)
        setItems(prev => [...prev, newItem]);
      }
    } catch (error) {
      console.error("Error adding pantry item:", error);
    }
  };

  const handleRemoveItem = async (id) => {
    // Store old state for rollback
    const originalItems = [...items];
    
    // Optimistic Update (Remove from UI immediately)
    setItems(prev => prev.filter(item => item.id !== id));

    // API Call via Service
    const success = await deletePantryItem(id);
    
    // Rollback if failed
    if (!success) {
      setItems(originalItems);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
        Loading pantry...
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2>My Pantry</h2>
        <span className="text-gray-400 text-sm">{items.length} items</span>
      </div>

      <div className="pantry-input-group">
        <div className="input-wrapper">

          <Search className="search-icon" size={18} />
          
          <input 
            type="text" 
            className="pantry-input"
            placeholder="Type to search ingredients..." 
            value={inputValue}
            onChange={handleInputChange}
          />
          
          {/* Show suggestions */}
          {suggestions.length > 0 && (
            <div className="suggestions-list">
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
            <button className="btn-remove" onClick={() => handleRemoveItem(item.id)}>
              <X size={12} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p style={{ color: 'var(--gray)', fontStyle: 'italic', width: '100%', textAlign: 'center' }}>
            Your pantry is empty. Start adding ingredients!
          </p>
        )}
      </div>
    </div>
  );
}

export default PantryTab;