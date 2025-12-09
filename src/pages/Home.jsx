import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';


function Home() {
  const navigate = useNavigate();

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
    </div>
  );
}

export default Home;
