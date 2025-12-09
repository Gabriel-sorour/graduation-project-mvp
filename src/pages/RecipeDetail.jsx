import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, Flame, ChefHat } from 'lucide-react';
import { RECIPES } from '../utils/mockData';
import '../styles/RecipeDetail.css';

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = RECIPES.find(r => r.id === parseInt(id));

  // Handle the not found recipe
  if (!recipe) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Recipe not found</h2>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '1rem' }}>
          Go Home
        </button>
      </div>
    );
  }


  return (
    <div className="recipe-detail container">
      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ChevronLeft size={20} /> Back
        </button>
      </div>

      <div className="recipe-content">
        {/* Left: Visuals */}
        <div className="recipe-visuals">
          <img src={recipe.image} alt={recipe.title} className="detail-image" />

          <div className="recipe-meta">
            <span className="meta-item"><Clock size={18} /> {recipe.time}</span>
            <span className="meta-item"><Flame size={18} /> {recipe.calories}</span>
            <span className="meta-item" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              {recipe.difficulty}
            </span>
          </div>
        </div>

        {/* Right: Instructions */}
        <div className="recipe-info">
          <h1 className="recipe-title">{recipe.title}</h1>

          <div>
            <h3 className="section-heading">Ingredients</h3>
            <ul className="ingredient-list">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="ingredient-item">{ing}</li>
              ))}
            </ul>
          </div>

          <div className="instructions-div">
            <h3 className="section-heading">Instructions</h3>
            <div className="steps-list">
              {recipe.steps.map((step, idx) => (
                <div key={idx} className="step-item">
                  <span className="step-number">{idx + 1}</span>
                  <p className="step-text">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
