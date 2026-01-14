import React, { useState, useEffect } from 'react';
import { Clock, Flame, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { checkIsFavorite, toggleFavorite } from '../../utils/favoritesService';
import '../../styles/RecipeCard.css';

function RecipeCard({ recipe, onClick }) {
  const [isLiked, setIsLiked] = useState(false);
  
  // Hooks
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      const status = await checkIsFavorite(recipe.id, language);
      setIsLiked(status);
    };

    fetchFavoriteStatus();
  }, [recipe.id, language]);

  const handleToggleLike = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const newStatus = await toggleFavorite(recipe.id, isLiked, language);
    setIsLiked(newStatus);
  };

  const t = {
    more: language === 'ar' ? 'أخرى' : 'more'
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
          title={isLiked ? (language === 'ar' ? "إزالة من المفضلة" : "Remove from favorites") : (language === 'ar' ? "إضافة للمفضلة" : "Add to favorites")}
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
        
        {/* Ingredients Tags */}
        <div className="card-tags">
          {(recipe.ingredients || []).slice(0, 3).map((ing, index) => (
            <span key={index} className="tag">
              {typeof ing === 'object' ? (ing.name || ing.item_name) : ing}
            </span>
          ))}
          
          {(recipe.ingredients || []).length > 3 && (
            <span className="tag">
               +{(recipe.ingredients || []).length - 3} {t.more}
            </span>
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