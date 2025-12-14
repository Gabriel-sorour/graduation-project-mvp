const API_URL = 'http://127.0.0.1:8000/api/shopping-list';

// 1. Get All Items
export const getShoppingList = async () => {
  try {
    const response = await fetch(API_URL);
    return response.ok ? await response.json() : [];
  } catch (error) {
    console.error("Error fetching shopping list:", error);
    return [];
  }
};

// 2. Add New Item
export const addItem = async (itemName) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ item_name: itemName })
    });

    // API returns { status: "success", data: { ... } }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error adding item:", error);
    return null;
  }
};

// 3. Update Status (Check/Uncheck)
export const updateItemStatus = async (id, isChecked) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ is_checked: isChecked })
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
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    return true;
  } catch (error) {
    console.error("Error deleting item:", error);
    return false;
  }
};

// Get All Ingredients for Autocomplete
export const getAllIngredients = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/ingredients');
    if (response.ok) {
      const data = await response.json();
      return data.map(item => item.name || item); 
    }
    return [];
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return [];
  }
};