import React, { useState, useEffect } from 'react';
import RecipeCard from '../common/RecipeCard';
import { getFavorites } from '../../utils/favoritesService';
import { HeartOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FavoritesTap = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load favorites
  useEffect(() => {
    const fetchData = async () => {
      const data = await getFavorites();

      const formattedRecipes = data.map(item => {
        let recipe = item.recipe;

        if (typeof recipe.ingredients === 'string') {
          try {
            recipe.ingredients = JSON.parse(recipe.ingredients);
          } catch (e) {
            console.log('Parsing Error in the favorites: ', e);
            
            recipe.ingredients = [];
          }
        }
        return recipe;
      });

      setFavorites(formattedRecipes);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/recipe/${id}`);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '3rem',
        color: '#6b7280'
      }}>
        Loading favorites...
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '3rem', 
        color: '#6b7280',
        height: '100%'
      }}>
        <HeartOff size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No favorites yet</h3>
        <p>Start exploring and save your best recipes here!</p>
      </div>
    );
  }


  return (
    <div className="favorites-grid">
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