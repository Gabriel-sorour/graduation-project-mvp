import api from './api';

// 1. Get All Pantry Items
export const getPantryItems = async () => {
  try {
    const response = await api.get('/user/pantry');
    // Axios puts the body in response.data.
    // Assuming the API returns { data: [...] }
    return response.data.data || []; 
  } catch (error) {
    console.error("Error fetching pantry:", error);
    return [];
  }
};

// 2. Add Item
export const addPantryItem = async (itemName) => {
  try {
    const response = await api.post('/user/pantry', { 
      item_name: itemName 
    });
    
    // Assuming API returns { data: { ... } } or similar
    return response.data.data || response.data; 
  } catch (error) {
    console.error("Error adding pantry item:", error);
    return null;
  }
};

// 3. Delete Item
export const deletePantryItem = async (id) => {
  try {
    await api.delete(`/user/pantry/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting pantry item:", error);
    return false;
  }
};