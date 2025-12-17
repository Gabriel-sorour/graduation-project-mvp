import React, { useState, useEffect } from 'react';
import { Search, X, ChefHat } from 'lucide-react';
import RecipeCard from '../components/common/RecipeCard';
import { useNavigate } from 'react-router-dom';
import '../styles/Explore.css';
import { formatRecipe } from '../utils/recipeUtils';

function Explore() {
  const navigate = useNavigate();

  const [selectedTags, setSelectedTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Backend data
  const [allIngredients, setAllIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetch Data from API
  useEffect(() => {
    // 1. Get Ingredients
    fetch('http://127.0.0.1:8000/api/ingredients')
      .then(res => res.json())
      .then(data => {
        setAllIngredients(data);
      })
      .catch(err => console.error("Error fetching ingredients:", err));
  }, []);

  // 2. Fetch Recipes 
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        let url = 'http://127.0.0.1:8000/api/recipes';
        let options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        };

        // If user selected ingredients, switch to SEARCH endpoint
        if (selectedTags.length > 0) {
          url = 'http://127.0.0.1:8000/api/recipes/search';
          options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              ingredients: selectedTags
            })
          };
        }

        const response = await fetch(url, options);
        const result = await response.json();

        // Check if response is successful
        const rawData = result.data || [];

        // --- FIX: Format recipes to ensure ingredients are Strings ---
        const formattedRecipes = rawData.map(recipe => formatRecipe(recipe));

        setRecipes(formattedRecipes);

      } catch (err) {
        console.error("Error fetching recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();

  }, [selectedTags]); // Re-run whenever selectedTags changes


  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filtered = allIngredients.filter(ing =>
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


  return (
    <>
      <title>Explore</title>

      <div className="explore-container">
        <div className="explore-header">
          <h1>Find recipes by ingredients</h1>

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
            {loading ? "Loading recipes..." :
              selectedTags.length > 0
                ? `Found ${recipes.length} recipes with your ingredients.`
                : "Showing all recipes."
            }
          </div>

          <div className="recipe-grid">
            {!loading && recipes.length > 0 ? (
              recipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={(id) => navigate(`/recipe/${id}`)}
                />
              ))
            ) : !loading && (
              <div className="no-results">
                <ChefHat size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <h3>No matching recipes</h3>
                <p>Try adding some ingredients to see more results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Explore;
