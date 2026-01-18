import api from './api';

export const getPantryItems = async (lang = 'en') => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return [];

    const response = await api.get(`/pantry/lang?lang=${lang}`, {
      headers: {
        'Accept-Language': lang
      }
    });
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching pantry:", error);
    return [];
  }
};

export const addPantryItem = async (itemName, lang = 'en') => {
  try {
    const response = await api.post('/pantry', {
      item_name: itemName
    }, {
      headers: {
        'Accept-Language': lang
      }
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error adding pantry item:", error);
    return null;
  }
};

// الدالة القديمة (ممكن نسيبها احتياطي)
export const deletePantryItem = async (id, lang = 'en') => {
  try {
    await api.delete(`/pantry/${id}`, {
      headers: {
        'Accept-Language': lang
      }
    });
    return true;
  } catch (error) {
    console.error("Error deleting pantry item:", error);
    return false;
  }
};

export const deleteAndSync = async (id, lang = 'en') => {
  try {
    await api.delete(`/pantry/${id}/sync`, {
      headers: {
        'Accept-Language': lang
      }
    });
    
    return true;
  } catch (error) {
    console.error("Error syncing delete:", error);
    return false;
  }
};