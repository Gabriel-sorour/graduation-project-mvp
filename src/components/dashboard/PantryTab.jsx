import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react'; 
// import { ALL_INGREDIENTS } from '../../utils/allIngredients';

function PantryTab() {
  // User mock data -> Changed to Empty Array for API data
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [allIngredients, setAllIngredients] = useState([]);

  // Helper to refresh data
  const fetchPantry = () => {
    fetch('http://127.0.0.1:8000/api/user/pantry')
      .then(res => res.json())
      .then(data => {
        if(data.data) setItems(data.data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    // 1. Get Pantry Items
    fetchPantry();

    // 2. Get All Ingredients
    fetch('http://127.0.0.1:8000/api/ingredients')
      .then(response => response.json())
      .then(data => {   
        
        setAllIngredients(data); 
      })
      .catch(error => console.error("Error fetching ingredients:", error));
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {

      const filtered = allIngredients.filter(ingredient => 
        ingredient.toLowerCase().includes(value.toLowerCase()) && 
        // Prevent adding duplicates (Check if item_name exists in objects)
        !items.some(item => item.item_name === ingredient) 
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };


  const handleSelectSuggestion = (suggestion) => {
    // API Add (POST)
    fetch('http://127.0.0.1:8000/api/user/pantry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_name: suggestion })
    })
    .then(res => {
      if(res.ok) {
        fetchPantry(); // Refresh list to get new ID
        setInputValue("");
        setSuggestions([]);
      }
    });
  };

  const handleRemoveItem = (id) => {
    // API Remove (DELETE)
    fetch(`http://127.0.0.1:8000/api/user/pantry/${id}`, {
      method: 'DELETE'
    })
    .then(res => {
      if(res.ok) {
        setItems(items.filter(item => item.id !== id));
      }
    });
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