import api from './api';

// 1. Get All Items
export const getShoppingList = async () => {
  try {
    const response = await api.get('/shopping-list');
    return response.data;
  } catch (error) {
    console.error("Error fetching shopping list:", error);
    return [];
  }
};

// 2. Add New Item
export const addItem = async (itemName) => {
  try {
    const response = await api.post('/shopping-list', { 
      item_name: itemName 
    });

    // API returns { status: "success", data: { ... } }
    // Axios puts the body in response.data, so to get the inner 'data':
    return response.data.data; 
  } catch (error) {
    console.error("Error adding item:", error);
    return null;
  }
};

// 3. Update Status (Check/Uncheck)
export const updateItemStatus = async (id, isChecked) => {
  try {
    await api.patch(`/shopping-list/${id}`, { 
      is_checked: isChecked 
    });
    return true;
  } catch (error) {
    console.error("Error updating item:", error);
    return false;
  }
};

// 4. Delete Item
export const deleteItem = async (id) => {
  try {
    await api.delete(`/shopping-list/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting item:", error);
    return false;
  }
};

// Get All Ingredients for Autocomplete
export const getAllIngredients = async () => {
  try {
    const response = await api.get('/ingredients');
    // Axios returns the data directly in response.data
    const data = response.data;
    if (Array.isArray(data)) {
        return data.map(item => item.name || item);
    }
    return [];
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return [];
  }
};