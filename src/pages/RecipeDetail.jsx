import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Clock, Flame, Heart, Plus, Check, AlertCircle, Sparkles } from 'lucide-react'; // ضفت Sparkles
import { formatRecipe } from '../utils/recipeUtils';
import { checkIsFavorite, toggleFavorite } from '../utils/favoritesService';
import { addItem } from '../utils/shoppingService';
import { useAuth } from '../context/AuthContext';
import '../styles/RecipeDetail.css';

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // 1. Get Pantry State if available
  const missingIngredients = location.state?.missingIngredients || [];
  const isPantryMode = location.state?.isPantryMode || false;
  const isSurprise = location.state?.isSurprise || false;

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [addedIngredients, setAddedIngredients] = useState({});

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/recipes/${id}`)
      .then(res => res.json())
      .then(async (data) => {
        const rawRecipe = data.data || data;
        let formattedRecipe = formatRecipe(rawRecipe);

        if (typeof formattedRecipe.steps === 'string') {
          try {
            formattedRecipe.steps = JSON.parse(formattedRecipe.steps);
          } catch (e) {
            console.log("Error parsing steps", e);
            formattedRecipe.steps = [];
          }
        }

        setRecipe(formattedRecipe);
        
        const status = await checkIsFavorite(formattedRecipe.id);
        setIsLiked(status);
        
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // Handle Click (Like)
  const handleToggleLike = async () => {

    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (recipe) {
      const newStatus = await toggleFavorite(recipe.id, isLiked);
      setIsLiked(newStatus);
    }
  };

  // Handle Add to Shopping List
  const handleAddToShopping = async (ingredient) => {

    if (!user) {
        navigate('/login', { state: { from: location } });
        return;
    }

    if (addedIngredients[ingredient]) return;

    const result = await addItem(ingredient);
    if (result) {
      setAddedIngredients(prev => ({ ...prev, [ingredient]: true }));
    }
  };

  const getDifficultyClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'medium': return 'diff-medium';
      case 'hard': return 'diff-hard';
      default: return 'diff-easy';
    }
  };

  // Helper to check ingredient status
  const checkIngredientStatus = (ingredientName) => {
    if (!isPantryMode) return 'neutral';
    
    const nameStr = typeof ingredientName === 'object' ? ingredientName.name : ingredientName;
    const cleanName = nameStr.toLowerCase().trim();
    
    const isMissing = missingIngredients.some(missing => 
      cleanName.includes(missing.toLowerCase()) || missing.toLowerCase().includes(cleanName)
    );

    return isMissing ? 'missing' : 'available';
  };

  if (loading)
    return (
      <div className="container status-container">
        Loading details...
      </div>
    );

  if (!recipe) {
    return (
      <div className="container status-container">
        <h2>Recipe not found</h2>
        <button onClick={() => navigate('/')} className="btn-primary home-btn">Go Home</button>
      </div>
    );
  }

  return (
    <>
    <title>{recipe.title}</title>

    <div className="recipe-detail container">
      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ChevronLeft size={20} /> Back
        </button>
      </div>

      <div className="recipe-content">
        {/* Left: Visuals */}
        <div className="recipe-visuals" style={{ position: 'relative' }}>
          
          <img 
            src={`http://127.0.0.1:8000/${recipe.image}`} 
            alt={recipe.title} 
            className={`detail-image ${isSurprise ? 'surprise-glow' : ''}`} 
          />
          
          <button className="detail-like-btn" onClick={handleToggleLike}>
             <Heart size={24} fill={isLiked ? "#ef4444" : "none"} color={isLiked ? "#ef4444" : "#6b7280"} />
          </button>

          <div className="recipe-meta">
            <span className="meta-item"><Clock size={18} /> {recipe.time}</span>
            <span className="meta-item"><Flame size={18} /> {recipe.calories}</span>
            <span className={`meta-item difficulty-text ${getDifficultyClass(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          </div>
        </div>

        {/* Right: Instructions */}
        <div className="recipe-info">
          
          {isSurprise && (
            <div className="surprise-badge">
              <Sparkles size={16} fill="white" />
              Chef's Surprise Pick
            </div>
          )}

          <h1 className="recipe-title">{recipe.title}</h1>

          <div>
            <h3 className="section-heading">Ingredients</h3>
            <ul className="ingredient-list">
              {recipe.ingredients && recipe.ingredients.map((ing, idx) => {
                
                const ingName = typeof ing === 'object' ? ing.name : ing;
                const status = checkIngredientStatus(ingName);
                
                let itemStyle = {};
                if (status === 'missing') {
                    itemStyle = { backgroundColor: '#fff5eaff', color: '#f34510ff', border: '1px solid #fca5a5' };
                } else if (status === 'available') {
                    itemStyle = { backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #86efac' };
                }

                return (
                    <li key={idx} className="ingredient-item" style={itemStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {status === 'missing' && <AlertCircle size={16} />}
                        {status === 'available' && <Check size={16} />}
                        <span>{ingName}</span>
                    </div>
                    
                    {/* Only show Add button if ingredient is NOT available */}
                    {status !== 'available' && (
                        <button 
                            className={`add-ing-btn ${addedIngredients[ingName] ? 'added' : ''}`}
                            onClick={() => handleAddToShopping(ingName)}
                            title={addedIngredients[ingName] ? "Added to list" : "Add to Shopping List"}
                        >
                            {addedIngredients[ingName] ? <Check size={16} /> : <Plus size={16} />}
                        </button>
                    )}
                    </li>
                );
              })}
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
    </>
  );
}

export default RecipeDetail;