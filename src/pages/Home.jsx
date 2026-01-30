import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/common/RecipeCard';
import '../styles/Home.css';
import { formatRecipe } from '../utils/recipeUtils';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Heart } from 'lucide-react';
import { useAlert } from '../context/AlertContext';

function Home() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { language } = useLanguage();
  const { showAlert } = useAlert();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [surpriseLoading, setSurpriseLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetch(`http://127.0.0.1:8000/api/recipes/top-loved?lang=${language}`, {
      headers: {
        'Accept-Language': language
      }
    })
      .then(response => response.json())
      .then(result => {
        const rawRecipes = result.data || [];
        const formattedRecipes = rawRecipes.map(recipe => formatRecipe(recipe, language));
        setRecipes(formattedRecipes);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      });
  }, [language]);

  // --- Slider Logic ---
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

  const handleSurpriseMe = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setSurpriseLoading(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/recipes/surprise-me?lang=${language}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept-Language': language
        }
      });

      const responseData = await response.json();
      if (responseData.status === 'fail') {
        let msg = responseData.message;

        if (language === 'ar' && (msg.includes("No suitable recipe") || msg.includes("pantry"))) {
          msg = "لا توجد وصفة مناسبة مع مكونات مطبخك الحالية.";
        }

        showAlert(language === 'ar' ? "تنبيه" : "Note", msg);
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
        showAlert(language === 'ar' ? "لا توجد وصفات!" : "No recipes found!");
      }

    } catch (error) {
      console.error("Surprise Me Error:", error);
      showAlert(language === 'ar' ? "حدث خطأ ما." : "Something went wrong. Please try again.");
    } finally {
      setSurpriseLoading(false);
    }
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % recipes.length);
    }
    if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + recipes.length) % recipes.length);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;

    if (distance > 50) {
      setCurrentSlide((prev) => (prev + 1) % recipes.length);
    } else if (distance < -50) {
      setCurrentSlide((prev) => (prev - 1 + recipes.length) % recipes.length);
    }
  };

  const t = {
    heroTitle: language === 'ar' ? <>اطبخ باللي عندك <br /> في <span>مطبخك.</span></> : <>Cook with what <br /> you <span>have.</span></>,
    heroSub: language === 'ar' 
      ? "اكتشف وصفات تناسب مكونات مطبخك. بدون تعقيد، فقط طعام لذيذ."
      : "Minimalist recipe finder based on your pantry. No clutter, just good food.",
    exploreBtn: language === 'ar' ? "تصفح الوصفات" : "Explore Recipes",
    cookBtn: language === 'ar' ? "اطبخ باللي عندك" : "Cook with what I have",
    surpriseBtn: language === 'ar' ? (surpriseLoading ? 'جاري الطهي...' : 'فاجئني') : (surpriseLoading ? 'Cooking...' : 'Surprise Me'),
    trending: language === 'ar' ? "الأكثر رواجاً الآن" : "Trending Now",
    loading: language === 'ar' ? "نختار لك أفضل الوصفات..." : "Curating best recipes for you...",
    noTrendingTitle: language === 'ar' ? "لا توجد وصفات رائجة بعد" : "No trending recipes yet",
    noTrendingSub: language === 'ar' ? "كن أول من يضيف وصفة للمفضلة!" : "Be the first to add a recipe to favorites!",
    startLiking: language === 'ar' ? "ابدأ التصفح" : "Start Exploring"
  };

  return (
    <>
      <title>Home</title>

      <div className={`home-page ${language === 'ar' ? 'rtl-content' : ''}`}>
        {/* Hero Section  */}
        <section className="hero">
          <h1>{t.heroTitle}</h1>
          <p>{t.heroSub}</p>

          <div className="hero-buttons">
            <button
              className="btn-secondary btn-large"
              onClick={() => navigate('/explore')}
            >
              {t.exploreBtn}
            </button>
            <button
              className="btn-large cook-btn"
              onClick={() => navigate('/cook-now')}
            >
              {t.cookBtn}
            </button>
            <button
              className="btn-secondary btn-large surprise-btn"
              onClick={handleSurpriseMe}
              disabled={surpriseLoading}
              style={{ minWidth: '160px' }}
            >
              {t.surpriseBtn}
              <Sparkles size={16} />
            </button>
          </div>
        </section>

        {/* Trending Section */}
        <section className="home-content">
          <div className="container">

            <h2 style={{ color: 'var(--text-color)', textAlign: 'center', padding: '1rem' }}>
              {t.trending}
            </h2>

            {loading ? (
              <div className="loading-placeholder">
                <div className="spinner"></div>
                <p>{t.loading}</p>
              </div>
            ) : recipes.length > 0 ? (
              <div
                className="slider-wrapper"
                dir="ltr"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => setIsDragging(false)}
              >
                <div
                  className="recipe-grid slider-track"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {recipes.map(recipe => (
                    <div
                      key={recipe.id}
                      className="slide-item"
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                      style={{
                        textAlign: language === 'ar' ? 'right' : 'left',
                        direction: language === 'ar' ? 'rtl' : 'ltr'
                      }}
                    >
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
            ) : (
              // Empty State
              <div className="no-results" style={{ padding: '2rem', textAlign: 'center' }}>
                <Heart size={48} style={{ margin: '0 auto 1rem', opacity: 0.3, color: '#ef4444' }} />
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-color)' }}>{t.noTrendingTitle}</h3>
                <p style={{ color: 'var(--gray)', marginBottom: '1.5rem' }}>{t.noTrendingSub}</p>
                <button
                  className="btn-primary"
                  onClick={() => navigate('/explore')}
                  style={{ margin: '0 auto' }}
                >
                  {t.startLiking}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;