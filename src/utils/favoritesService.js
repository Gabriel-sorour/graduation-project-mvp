const API_URL = 'http://127.0.0.1:8000/api/favorites';

export const getFavorites = async () => {
  try {
    const response = await fetch(API_URL);
    return response.ok ? await response.json() : [];
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

export const checkIsFavorite = async (recipeId) => {
  const favorites = await getFavorites();
  // API returns array of items, checking if recipe_id exists in them
  return favorites.some(item => item.recipe_id === recipeId);
};

export const toggleFavorite = async (recipeId, isLiked) => {
  try {
    if (isLiked) {
      // DELETE request
      await fetch(`${API_URL}/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      return false; // Return new state (Not Liked)
    } else {
      // POST request
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ recipe_id: recipeId })
      });
      return true; // Return new state (Liked)
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return isLiked; // Return original state on error
  }
};