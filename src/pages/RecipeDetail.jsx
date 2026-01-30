import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Clock, Flame, Heart, Plus, Check, AlertCircle, Sparkles } from 'lucide-react';
import { formatRecipe } from '../utils/recipeUtils';
import { checkIsFavorite, toggleFavorite } from '../utils/favoritesService';
import { addItem } from '../utils/shoppingService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import '../styles/RecipeDetail.css';

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { language } = useLanguage();

  const missingIngredients = location.state?.missingIngredients || [];
  const isPantryMode = location.state?.isPantryMode || false;
  const isSurprise = location.state?.isSurprise || false;

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [addedIngredients, setAddedIngredients] = useState({});
  const [toast, setToast] = useState({ show: false, message: '' });

  // Ref to hold the timer ID
  const toastTimer = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setLoading(true);

    fetch(`http://127.0.0.1:8000/api/recipes/${id}?lang=${language}`, {
      headers: {
        'Accept-Language': language
      }
    })
      .then(res => res.json())
      .then(async (data) => {
        const formattedRecipe = formatRecipe(data, language);
        setRecipe(formattedRecipe);

        const status = await checkIsFavorite(formattedRecipe.id, language);
        setIsLiked(status);

        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
  }, [id, language]);

  const handleToggleLike = async () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (recipe) {
      const newStatus = await toggleFavorite(recipe.id, isLiked, language);
      setIsLiked(newStatus);
    }
  };

  const handleAddToShopping = async (ingredientName) => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (addedIngredients[ingredientName]) return;

    const result = await addItem(ingredientName, language);
    if (result) {
      setAddedIngredients(prev => ({ ...prev, [ingredientName]: true }));
      
      // Clear existing timer if any
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }

      setToast({
        show: true,
        message: language === 'ar' 
          ? `تمت إضافة "${ingredientName}" إلى قائمة التسوق` 
          : `"${ingredientName}" added to shopping list`
      });

      // Set new timer
      toastTimer.current = setTimeout(() => {
        setToast({ show: false, message: '' });
      }, 1500);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/600x400?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('asset/')) return `http://127.0.0.1:8000/${imagePath}`;
    return `http://127.0.0.1:8000/storage/${imagePath}`;
  };

  const formatTime = (time) => {
    if (!time) return '';
    const num = parseInt(time);
    if (isNaN(num)) return time;
    return language === 'ar' ? `${num} دقيقة` : `${num} min`;
  };

  const translateDifficulty = (difficulty) => {
    if (!difficulty) return '';
    if (language === 'ar') {
      const map = { 'Easy': 'سهل', 'Medium': 'متوسط', 'Hard': 'صعب' };
      return map[difficulty] || difficulty;
    }
    return difficulty;
  };

  const getDifficultyClass = (level) => {
    if (!level) return 'diff-easy';
    const lvl = level.toLowerCase();
    if (lvl.includes('medium') || lvl.includes('متوسط')) return 'diff-medium';
    if (lvl.includes('hard') || lvl.includes('صعب')) return 'diff-hard';
    return 'diff-easy';
  };

  const checkIngredientStatus = (ing) => {
    if (!isPantryMode) return 'neutral';

    const currentId = ing?.id;
    const cleanName = (ing?.name || '').toLowerCase().trim();

    const isMissing = missingIngredients.some(missing => {
      if (typeof missing === 'object' && missing !== null && missing.id) {
        if (currentId && Number(currentId) === Number(missing.id)) return true;
      }

      const missingName = typeof missing === 'string' ? missing : (missing.name || '');
      const cleanMissing = missingName.toLowerCase().trim();
      
      return cleanName.includes(cleanMissing) || cleanMissing.includes(cleanName);
    });

    return isMissing ? 'missing' : 'available';
  };

  const t = {
    loading: language === 'ar' ? 'جاري التحميل...' : 'Loading details...',
    notFound: language === 'ar' ? 'الوصفة غير موجودة' : 'Recipe not found',
    goHome: language === 'ar' ? 'الرئيسية' : 'Go Home',
    back: language === 'ar' ? 'رجوع' : 'Back',
    ingredients: language === 'ar' ? 'المكونات' : 'Ingredients',
    instructions: language === 'ar' ? 'طريقة التحضير' : 'Instructions',
    surpriseBadge: language === 'ar' ? 'مفاجأة الشيف' : "Chef's Surprise Pick",
    addToShopping: language === 'ar' ? 'أضف لقائمة التسوق' : 'Add to Shopping List',
    added: language === 'ar' ? 'تمت الإضافة' : 'Added to list'
  };

  if (loading) return <div className="container status-container">{t.loading}</div>;
  if (!recipe) return (
    <div className="container status-container">
      <h2>{t.notFound}</h2>
      <button onClick={() => navigate('/')} className="btn-primary home-btn">{t.goHome}</button>
    </div>
  );

  return (
    <>
      <title>{recipe.title}</title>
      <div className="recipe-detail container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="detail-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <ChevronLeft size={20} className={language === 'ar' ? 'rotate-180' : ''} /> {t.back}
          </button>
        </div>

        <div className="recipe-content">
          <div className="recipe-visuals" style={{ position: 'relative' }}>
            <img
              src={getImageUrl(recipe.image)}
              alt={recipe.title}
              className={`detail-image ${isSurprise ? 'surprise-glow' : ''}`}
              onError={(e) => { 
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/600x400?text=No+Image'; 
              }}
            />
            <button className="detail-like-btn" onClick={handleToggleLike}>
              <Heart size={24} fill={isLiked ? "#ef4444" : "none"} color={isLiked ? "#ef4444" : "#6b7280"} />
            </button>
            <div className="recipe-meta">
              <span className="meta-item"><Clock size={18} /> {formatTime(recipe.time)}</span>
              <span className="meta-item"><Flame size={18} /> {recipe.calories}</span>
              <span className={`meta-item difficulty-text ${getDifficultyClass(recipe.difficulty)}`}>{translateDifficulty(recipe.difficulty)}</span>
            </div>
            {recipe.description && <p className="recipe-description-text">{recipe.description}</p>}
          </div>

          <div className="recipe-info">
            {isSurprise && (
              <div className="surprise-badge">
                <Sparkles size={16} fill="white" />
                {t.surpriseBadge}
              </div>
            )}
            <h1 className="recipe-title">{recipe.title}</h1>
            <div>
              <h3 className="section-heading">{t.ingredients}</h3>
              <ul className="ingredient-list">
                {recipe.ingredients && recipe.ingredients.map((ing, idx) => {
                  const status = checkIngredientStatus(ing);
                  const statusClass = status === 'missing' ? 'status-missing' : status === 'available' ? 'status-available' : '';
                  const ingName = ing.name;

                  return (
                    <li key={idx} className={`ingredient-item ${statusClass}`}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {status === 'missing' && <AlertCircle size={16} className="text-red-500" />}
                        {status === 'available' && <Check size={16} className="text-green-500" />}
                        <span>{ingName}</span>
                      </div>

                      {status !== 'available' && (
                        <button
                          className={`add-ing-btn ${addedIngredients[ingName] ? 'added' : ''}`}
                          onClick={() => handleAddToShopping(ingName)}
                        >
                          {addedIngredients[ingName] ? <Check size={16} /> : <Plus size={16} />}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className='instructions-div'>
              <h3 className="section-heading">{t.instructions}</h3>
              <div className="steps-list">
                {recipe.steps && recipe.steps.length > 0 ? (
                  recipe.steps.map((step, idx) => (
                    <div key={idx} className="step-item">
                      <span className="step-number">{idx + 1}</span>
                      <p className="step-text">{step}</p>
                    </div>
                  ))
                ) : <p style={{ color: 'var(--gray)', fontStyle: 'italic' }}>{language === 'ar' ? 'لا توجد خطوات متاحة.' : 'No instructions available.'}</p>}
              </div>
            </div>
          </div>
        </div>

        {toast.show && (
          <div className="toast-notification">
            <Check size={18} />
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default RecipeDetail;