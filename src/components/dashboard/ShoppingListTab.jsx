import React, { useState, useEffect, useRef } from 'react';
import { Trash2, ShoppingCart, Check, Search } from 'lucide-react';
import { getShoppingList, addItem, updateItemStatus, deleteItem, getAllIngredients } from '../../utils/shoppingService';

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
      const listData = await getShoppingList();
      const ingredientsData = await getAllIngredients();
      
      setItems(listData);
      setAllIngredients(ingredientsData);
      setLoading(false);
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

    setInputValue("");
    setSuggestions([]);

    const addedItem = await addItem(finalName);
    if (addedItem) {
      setItems(prev => [...prev, addedItem]);
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
    if (!success) setItems(prev => prev.map(item => item.id === id ? { ...item, is_checked: currentStatus } : item));
  };

  // Delete Item
  const handleDelete = async (id) => {
    const originalItems = [...items];
    setItems(prev => prev.filter(item => item.id !== id));
    const success = await deleteItem(id);
    if (!success) setItems(originalItems);
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
          <ShoppingCart size={24} /> Shopping List
        </h2>
        <p style={{ color: '#6b7280' }}>Manage ingredients you need to buy.</p>
      </div>

      {/* Autocomplete Input */}
      <div ref={wrapperRef} style={{ position: 'relative', marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          border: '1px solid #e5e7eb', 
          borderRadius: '0.5rem', 
          backgroundColor: 'white',
          padding: '0.5rem 1rem',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          <Search size={20} color="#9ca3af" />
          
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem(inputValue)}
            placeholder="Type to search ingredients..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              paddingLeft: '0.75rem',
              fontSize: '1rem',
              color: '#374151',
              height: '100%'
            }}
          />
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            marginTop: '0.5rem',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 50,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                onClick={() => handleSelectSuggestion(suggestion)}
                style={{
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  borderBottom: index !== suggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                  color: '#374151',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* List Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.length === 0 && !loading ? (
           <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
             Your list is empty. Start typing to add items!
           </div>
        ) : (
          items.map(item => (
            <div 
              key={item.id} 
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.75rem 1rem', backgroundColor: 'white',
                border: '1px solid #e5e7eb', borderRadius: '0.5rem',
                opacity: item.is_checked ? 0.6 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div 
                  onClick={() => handleToggle(item.id, item.is_checked)}
                  style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    border: `2px solid ${item.is_checked ? '#22c55e' : '#d1d5db'}`,
                    backgroundColor: item.is_checked ? '#22c55e' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {/* Use !! to bring the actual boolean value (true/false) */}
                  {!!item.is_checked && <Check size={14} color="white" strokeWidth={3} />}
                </div>
                
                <span style={{ 
                  fontSize: '1rem', 
                  textDecoration: item.is_checked ? 'line-through' : 'none',
                  color: item.is_checked ? '#6b7280' : '#1f2937'
                }}>
                  {item.item_name}
                </span>
              </div>

              <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
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