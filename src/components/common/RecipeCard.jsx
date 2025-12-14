import React, { useState, useEffect } from 'react';
import { Clock, Flame, Heart } from 'lucide-react';
import { checkIsFavorite, toggleFavorite } from '../../utils/favoritesService';
import '../../styles/RecipeCard.css';

function RecipeCard({ recipe, onClick }) {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      const status = await checkIsFavorite(recipe.id);
      setIsLiked(status);
    };

    fetchFavoriteStatus();
  }, [recipe.id]);

  const handleToggleLike = async (e) => {
    e.stopPropagation();
    
    // Pass recipe.id and current state, wait for API result
    const newStatus = await toggleFavorite(recipe.id, isLiked);
    setIsLiked(newStatus);
  };

  return (
    <div className="recipe-card" onClick={() => onClick(recipe.id)}>
      <div className="card-image-wrapper">
        <img
          src={`http://127.0.0.1:8000/${recipe.image}`}
          alt={recipe.title}
          className="card-image"
        />

        {/* Like Button */}
        <button
          className="card-like-btn"
          onClick={handleToggleLike}
        >
          <Heart
            size={18}
            fill={isLiked ? "#ef4444" : "none"}
            color={isLiked ? "#ef4444" : "#6b7280"}
          />
        </button>

        <div className="card-badge">
          <Clock size={12} /> {recipe.time}
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{recipe.title}</h3>
        
        {/* Show first 3 ingredients */}
        <div className="card-tags">
          {recipe.ingredients.slice(0, 3).map((ing, index) => (
            <span key={index} className="tag">{ing}</span>
          ))}
          {recipe.ingredients.length > 3 && (
            <span className="tag">+{recipe.ingredients.length - 3} more</span>
          )}
        </div>

        <div className="card-footer">
          <span className="footer-item"><Flame size={14} /> {recipe.calories}</span>
          <span className={`footer-item ${recipe.difficulty === 'Easy' ? 'text-green-600' : 'text-yellow-600'}`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;