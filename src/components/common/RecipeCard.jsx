import React from 'react';
import { Clock, Flame, Star } from 'lucide-react';
import '../../styles/RecipeCard.css';

function RecipeCard({ recipe, onClick }) {
  return (
    <div className="recipe-card" onClick={() => onClick(recipe.id)}>
      <div className="card-image-wrapper">
        <img src={recipe.image} alt={recipe.title} className="card-image" />
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