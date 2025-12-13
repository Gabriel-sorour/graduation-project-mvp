import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, Flame } from 'lucide-react';
import '../styles/RecipeDetail.css';
import { formatRecipe } from '../utils/recipeUtils'; // 1. Import Utility

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/recipes/${id}`)
      .then(res => res.json())
      .then(data => {

        // Handle if data is wrapped in { data: ... } or comes directly
        const rawRecipe = data.data || data;

        // 2. Use Utility function for Ingredients
        let formattedRecipe = formatRecipe(rawRecipe);

        // 3. Ensure steps are parsed (if not handled by utility yet)
        if (typeof formattedRecipe.steps === 'string') {
          try {
            formattedRecipe.steps = JSON.parse(formattedRecipe.steps);
          } catch (e) {
            console.log("Error", e);

            formattedRecipe.steps = [];
          }
        }

        setRecipe(formattedRecipe);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div
        className="container"
        style={{ padding: '4rem', textAlign: 'center' }}
      >
        Loading details...
      </div>
    );

  if (!recipe) {
    return (
      <div
        className="container"
        style={{ padding: '4rem', textAlign: 'center' }}
      >
        <h2>Recipe not found</h2>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '1rem' }}>Go Home</button>
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
          <img src={`http://127.0.0.1:8000/${recipe.image}`} alt={recipe.title} className="detail-image" />
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
              {recipe.ingredients && recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="ingredient-item">{ing}</li>
              ))}
            </ul>
          </div>

          <div className='instructions-div'>
            <h3 className="section-heading">Instructions</h3>
            <div className="steps-list">
              {recipe.steps && recipe.steps.map((step, idx) => (
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