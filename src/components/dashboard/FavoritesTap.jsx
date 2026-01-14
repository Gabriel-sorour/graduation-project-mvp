import React, { useState, useEffect } from 'react';
import RecipeCard from '../common/RecipeCard';
import { getFavorites } from '../../utils/favoritesService';
import { HeartOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { formatRecipe } from '../../utils/recipeUtils';

const FavoritesTap = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getFavorites(language);

        if (Array.isArray(data)) {
          const formattedRecipes = data.map(item => {
            let recipe = item.recipe || item;

            recipe.title = language === 'ar'
              ? (recipe.title_ar || recipe.title_en || recipe.title)
              : (recipe.title_en || recipe.title_ar || recipe.title);

            recipe.description = language === 'ar'
              ? (recipe.description_ar || recipe.description_en || recipe.description)
              : (recipe.description_en || recipe.description_ar || recipe.description);

            if (Array.isArray(recipe.ingredients)) {
              recipe.ingredients = recipe.ingredients.map(ing => ({
                ...ing,
                name: language === 'ar'
                  ? (ing.name_ar || ing.name_en || ing.name)
                  : (ing.name_en || ing.name_ar || ing.name)
              }));
            } else if (typeof recipe.ingredients === 'string') {
              try {
                recipe.ingredients = JSON.parse(recipe.ingredients);
              } catch (e) {
                recipe.ingredients = [];
                console.log(e);
                
              }
            }

            if (typeof recipe.steps === 'string') {
              try {
                recipe.steps = JSON.parse(recipe.steps);
              } catch (e) {
                recipe.steps = [];
                console.log(e);
              }
            }

            return formatRecipe(recipe);
          }).filter(Boolean);

          setFavorites(formattedRecipes);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  const handleCardClick = (id) => {
    navigate(`/recipe/${id}`);
  };

  const t = {
    loading: language === 'ar' ? 'جاري تحميل المفضلة...' : 'Loading favorites...',
    noFavTitle: language === 'ar' ? 'لا توجد مفضلات بعد' : 'No favorites yet',
    noFavSub: language === 'ar' ? 'ابدأ الاستكشاف واحفظ وصفاتك المفضلة هنا!' : 'Start exploring and save your best recipes here!'
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: '#6b7280' }}>
        {t.loading}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: '#6b7280', height: '100%' }}>
        <HeartOff size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{t.noFavTitle}</h3>
        <p>{t.noFavSub}</p>
      </div>
    );
  }

  return (
    <div className="favorites-grid" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {favorites.map(recipe => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onClick={handleCardClick}
        />
      ))}
    </div>
  );
};

export default FavoritesTap;