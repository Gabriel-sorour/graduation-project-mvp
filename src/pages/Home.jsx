import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/common/RecipeCard';
import '../styles/Home.css';
import { formatRecipe } from '../utils/recipeUtils';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';
import { useAlert } from '../context/AlertContext';

function Home() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [surpriseLoading, setSurpriseLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/recipes')
      .then(response => response.json())
      .then(data => {
        const formattedRecipes = data.data.map(recipe => formatRecipe(recipe));
        setRecipes(formattedRecipes.slice(3,6 ));
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (recipes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % recipes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [recipes.length, currentSlide]); 


  const handleRecipeClick = (id) => {
    navigate(`/recipe/${id}`);
  };

  const { showAlert } = useAlert();
  const handleSurpriseMe = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setSurpriseLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/recipes/surprise-me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseData = await response.json();
      if (responseData.status === 'fail') {
        showAlert("Note", responseData.message);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch surprise recipe');
      }

      const surpriseRecipe = responseData.data;

      if (surpriseRecipe && surpriseRecipe.id) {
        navigate(`/recipe/${surpriseRecipe.id}`, {
          state: {
            missingIngredients: surpriseRecipe.missing_ingredients || [],
            isPantryMode: true,
            isSurprise: true
          }
        });
      } else {
        showAlert("No recipes found!");
      }

    } catch (error) {
      console.error("Surprise Me Error:", error);
      showAlert("Something went wrong. Please try again.");
    } finally {
      setSurpriseLoading(false);
    }
  };

  return (
    <>
      <title>Home</title>

      <div className="home-page">
        {/* Hero Section  */}
        <section className="hero">
          <h1>Cook with what <br /> you <span>have.</span></h1>
          <p>
            Minimalist recipe finder based on your pantry. No clutter, just good food.
          </p>
          <div className="hero-buttons">
            <button
              className="btn-secondary btn-large"
              onClick={() => navigate('/explore')}
            >
              Explore Recipes
            </button>
            <button
              className="btn-large cook-btn"
              onClick={() => navigate('/cook-now')}
            >
              Cook with what I have
            </button>
            <button
              className="btn-secondary btn-large surprise-btn"
              onClick={handleSurpriseMe}
              disabled={surpriseLoading}
              style={{ minWidth: '160px' }}
            >
              {surpriseLoading ? 'Cooking...' : 'Surprise Me'}
              <Sparkles size={16} />
            </button>
          </div>
        </section>

        <section className="home-content">
          <div className="container">

            <h2 style={{ color: 'var(--text-color)', textAlign: 'center', padding: '1rem' }}>
              Trending Now
            </h2>

            {loading ? (
              <div className="loading-placeholder">
                <div className="spinner"></div>
                <p>Curating best recipes for you...</p>
              </div>
            ) : (
              <div className="slider-wrapper">
                <div 
                  className="recipe-grid slider-track"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {recipes.map(recipe => (
                    <div key={recipe.id} className="slide-item">
                      <RecipeCard
                        recipe={recipe}
                        onClick={handleRecipeClick}
                      />
                    </div>
                  ))}
                </div>

                <div className="slider-dots">
                  {recipes.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`dot ${currentSlide === idx ? 'active' : ''}`}
                      onClick={() => setCurrentSlide(idx)}
                    ></span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;