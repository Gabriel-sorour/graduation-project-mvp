import React, { useState, useEffect, useRef } from 'react';
import { ChefHat, AlertCircle, ArrowLeft, Filter, ChevronDown, Check } from 'lucide-react';
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

  // --- Filter States ---
  const [filters, setFilters] = useState({
    category: '',
    meal_type: '',
    temperature: ''
  });
  const [openFilter, setOpenFilter] = useState(null);
  const filterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenFilter(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchMatches = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = new URL('http://127.0.0.1:8000/api/recipes/match-pantry');
        url.searchParams.append('allow_missing_one', 'true');

        if (filters.category) url.searchParams.append('category', filters.category);
        if (filters.meal_type) url.searchParams.append('meal_type', filters.meal_type);
        if (filters.temperature) url.searchParams.append('temperature', filters.temperature);

        const response = await fetch(url.toString(), {
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

  }, [token, navigate, filters]);

  // --- Filter Helpers ---
  const toggleFilter = (filterName) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  const selectFilterOption = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setOpenFilter(null);
  };

  const resetFilters = () => {
    setFilters({ category: '', meal_type: '', temperature: '' });
    setOpenFilter(null);
  };

  const filterOptions = {
    category: [
      { label: 'All Categories', value: '' },
      { label: 'Meal', value: 'meal' },
      { label: 'Drink', value: 'drink' },
      { label: 'Snack', value: 'snack' }
    ],
    meal_type: [
      { label: 'All Types', value: '' },
      { label: 'Breakfast', value: 'breakfast' },
      { label: 'Lunch', value: 'lunch' },
      { label: 'Dinner', value: 'dinner' }
    ],
    temperature: [
      { label: 'Any Temp', value: '' },
      { label: 'Hot', value: 'hot' },
      { label: 'Cold', value: 'cold' }
    ]
  };


  return (
    <div className="explore-container">
      
      {/* 1. Header Section (Independant) */}
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

      {/* 2. Filters Section (Separated Container) */}
      <div 
        className="filters-container" 
        ref={filterRef} 
        style={{ marginTop: '10px', marginBottom: '20px', padding: 0, boxShadow: 'none', background: 'transparent' }}
      >
        <div className="filter-group">
          <Filter size={18} className="filter-icon" />

          {/* Category */}
          <div className="custom-select-wrapper">
            <button
              className={`filter-chip ${filters.category ? 'active' : ''}`}
              onClick={() => toggleFilter('category')}
            >
              {filters.category ?
                filterOptions.category.find(o => o.value === filters.category)?.label
                : "Category"}
              <ChevronDown size={14} />
            </button>

            {openFilter === 'category' && (
              <div className="custom-dropdown-menu">
                {filterOptions.category.map((opt) => (
                  <div
                    key={opt.value}
                    className={`custom-option ${filters.category === opt.value ? 'selected' : ''}`}
                    onClick={() => selectFilterOption('category', opt.value)}
                  >
                    {opt.label}
                    {filters.category === opt.value && <Check size={14} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Meal Type */}
          <div className="custom-select-wrapper">
            <button
              className={`filter-chip ${filters.meal_type ? 'active' : ''}`}
              onClick={() => toggleFilter('meal_type')}
            >
              {filters.meal_type ?
                filterOptions.meal_type.find(o => o.value === filters.meal_type)?.label
                : "Meal Type"}
              <ChevronDown size={14} />
            </button>

            {openFilter === 'meal_type' && (
              <div className="custom-dropdown-menu">
                {filterOptions.meal_type.map((opt) => (
                  <div
                    key={opt.value}
                    className={`custom-option ${filters.meal_type === opt.value ? 'selected' : ''}`}
                    onClick={() => selectFilterOption('meal_type', opt.value)}
                  >
                    {opt.label}
                    {filters.meal_type === opt.value && <Check size={14} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Temperature */}
          <div className="custom-select-wrapper">
            <button
              className={`filter-chip ${filters.temperature ? 'active' : ''}`}
              onClick={() => toggleFilter('temperature')}
            >
              {filters.temperature ?
                filterOptions.temperature.find(o => o.value === filters.temperature)?.label
                : "Temperature"}
              <ChevronDown size={14} />
            </button>

            {openFilter === 'temperature' && (
              <div className="custom-dropdown-menu">
                {filterOptions.temperature.map((opt) => (
                  <div
                    key={opt.value}
                    className={`custom-option ${filters.temperature === opt.value ? 'selected' : ''}`}
                    onClick={() => selectFilterOption('temperature', opt.value)}
                  >
                    {opt.label}
                    {filters.temperature === opt.value && <Check size={14} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {(filters.category || filters.meal_type || filters.temperature) && (
          <button className="reset-filters-btn" onClick={resetFilters}>
            Reset
          </button>
        )}
      </div>

      {/* 3. Results Section */}
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