export const formatRecipe = (recipe) => {
  let ingredients = recipe.ingredients;

  // 1. If it's a JSON string, parse it
  if (typeof ingredients === 'string') {
    try {
      ingredients = JSON.parse(ingredients);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      ingredients = [];
    }
  }

  // 2. If it's an array of Objects (from DB relation), extract names
  if (Array.isArray(ingredients)) {
    ingredients = ingredients.map(ing =>
      (typeof ing === 'object' && ing !== null && ing.name) ? ing.name : ing
    );
  }

  return {
    ...recipe,
    ingredients: ingredients
  };
};