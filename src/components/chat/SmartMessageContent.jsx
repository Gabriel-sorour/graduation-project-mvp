import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Flame, ChefHat, CheckSquare, List, Heart, ArrowRight } from 'lucide-react';

// --- 1. RecipeCard Component ---
const RecipeCard = ({ recipe, missingItems }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.stopPropagation();
    if (recipe && recipe.id) {

      const isPantryMode = Array.isArray(missingItems);

      const navigationState = {
        isPantryMode: isPantryMode,
        missingIngredients: missingItems || []
      };

      navigate(`/recipe/${recipe.id}`, { state: navigationState });
    }
  };

  return (
    <div
      className="smart-card recipe-card hover:shadow-md cursor-pointer transition-transform hover:-translate-y-1"
      onClick={handleClick}
      title="View Recipe Details"
    >
      <img
        src={recipe.image ? `http://127.0.0.1:8000/${recipe.image}` : '/placeholder-food.jpg'}
        alt={recipe.title}
        className="recipe-img"
      />
      <div className="recipe-details">
        <h4>{recipe.title}</h4>
        <div className="recipe-meta">
          <span><Clock size={14} /> {recipe.time}</span>
          <span><Flame size={14} /> {recipe.calories} kcal</span>
        </div>

        {/* عرض التنبيه فقط إذا كانت هناك عناصر ناقصة فعلياً */}
        {Array.isArray(missingItems) && missingItems.length > 0 && (
          <div className="missing-alert">
            Missing: {missingItems.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

// --- 2. StepsList Component ---
const StepsList = ({ steps }) => (
  <div className="smart-card steps-card">
    <div className="card-header"><List size={16} /> Steps</div>
    <ol>
      {Array.isArray(steps) ? steps.map((step, idx) => (
        <li key={idx}>{step}</li>
      )) : <li>{steps}</li>}
    </ol>
  </div>
);

// --- 3. ItemsList Component (Pantry & Shopping) ---
const ItemsList = ({ title, items, type }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    const tabName = type === 'shopping' ? 'shopping' : 'pantry';
    navigate(`/dashboard?tab=${tabName}`);
  };

  return (
    <div
      className={`smart-card list-card ${type} cursor-pointer hover:shadow-md transition-all`}
      onClick={handleCardClick}
      title={`Go to ${title}`}
    >
      <div className="card-header flex justify-between">
        <div className="flex items-center gap-2">
          {type === 'shopping' ? <CheckSquare size={16} /> : <ChefHat size={16} />}
          {title}
        </div>
        <ArrowRight size={14} className="text-gray-400" />
      </div>

      <div className="tags-container">
        {items && items.slice(0, 8).map((item, idx) => {
          const name = typeof item === 'object' ? item.item_name : item;
          const checked = typeof item === 'object' ? item.is_checked : false;
          return (
            <span key={idx} className={`tag ${checked ? 'checked' : ''}`}>
              {name}
            </span>
          );
        })}
        {items && items.length > 8 && <span className="tag more">+{items.length - 8} more</span>}
      </div>
    </div>
  );
};

// --- Main Component (Dispatcher) ---
const SmartMessageContent = ({ data }) => {
  const navigate = useNavigate();
  if (!data || !data.response_type) return null;

  switch (data.response_type) {
    case 'recipe_card':
      return <RecipeCard recipe={data.recipe_data || data.recipe} missingItems={data.missing_items} />;

    case 'steps_list':
      return <StepsList steps={data.steps} />;

    case 'pantry_list':
      return <ItemsList title="Pantry Items" items={data.pantry_items || data.pantry?.items || []} type="pantry" />;

    case 'shopping_list':
      return <ItemsList title="Shopping List" items={data.items || data.shopping?.items || []} type="shopping" />;

    case 'full_inventory':
      return (
        <div className="inventory-grid">
          <ItemsList title="Pantry" items={data.pantry?.items || []} type="pantry" />
          <ItemsList title="Shopping" items={data.shopping?.items || []} type="shopping" />
        </div>
      );

    case 'recipes_list': {
      const recipes = data.recipes || [];
      return (
        <div className="smart-card">
          <div className="card-header flex justify-between">
            <div className="flex items-center gap-2 text-green-700">
              <ChefHat size={16} /> Suggested Recipes
            </div>
            {data.count && (
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                {data.count} found
              </span>
            )}
          </div>

          <div className="favorites-scroll p-2">
            {recipes.length > 0 ? (
              recipes.map(rec => (
                <div key={rec.id} style={{ minWidth: '160px' }}>
                  <RecipeCard recipe={rec} missingItems={rec.missing_items || []} />
                </div>
              ))
            ) : (
              <p className="p-2 text-sm text-gray-500">No recipes found.</p>
            )}
          </div>
        </div>
      );
    }

    case 'favorites_list': {
      const recipesList = data.favorites?.recipes || data.recipes || [];

      return (
        <div className="smart-card favorites-card">
          <div
            className="card-header"
            onClick={() => navigate('/dashboard?tab=favorites')}
            title="View all favorites"
          >
            <div className="flex items-center gap-2 text-red-600">
              <Heart size={16} fill="currentColor" /> Your Favorites
            </div>
            <ArrowRight size={14} className="text-red-400" />
          </div>

          <div className="favorites-scroll p-2">
            {recipesList.length > 0 ? (
              recipesList.map(rec => (
                <div key={rec.id} style={{ minWidth: '160px' }}>
                  <RecipeCard recipe={rec} />
                </div>
              ))
            ) : (
              <p className="p-2 text-sm text-gray-500">No favorites yet.</p>
            )}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
};

export default SmartMessageContent;