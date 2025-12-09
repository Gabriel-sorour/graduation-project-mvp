// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import RecipeCard from '../components/common/RecipeCard';
import { RECIPES } from '../utils/mockData'; // Data
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();

  const handleRecipeClick = (id) => {
    navigate(`/recipe/${id}`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <h1>
          Cook with what <br />
          you <span>have.</span>
        </h1>
        <p>
          Minimalist recipe finder based on your pantry.
          No clutter, just good food.
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
            onClick={() => alert('Randomizer coming soon!')}
          >
            Surprise Me
          </button>
        </div>
      </section>

      {/* Featured Recipes Grid */}
      <section className="home-content">
        <div className="container">
          <div className="recipe-grid">
            {RECIPES.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={handleRecipeClick}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;