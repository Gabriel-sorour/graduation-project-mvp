import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChefHat, Filter, ChevronDown, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import RecipeCard from '../components/common/RecipeCard';
import { useNavigate } from 'react-router-dom';
import '../styles/Explore.css';
import { formatRecipe } from '../utils/recipeUtils';

function Explore() {
  const navigate = useNavigate();

  // --- Search & Filter States ---
  const [selectedTags, setSelectedTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const [filters, setFilters] = useState({
    category: '',
    meal_type: '',
    temperature: ''
  });
  const [openFilter, setOpenFilter] = useState(null);
  const filterRef = useRef(null);

  // --- Data & Pagination States ---
  const [allIngredients, setAllIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New States for Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Close filters on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenFilter(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Fetch Ingredients (Once)
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/ingredients')
      .then(res => res.json())
      .then(data => {
        setAllIngredients(data);
      })
      .catch(err => console.error("Error fetching ingredients:", err));
  }, []);

  // 2. Fetch Recipes (Triggered by Filters, Tags, or Page Change)
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        let url = new URL('http://127.0.0.1:8000/api/recipes');
        
        const hasFilters = filters.category || filters.meal_type || filters.temperature;

        // تحديد الـ Endpoint (بحث ولا عرض عادي)
        if (selectedTags.length > 0 || hasFilters) {
          url = new URL('http://127.0.0.1:8000/api/recipes/search');
          
          if (selectedTags.length > 0) {
            url.searchParams.append('ingredients', selectedTags.join(','));
          }
          if (filters.category) url.searchParams.append('category', filters.category);
          if (filters.meal_type) url.searchParams.append('meal_type', filters.meal_type);
          if (filters.temperature) url.searchParams.append('temperature', filters.temperature);
        }

        // إضافة رقم الصفحة للريكويست
        url.searchParams.append('page', currentPage);

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        
        // --- تصحيح قراءة البيانات بناءً على الـ JSON المرسل ---
        // result هو الأوبجيكت الرئيسي اللي فيه current_page و data (Array)
        
        const rawRecipes = result.data || []; // المصفوفة موجودة مباشرة في result.data
        const lastPageNum = result.last_page || 1; // رقم آخر صفحة موجود مباشرة في result.last_page
        
        const formattedRecipes = rawRecipes.map(recipe => formatRecipe(recipe));

        setRecipes(formattedRecipes);
        setLastPage(lastPageNum);

      } catch (err) {
        console.error("Error fetching recipes:", err);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();

  }, [selectedTags, filters, currentPage]);


  // --- Event Handlers ---

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
    setCurrentPage(1); // Reset page on new search
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
    setCurrentPage(1); // Reset page on change
  };

  // --- Filter Logic ---
  const toggleFilter = (filterName) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  const selectFilterOption = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setOpenFilter(null);
    setCurrentPage(1); // Reset page on filter change
  };

  const resetFilters = () => {
    setFilters({ category: '', meal_type: '', temperature: '' });
    setOpenFilter(null);
    setCurrentPage(1); // Reset page on reset
  };

  // --- Pagination Logic ---
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    <>
      <title>Explore</title>

      <div className="explore-container">
        <div className="explore-header">
          <p className='find-p'>Find recipes by ingredients & filters</p>

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

          {/* --- Custom Filters Section --- */}
          <div className="filters-container" ref={filterRef}>
            <div className="filter-group">
              <Filter size={18} className="filter-icon" />

              {/* Category Dropdown */}
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

              {/* Meal Type Dropdown */}
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

              {/* Temperature Dropdown */}
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
        </div>


        <div>
          <div className="results-info">
            {loading ? "Loading recipes..." :
              (selectedTags.length > 0 || filters.category || filters.meal_type || filters.temperature)
                ? `Showing page ${currentPage} of ${lastPage}`
                : `Showing all recipes (Page ${currentPage})`
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
                <p>Try adjusting your ingredients or filters.</p>
              </div>
            )}
          </div>

          {/* --- Numbered Pagination Controls --- */}
          {!loading && recipes.length > 0 && lastPage > 1 && (
              <div className="pagination-container">
                  {/* Previous Button */}
                  <button 
                    className="page-nav-btn" 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    title="Previous Page"
                  >
                      <ChevronLeft size={20} />
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="page-numbers">
                    {Array.from({ length: lastPage }, (_, i) => i + 1).map((pageNum) => (
                        <button
                            key={pageNum}
                            className={`page-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                            onClick={() => handlePageChange(pageNum)}
                        >
                            {pageNum}
                        </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button 
                    className="page-nav-btn" 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === lastPage}
                    title="Next Page"
                  >
                      <ChevronRight size={20} />
                  </button>
              </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Explore;
