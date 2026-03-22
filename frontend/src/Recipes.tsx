import { useLocation, useNavigate } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import RecipeModal from './RecipeModal';
import { useState } from 'react';
import Cat from './assets/catonly.png';

function Recipes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  
  // Retrieve the results passed from App.tsx
  const results = location.state?.results;

  if (!results) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-2xl mb-4">No recipes found.</h2>
        <button onClick={() => navigate('/fridge')} className="bg-olive px-6 py-2 rounded-lg">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500">
      <div className={`max-w-4xl mx-auto ${selectedRecipe ? 'blur-md brightness-90' : ''}`}>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-barnaby text-olive tracking-tight sm:text-5xl flex items-center justify-center gap-3">
            <img 
                src={Cat} 
                alt="Cabbage Cat" 
                className="h-14 w-14 sm:h-14 sm:w-14 object-contain" 
            />
            Your Greener Choices!
            </h1>
          <p className="mt-4 text-xl text-white/70">Total Footprint Saved: {results.total_kg_co2.toFixed(1)} kg CO2</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {results.recipe_ideas.map((recipe: any) => (
            <RecipeCard key={recipe.id} recipe={recipe} onClick={setSelectedRecipe} />
          ))}
        </div>

        <div className="flex justify-center">
          <button 
            onClick={() => navigate('/fridge')}
            className="rounded-xl border border-wood px-8 py-4 text-wood bg-white font-bold hover:bg-wood hover:text-white transition shadow-lg"
          >
            Would you like to try more recipes?
          </button>
        </div>
      </div>

      {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
    </div>
  );
}

export default Recipes;