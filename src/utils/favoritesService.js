const STORAGE_KEY = 'sage_favorites';

export const getFavorites = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const checkIsFavorite = (recipeId) => {
  const favorites = getFavorites();
  return favorites.some(recipe => recipe.id === recipeId);
};


export const toggleFavorite = (recipe) => {
  let favorites = getFavorites();
  const exists = favorites.some(r => r.id === recipe.id);

  if (exists) {
    favorites = favorites.filter(r => r.id !== recipe.id);
  } else {
    favorites.push(recipe);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  return !exists;
};