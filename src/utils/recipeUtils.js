export const formatRecipe = (data, lang = 'en') => {
  const recipe = data.data || data.recipe || data;

  let title = recipe.title;
  if (lang === 'ar') {
    title = recipe.title_ar || recipe.title || recipe.name || "وصفة بدون عنوان";
  } else {
    title = recipe.title_en || recipe.title || recipe.name || "Untitled Recipe";
  }

  let ingredients = recipe.ingredients;

  if (typeof ingredients === 'string') {
    try {
      ingredients = JSON.parse(ingredients);
    } catch (e) {
      ingredients = [];
      console.log(e);
    }
  }

  if (Array.isArray(ingredients)) {
    ingredients = ingredients.map(ing => {
      // لو كان نصاً بسيطاً، نحوله لكائن موحد
      if (typeof ing === 'string') return { id: null, name: ing };

      if (typeof ing === 'object' && ing !== null) {
        const name = lang === 'ar' 
          ? (ing.pivot?.ingredient_name_ar || ing.name_ar || ing.item_name || ing.name)
          : (ing.name_en || ing.name || ing.item_name);
        
        // نرجع كائن يحتوي على الـ ID والاسم
        return {
          id: ing.id || (ing.pivot ? ing.pivot.ingredient_id : null),
          name: name
        };
      }
      return { id: null, name: '' };
    });
  } else {
    ingredients = [];
  }

  let steps = recipe.steps;
  if (typeof steps === 'string') {
    try {
      steps = JSON.parse(steps);
    } catch (e) {
      steps = [];
      console.log(e);
    }
  }

  if (!Array.isArray(steps) && typeof steps === 'object' && steps !== null) {
    steps = lang === 'ar' ? (steps.ar || steps.en || []) : (steps.en || steps.ar || []);
  }

  if (!Array.isArray(steps)) {
    steps = [];
  }

  let description = recipe.description;
  if (lang === 'ar' && recipe.description_ar) {
    description = recipe.description_ar;
  } else if (lang === 'en' && recipe.description_en) {
    description = recipe.description_en;
  }

  return {
    id: recipe.id,
    title: title,
    image: recipe.image,
    time: recipe.time || recipe.cook_time || "N/A",
    calories: recipe.calories || 0,
    difficulty: recipe.difficulty || "Easy",
    ingredients: ingredients,
    steps: steps,
    description: description,
    missing_count: recipe.missing_ingredient_count || 0
  };
};