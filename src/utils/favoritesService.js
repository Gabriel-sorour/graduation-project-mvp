import api from './api';

// 1. Get All Favorites
export const getFavorites = async () => {

  // Check if there is token or not
  const token = localStorage.getItem('token');
  if (!token) return [];

  try {
    const response = await api.get('/favorites');
    // Axios returns data directly in response.data
    return response.data || [];
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

// 2. Check if specific recipe is favorited
export const checkIsFavorite = async (recipeId) => {
  const favorites = await getFavorites();
  return favorites.some(item => item.recipe_id === recipeId);
};

// 3. Toggle Favorite (Add/Remove)
export const toggleFavorite = async (recipeId, isLiked) => {
  try {
    if (isLiked) {

      await api.delete(`/favorites/${recipeId}`);
      return false;
    } else {

      await api.post('/favorites', {
        recipe_id: recipeId
      });
      return true;
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return isLiked;
  }
};