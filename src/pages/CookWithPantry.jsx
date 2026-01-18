import React, { useState, useEffect, useRef } from 'react';
import { ChefHat, AlertCircle, ArrowLeft, Filter, ChevronDown, Check } from 'lucide-react';
import RecipeCard from '../components/common/RecipeCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatRecipe } from '../utils/recipeUtils';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Explore.css';
import '../styles/CookWithPantry.css';

function CookWithPantry() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { language } = useLanguage();

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
        
        url.searchParams.append('lang', language); 

        if (filters.category) url.searchParams.append('category', filters.category);
        if (filters.meal_type) url.searchParams.append('meal_type', filters.meal_type);
        if (filters.temperature) url.searchParams.append('temperature', filters.temperature);

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept-Language': language
          }
        });

        if (!response.ok) {
           throw new Error('Failed to fetch matches');
        }

        const result = await response.json();
        const rawData = result.data || [];

        const formattedRecipes = rawData.map(recipe => {
            const formatted = formatRecipe(recipe);
            return {
                ...formatted,
                missing_count: recipe.missing_count,
                missing_ingredients: recipe.missing_ingredients,
                match_count: recipe.match_count
            };
        });

        setRecipes(formattedRecipes);

      } catch (err) {
        console.error("Error fetching matches:", err);
        setError(language === 'ar' ? "تعذر تحميل وصفات المخزن." : "Could not load your pantry matches.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();

  }, [token, navigate, filters, language]);

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
      { label: language === 'ar' ? 'كل التصنيفات' : 'All Categories', value: '' },
      { label: language === 'ar' ? 'وجبة' : 'Meal', value: 'meal' },
      { label: language === 'ar' ? 'مشروب' : 'Drink', value: 'drink' },
      { label: language === 'ar' ? 'سناك' : 'Snack', value: 'snack' }
    ],
    meal_type: [
      { label: language === 'ar' ? 'كل الأنواع' : 'All Types', value: '' },
      { label: language === 'ar' ? 'فطور' : 'Breakfast', value: 'breakfast' },
      { label: language === 'ar' ? 'غداء' : 'Lunch', value: 'lunch' },
      { label: language === 'ar' ? 'عشاء' : 'Dinner', value: 'dinner' }
    ],
    temperature: [
      { label: language === 'ar' ? 'أي حرارة' : 'Any Temp', value: '' },
      { label: language === 'ar' ? 'ساخن' : 'Hot', value: 'hot' },
      { label: language === 'ar' ? 'بارد' : 'Cold', value: 'cold' }
    ]
  };

  const t = {
    title: language === 'ar' ? 'ماذا يمكنك أن تطبخ الآن' : 'What you can cook now',
    subtitle: language === 'ar' 
        ? `بناءً على المكونات في مخزنك ${user?.name ? `، يا ${user.name}` : ''}` 
        : `Based on ingredients in your pantry ${user?.name ? `${user.name}` : ''}`,
    loading: language === 'ar' ? "نتحقق من مخزنك..." : "Checking your pantry...",
    found: (count) => language === 'ar' ? `وجدنا ${count} وصفة تناسب مكوناتك.` : `Found ${count} recipes matching your ingredients.`,
    noMatches: language === 'ar' ? "لم نجد وصفات مطابقة" : "No matches found",
    tryAdding: language === 'ar' ? "جرب إضافة المزيد من المكونات لمخزنك!" : "Try adding more ingredients to your pantry!",
    goToPantry: language === 'ar' ? "الذهاب للمخزن" : "Go to Pantry",
    reset: language === 'ar' ? "إعادة ضبط" : "Reset",
    category: language === 'ar' ? "تصنيف" : "Category",
    mealType: language === 'ar' ? "نوع الوجبة" : "Meal Type",
    temperature: language === 'ar' ? "حرارة" : "Temperature",
    missing: language === 'ar' ? "ينقصك: " : "Missing: ",
    ready: language === 'ar' ? "جاهزة للطبخ!" : "Ready to Cook!"
  };

  return (
    <div className={`explore-container ${language === 'ar' ? 'rtl-layout' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* 1. Header Section */}
      <div className="explore-header" style={{ position: 'relative' }}>
        <button 
          onClick={() => navigate('/')} 
          className="cook-header-btn"
        >
          <ArrowLeft size={24} className={language === 'ar' ? 'rotate-180' : ''} />
        </button>

        <h1>{t.title}</h1>
        <p className="cook-header-sub">
          {t.subtitle}
        </p>
      </div>

      {/* 2. Filters Section */}
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
                : t.category}
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
                : t.mealType}
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
                : t.temperature}
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
            {t.reset}
          </button>
        )}
      </div>

      {/* 3. Results Section */}
      <div>
        <div className="results-info">
          {loading ? t.loading : t.found(recipes.length)}
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
                          {t.missing} {recipe.missing_ingredients.join('، ')} 
                      </div>
                  )}
                  
                  {/* --- Perfect Match Badge --- */}
                  {isPerfectMatch && (
                     <div className="cook-ready-badge">
                        {t.ready}
                     </div>
                  )}

                </div>
              );
            })
          ) : !loading && !error && (
            <div className="no-results">
              <ChefHat size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3>{t.noMatches}</h3>
              <p>{t.tryAdding}</p>
              <button 
                onClick={() => navigate('/dashboard?tab=pantry')}
                className="cook-pantry-btn"
              >
                {t.goToPantry}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CookWithPantry;