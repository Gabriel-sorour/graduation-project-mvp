import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Flame, ChefHat, CheckSquare, List, Heart, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// --- 1. RecipeCard Component ---
const RecipeCard = ({ recipe, missingItems, onInteract }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleClick = (e) => {
    e.stopPropagation();
    if (recipe && recipe.id) {
      const isPantryMode = Array.isArray(missingItems);
      const navigationState = {
        isPantryMode: isPantryMode,
        missingIngredients: missingItems || []
      };
      navigate(`/recipe/${recipe.id}`, { state: navigationState });
      if (onInteract) onInteract();
    }
  };

  const t = {
    missing: language === 'ar' ? 'ينقصك: ' : 'Missing: '
  };

  // Logic to handle title_ar or title_en based on context
  const displayTitle = language === 'ar' ? (recipe.title_ar || recipe.title) : (recipe.title_en || recipe.title);
  
  // Logic to handle image URL correctly
  const displayImage = recipe.image ? 
    (recipe.image.startsWith('http') ? recipe.image : `http://127.0.0.1:8000/${recipe.image}`) : 
    '/placeholder-food.jpg';

  return (
    <div
      className="smart-card recipe-card hover:shadow-md cursor-pointer transition-transform hover:-translate-y-1"
      onClick={handleClick}
      title={language === 'ar' ? "عرض التفاصيل" : "View Recipe Details"}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <img
        src={displayImage}
        alt={displayTitle}
        className="recipe-img"
      />
      <div className="recipe-details">
        <h4>{displayTitle}</h4>
        <div className="recipe-meta">
          <span><Clock size={14} /> {recipe.time}</span>
          <span><Flame size={14} /> {recipe.calories}</span>
        </div>

        {Array.isArray(missingItems) && missingItems.length > 0 && (
          <div className="missing-alert">
            {t.missing} {missingItems.join('، ')}
          </div>
        )}
      </div>
    </div>
  );
};

// --- 2. StepsList Component ---
const StepsList = ({ steps }) => {
  const { language } = useLanguage();

  return (
    <div className="smart-card steps-card" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="card-header">
        <List size={16} /> {language === 'ar' ? 'الخطوات' : 'Steps'}
      </div>
      <ol style={{ paddingRight: language === 'ar' ? '1.5rem' : '0', paddingLeft: language === 'ar' ? '0' : '1.5rem' }}>
        {Array.isArray(steps) ? steps.map((step, idx) => (
          <li key={idx}>{step}</li>
        )) : <li>{steps}</li>}
      </ol>
    </div>
  );
};

// --- 3. ItemsList Component (Pantry & Shopping) ---
const ItemsList = ({ title, items, type, onInteract }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleCardClick = () => {
    const tabName = type === 'shopping' ? 'shopping' : 'pantry';
    navigate(`/dashboard?tab=${tabName}`);
    if (onInteract) onInteract();
  };

  const t = {
    more: language === 'ar' ? 'المزيد' : 'more'
  };

  return (
    <div
      className={`smart-card list-card ${type} cursor-pointer hover:shadow-md transition-all`}
      onClick={handleCardClick}
      title={title} 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="card-header flex justify-between">
        <div className="flex items-center gap-2">
          {type === 'shopping' ? <CheckSquare size={16} /> : <ChefHat size={16} />}
          {title}
        </div>
        <ArrowRight size={14} className={`text-gray-400 ${language === 'ar' ? 'rotate-180' : ''}`} />
      </div>

      <div className="tags-container">
        {items && items.slice(0, 8).map((item, idx) => {
          const name = typeof item === 'object' ? (item.item_name || item.name) : item;
          const checked = typeof item === 'object' ? item.is_checked : false;
          return (
            <span key={idx} className={`tag ${checked ? 'checked' : ''}`}>
              {name}
            </span>
          );
        })}
        {items && items.length > 8 && (
          <span className="tag more">+{items.length - 8} {t.more}</span>
        )}
      </div>
    </div>
  );
};

// --- Main Component (Dispatcher) ---
const SmartMessageContent = ({ data, onInteract }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  if (!data || !data.response_type) return null;

  const t = {
    pantryItems: language === 'ar' ? 'عناصر المخزن' : 'Pantry Items',
    shoppingList: language === 'ar' ? 'قائمة التسوق' : 'Shopping List',
    pantry: language === 'ar' ? 'المخزن' : 'Pantry',
    shopping: language === 'ar' ? 'التسوق' : 'Shopping',
    suggested: language === 'ar' ? 'وصفات مقترحة' : 'Suggested Recipes',
    favorites: language === 'ar' ? 'مفضلاتك' : 'Your Favorites',
    found: language === 'ar' ? 'وصفة' : 'found',
    noRecipes: language === 'ar' ? 'لا توجد وصفات.' : 'No recipes found.',
    noFavs: language === 'ar' ? 'لا توجد مفضلات.' : 'No favorites yet.',
    viewAllFav: language === 'ar' ? 'عرض كل المفضلة' : 'View all favorites'
  };

  switch (data.response_type) {
    case 'recipe_card':
      return <RecipeCard recipe={data.recipe} missingItems={data.missing_items} onInteract={onInteract} />;

    case 'steps_list':
      return <StepsList steps={data.steps} />;

    case 'pantry_list':
      return <ItemsList title={t.pantryItems} items={data.pantry?.items || []} type="pantry" onInteract={onInteract} />;

    case 'shopping_list':
      return <ItemsList title={t.shoppingList} items={data.shopping?.items || []} type="shopping" onInteract={onInteract} />;

    case 'full_inventory':
      return (
        <div className="inventory-grid" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <ItemsList title={t.pantry} items={data.pantry?.items || []} type="pantry" onInteract={onInteract} />
          <ItemsList title={t.shopping} items={data.shopping?.items || []} type="shopping" onInteract={onInteract} />
        </div>
      );

    case 'recipes_list': {
      const recipes = data.recipes || [];
      return (
        <div className="smart-card" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div className="card-header flex justify-between">
            <div className="flex items-center gap-2 text-green-700">
              <ChefHat size={16} /> {t.suggested}
            </div>
            {data.count && (
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                {data.count} {t.found}
              </span>
            )}
          </div>

          <div className="favorites-scroll p-2">
            {recipes.length > 0 ? (
              recipes.map(rec => (
                <div key={rec.id} style={{ minWidth: '160px' }}>
                  <RecipeCard recipe={rec} missingItems={rec.missing_items || []} onInteract={onInteract} />
                </div>
              ))
            ) : (
              <p className="p-2 text-sm text-gray-500">{t.noRecipes}</p>
            )}
          </div>
        </div>
      );
    }

    case 'favorites_list': {
      const recipesList = data.favorites?.recipes || data.recipes || [];

      return (
        <div className="smart-card favorites-card" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div
            className="card-header"
            onClick={() => {
              navigate('/dashboard?tab=favorites');
              if (onInteract) onInteract();
            }}
            title={t.viewAllFav}
          >
            <div className="flex items-center gap-2 text-red-600">
              <Heart size={16} fill="currentColor" /> {t.favorites}
            </div>
            <ArrowRight size={14} className={`text-red-400 ${language === 'ar' ? 'rotate-180' : ''}`} />
          </div>

          <div className="favorites-scroll p-2">
            {recipesList.length > 0 ? (
              recipesList.map(rec => (
                <div key={rec.id} style={{ minWidth: '160px' }}>
                  <RecipeCard recipe={rec} onInteract={onInteract} />
                </div>
              ))
            ) : (
              <p className="p-2 text-sm text-gray-500">{t.noFavs}</p>
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