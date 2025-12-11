import React, { useState } from 'react';
import { Search, X, ChefHat } from 'lucide-react';
import RecipeCard from '../components/common/RecipeCard';
import { RECIPES } from '../utils/mockData';
import { ALL_INGREDIENTS } from '../utils/allIngredients'; // Mock Data
import { useNavigate } from 'react-router-dom';
import '../styles/Explore.css';

function Explore() {
  const navigate = useNavigate();

  const [selectedTags, setSelectedTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);


  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filtered = ALL_INGREDIENTS.filter(ing =>
        ing.toLowerCase().includes(value.toLowerCase()) &&
        !selectedTags.includes(ing)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };


  const addTag = (ingredient) => {
    setSelectedTags([...selectedTags, ingredient]);
    setInputValue('');
    setSuggestions([]);
  };


  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  // Results Logic 
  const filteredRecipes = RECIPES.filter(recipe => {

    if (selectedTags.length === 0) return true;

    const hasAllIngredients = selectedTags.every(tag =>
      recipe.ingredients.some(recipeIng => recipeIng.toLowerCase().includes(tag.toLowerCase()))
    );

    return hasAllIngredients;
  });

  return (
    <div className="explore-container">
      <div className="explore-header">
        <h1>Find recipes by ingredients</h1>
        {/* <p>What do you have in your kitchen?</p> */}

        {/* Multi-select Search Component */}
        <div className="search-wrapper">
          <div className="search-box-container">

            {selectedTags.map((tag, index) => (
              <div key={index} className="search-tag">
                {tag}
                <span className="tag-remove" onClick={() => removeTag(tag)}>
                  <X size={14} />
                </span>
              </div>
            ))}


            <input
              type="text"
              className="search-input-transparent"
              placeholder={selectedTags.length === 0 ? "Type an ingredient (e.g. Tomato)..." : ""}
              value={inputValue}
              onChange={handleInputChange}
            />


            <Search className='search-icon-fixed ' color="var(--gray)" size={20} />
          </div>


          {suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  onClick={() => addTag(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


      <div>
        <div className="results-info">
          {selectedTags.length > 0
            ? `Found ${filteredRecipes.length} recipes with your ingredients.`
            : "Showing all recipes."
          }
        </div>

        <div className="recipe-grid">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={(id) => navigate(`/recipe/${id}`)}
              />
            ))
          ) : (
            <div className="no-results">
              <ChefHat size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3>No matching recipes</h3>
              <p>Try removing some ingredients to see more results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Explore;
