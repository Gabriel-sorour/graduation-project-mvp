import api from './api';

export const getShoppingList = async (lang = 'en') => {
  const token = localStorage.getItem('token');
  if (!token) return [];

  try {
    const response = await api.get(`/shopping-list?lang=${lang}`, {
      headers: {
        'Accept-Language': lang
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching shopping list:", error);
    return [];
  }
};

export const addItem = async (itemName, lang = 'en') => {
  try {
    const response = await api.post('/shopping-list', {
      item_name: itemName
    }, {
      headers: {
        'Accept-Language': lang
      }
    });

    return response.data.data;
  } catch (error) {
    console.error("Error adding item:", error);
    return null;
  }
};

export const updateItemStatus = async (id, isChecked, lang = 'en') => {
  try {
    await api.patch(`/shopping-list/${id}`, {
      is_checked: isChecked
    }, {
      headers: {
        'Accept-Language': lang
      }
    });
    return true;
  } catch (error) {
    console.error("Error updating item:", error);
    return false;
  }
};

export const deleteItem = async (id, lang = 'en') => {
  try {
    await api.delete(`/shopping-list/${id}`, {
      headers: {
        'Accept-Language': lang
      }
    });
    return true;
  } catch (error) {
    console.error("Error deleting item:", error);
    return false;
  }
};

export const getAllIngredients = async (lang = 'en') => {
  try {
    const response = await api.get(`/ingredients?lang=${lang}`, {
      headers: {
        'Accept-Language': lang
      }
    });
    
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