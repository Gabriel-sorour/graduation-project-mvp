import React, { useState } from 'react';
import { Search, X } from 'lucide-react'; 
import { ALL_INGREDIENTS } from '../../utils/allIngredients';

function PantryTab() {
  // Mock Data
  const [items, setItems] = useState(["Rice", "Salt", "Olive Oil", "Pasta"]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {

      const filtered = ALL_INGREDIENTS.filter(ingredient => 
        ingredient.toLowerCase().includes(value.toLowerCase()) && 
        !items.includes(ingredient) 
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };


  const handleSelectSuggestion = (suggestion) => {
    setItems([...items, suggestion]);
    setInputValue("");
    setSuggestions([]); 
  };

  const handleRemoveItem = (itemToRemove) => {
    setItems(items.filter(item => item !== itemToRemove));
  };

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
          <div key={index} className="pantry-item">
            <span>{item}</span>
            <button className="btn-remove" onClick={() => handleRemoveItem(item)}>
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PantryTab;