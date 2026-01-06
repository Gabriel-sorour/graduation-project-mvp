import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/common/RecipeCard';
import '../styles/Home.css';
import { formatRecipe } from '../utils/recipeUtils';
import { useAuth } from '../context/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // حالة تحميل خاصة لزرار Surprise Me
  const [surpriseLoading, setSurpriseLoading] = useState(false); 

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/recipes')
      .then(response => response.json())
      .then(data => {
        // تنسيق الوصفات للتأكد من أن المكونات Strings
        const formattedRecipes = data.data.map(recipe => formatRecipe(recipe));
        // عرض أول 3 وصفات فقط
        setRecipes(formattedRecipes.slice(13, 16));
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      });
  }, []);

  const handleRecipeClick = (id) => {
    navigate(`/recipe/${id}`);
  };

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

      if (!response.ok) {
        throw new Error('Failed to fetch surprise recipe');
      }

      const responseData = await response.json();
      const surpriseRecipe = responseData.data;

      if (surpriseRecipe && surpriseRecipe.id) {
        navigate(`/recipe/${surpriseRecipe.id}`, { 
          state: { 
            missingIngredients: surpriseRecipe.missing_ingredients || [], 
            isPantryMode: true ,
            isSurprise: true
          } 
        });
      } else {
        alert("No recipes found!");
      }

    } catch (error) {
      console.error("Surprise Me Error:", error);
      alert("Something went wrong. Please try again.");
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
              className="btn-primary btn-large"
              onClick={() => navigate('/cook-now')}
            >
              Cook with what I have
            </button>
            <button
              className="btn-secondary btn-large"
              onClick={handleSurpriseMe}
              disabled={surpriseLoading}
              style={{ minWidth: '160px' }}
            >
              {surpriseLoading ? 'Cooking...' : 'Surprise Me'}
            </button>
          </div>
        </section>

        {/* Featured Recipes Grid */}
        <section className="home-content">
          <div className="container">

            <h2 style={{ color: 'var(--text-color)', textAlign: 'center', padding: '1rem' }}>
              Trending Now
            </h2>

            {loading ? (
              <p style={{ textAlign: 'center', padding: '2rem' }}>
                Loading recipes...
              </p>
            ) : (
              <div className="recipe-grid">
                {recipes.map(recipe => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={handleRecipeClick}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;