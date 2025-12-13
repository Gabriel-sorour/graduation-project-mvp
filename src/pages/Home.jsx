import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/common/RecipeCard';
import '../styles/Home.css';
import { formatRecipe } from '../utils/recipeUtils';

function Home() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/recipes')
      .then(response => response.json())
      .then(data => {

        // --- FIX: Format recipes to ensure ingredients are Strings ---
        const formattedRecipes = data.data.map(recipe => formatRecipe(recipe));


        // Show only first 3 recipes
        setRecipes(formattedRecipes.slice(0, 3));
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
              className="btn-primary btn-large"
              onClick={() => navigate('/explore')}
            >
              Explore Recipes
            </button>
            <button
              className="btn-secondary btn-large"
              onClick={() => alert('Coming soon!')}
            >
              Surprise Me
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