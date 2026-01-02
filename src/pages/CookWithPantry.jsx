import React, { useState, useEffect } from 'react';
import { ChefHat, AlertCircle, ArrowLeft } from 'lucide-react';
import RecipeCard from '../components/common/RecipeCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatRecipe } from '../utils/recipeUtils';
import '../styles/Explore.css';
import '../styles/CookWithPantry.css';

function CookWithPantry() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchMatches = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/recipes/match-pantry?allow_missing_one=true', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
           throw new Error('Failed to fetch matches');
        }

        const result = await response.json();
        const rawData = result.data || [];
        const formattedRecipes = rawData.map(recipe => formatRecipe(recipe));
        setRecipes(formattedRecipes);

      } catch (err) {
        console.error("Error fetching matches:", err);
        setError("Could not load your pantry matches.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();

  }, [token, navigate]);


  return (
    <div className="explore-container">
      {/* Header with Back Button */}
      <div className="explore-header" style={{ position: 'relative' }}>
        <button 
          onClick={() => navigate('/')} 
          className="cook-header-btn"
        >
          <ArrowLeft size={24} />
        </button>

        <h1>What you can cook now</h1>
        <p className="cook-header-sub">
          Based on ingredients in your pantry {user?.name ? `${user.name}` : ''}
        </p>
      </div>

      <div>
        <div className="results-info">
          {loading ? "Checking your pantry..." : 
             `Found ${recipes.length} recipes matching your ingredients.`
          }
        </div>

        {/* Error State */}
        {error && (
            <div className="no-results">
                <p className="cook-error">{error}</p>
            </div>
        )}

        <div className="recipe-grid">
          {!loading && recipes.length > 0 ? (
            recipes.map(recipe => {
              
              const isPerfectMatch = recipe.missing_count === 0;

              return (
                <div 
                  key={recipe.id} 
                  // Dynamic Class Name based on match type
                  className={`cook-card-wrapper ${isPerfectMatch ? 'match-perfect' : 'match-missing'}`}
                >
                  
                  <RecipeCard
                    recipe={recipe}
                    onClick={(id) => {
                      navigate(`/recipe/${id}`, { 
                        state: { 
                          missingIngredients: recipe.missing_ingredients || [],
                          isPantryMode: true 
                        } 
                      });
                    }}
                  />

                  {/* --- Missing Ingredient Alert --- */}
                  {!isPerfectMatch && recipe.missing_ingredients && (
                      <div className="cook-missing-alert">
                          <AlertCircle size={14} />
                          Missing: {recipe.missing_ingredients.join(', ')}
                      </div>
                  )}
                  
                  {/* --- Perfect Match Badge --- */}
                  {isPerfectMatch && (
                     <div className="cook-ready-badge">
                        Ready to Cook!
                     </div>
                  )}

                </div>
              );
            })
          ) : !loading && !error && (
            <div className="no-results">
              <ChefHat size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3>No matches found</h3>
              <p>Try adding more ingredients to your pantry!</p>
              <button 
                onClick={() => navigate('/dashboard?tab=pantry')}
                className="cook-pantry-btn"
              >
                Go to Pantry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CookWithPantry;