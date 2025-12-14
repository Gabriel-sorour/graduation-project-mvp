const API_URL = 'http://127.0.0.1:8000/api/user/pantry';

// 1. Get All Pantry Items
export const getPantryItems = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.data || []; // Handle { data: [...] } structure
  } catch (error) {
    console.error("Error fetching pantry:", error);
    return [];
  }
};

// 2. Add Item
export const addPantryItem = async (itemName) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ item_name: itemName })
    });
    
    if (!response.ok) return null;
    
    // Assuming API returns the created object directly or wrapped in data
    const result = await response.json();
    return result.data || result; 
  } catch (error) {
    console.error("Error adding pantry item:", error);
    return null;
  }
};

// 3. Delete Item
export const deletePantryItem = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    return true;
  } catch (error) {
    console.error("Error deleting pantry item:", error);
    return false;
  }
};