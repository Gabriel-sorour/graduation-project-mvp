import api from './api';

// 1. Get All Pantry Items
export const getPantryItems = async () => {
  try {

    // Check if there is token or not
    const token = localStorage.getItem('token');
    if (!token) return [];

    const response = await api.get('/pantry');
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching pantry:", error);
    return [];
  }
};

// 2. Add Item
export const addPantryItem = async (itemName) => {
  try {

    const response = await api.post('/pantry', {
      item_name: itemName
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error adding pantry item:", error);
    return null;
  }
};

// 3. Delete Item
export const deletePantryItem = async (id) => {
  try {

    await api.delete(`/pantry/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting pantry item:", error);
    return false;
  }
};