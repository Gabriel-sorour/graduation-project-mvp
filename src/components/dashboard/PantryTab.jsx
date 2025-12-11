import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

function PantryTab() {
  // Mock Data
  const [items, setItems] = useState(["Rice", "Salt", "Olive Oil", "Pasta"]);
  const [inputValue, setInputValue] = useState("");

  const handleAddItem = (e) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();

    // Handel adding the same item & prevent adding empty space
    if (trimmedInput && !items.includes(trimmedInput)) {
      setItems([...items, trimmedInput]);
      setInputValue("");
    }
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

      {/* Input Form */}
      <form onSubmit={handleAddItem} className="pantry-input-group">
        <input
          type="text"
          className="pantry-input"
          placeholder="Add ingredient (e.g., Tomato)..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="btn-add">
          <Plus size={20} /> Add
        </button>
      </form>

      {/* Items List */}
      <div className="pantry-grid">
        {items.map((item, index) => (
          <div key={index} className="pantry-item">
            <span>{item}</span>
            <button
              className="btn-remove"
              onClick={() => handleRemoveItem(item)}
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-gray-400 italic">Your pantry is empty.</p>
        )}
      </div>
    </div>
  );
}

export default PantryTab;