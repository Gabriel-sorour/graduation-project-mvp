import api from './api';

// 1. Get All Favorites
export const getFavorites = async (lang = 'en') => {

  const token = localStorage.getItem('token');
  if (!token) return [];

  try {
    const response = await api.get('/favorites', {
      headers: {
        'Accept-Language': lang
      }
    });
    return response.data || [];
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

// 2. Check if specific recipe is favorited
export const checkIsFavorite = async (recipeId, lang = 'en') => {
  const favorites = await getFavorites(lang);
  return favorites.some(item => item.recipe_id === recipeId);
};

// 3. Toggle Favorite (Add/Remove)
export const toggleFavorite = async (recipeId, isLiked, lang = 'en') => {
  try {
    if (isLiked) {
      await api.delete(`/favorites/${recipeId}`, {
        headers: {
          'Accept-Language': lang
        }
      });
      return false;
    } else {
      await api.post('/favorites', {
        recipe_id: recipeId
      }, {
        headers: {
          'Accept-Language': lang
        }
      });
      return true;
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return isLiked;
  }
};