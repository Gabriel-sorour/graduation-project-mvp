import React, { useState, useEffect } from 'react';
import RecipeCard from '../common/RecipeCard';
import { getFavorites } from '../../utils/favoritesService';
import { HeartOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FavoritesTap = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  // Load favorites
  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleCardClick = (id) => {
    navigate(`/recipe/${id}`);
  };


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
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
      gap: '1.5rem',
      padding: '1rem' 
    }}>
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