import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PantryContext } from './main';
import RecipeModal from './RecipeModal';
import Cat from './assets/catonly.png';
import RecipeCarousel from './RecipeCarousel';

interface ChartData { name: string; value: number; }
interface IngredientAudit { name: string; kg_co2: number; }
interface RecipeIdea {
  id: number;
  title: string;
  image_url: string;
  estimated_co2: number;
  swap_note: string;
  instructions: string[];
  prep_time: number;
  cook_time: number;
  co2_split: ChartData[];
  macros: ChartData[];
}
interface DiscoveryResponse {
  total_kg_co2: number;
  audit_breakdown: IngredientAudit[];
  recipe_ideas: RecipeIdea[];
}

const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY; // Replace with your key

function App() {
  const [ingredientInput, setIngredientInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]); // For autocomplete
  const [ingredientsList, setIngredientsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<DiscoveryResponse | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeIdea | null>(null);

  const { setHistory } = useContext(PantryContext);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (ingredientInput.length > 1) {
        try {
          const res = await fetch(
            `https://api.spoonacular.com/food/ingredients/autocomplete?query=${ingredientInput}&number=5&apiKey=${SPOONACULAR_API_KEY}`
          );
          const data = await res.json();
          setSuggestions(data.map((item: any) => item.name));
        } catch (err) {
          console.error("Autocomplete error:", err);
        }
      } else {
        setSuggestions([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [ingredientInput]);

  const handleAddIngredient = (name?: string) => {
    const finalName = (name || ingredientInput).trim().toLowerCase();
    if (finalName !== '') {
      setIngredientsList([...ingredientsList, finalName]);
      setIngredientInput('');
      setSuggestions([]);
    }
  };

  const handleAnalyze = async () => {
    if (ingredientsList.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: ingredientsList }),
      });
      const data = await response.json();
      const timestamp = new Date().toLocaleTimeString();
      setHistory((prev: any) => [{ timestamp, recipes: data.recipe_ideas }, ...prev]);
      
      // Navigate to the new page and pass the data through state
      navigate('/recipes', { state: { results: data } });
      
    } catch (err) {
      setError('Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className={`py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${selectedRecipe ? 'blur-md brightness-90' : ''}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-barnaby text-olive tracking-tight sm:text-5xl">🌎 The World's Fridge </h1>
            <p className="mt-4 text-2xl text-white/70">Welcome to the EcoEater HQ. Enter in your desired ingredients and see what recipes you can create!</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-10 text-offblack relative">
            {/* Input and Add Button */}
            <div className="flex flex-col sm:flex-row gap-3 relative">
              <input 
                type="text" 
                className="flex-1 block w-full rounded-lg border-gray-300 border p-3 focus:ring-olive focus:border-olive shadow-sm"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
                placeholder="Add any ingredients..."
              />
              <button 
                onClick={() => handleAddIngredient()}
                className="px-6 py-3 rounded-lg text-white bg-olive font-medium hover:bg-olive/90 transition-colors"
              >
                Add Item
              </button>

              {/* Autocomplete Dropdown */}
              {suggestions.length > 0 && (
                <ul className="absolute z-50 w-full top-full mt-1 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-2xl">
                  {suggestions.map((s, i) => (
                    <li 
                      key={i}
                      onClick={() => handleAddIngredient(s)}
                      className="px-4 py-3 hover:bg-olive hover:text-white cursor-pointer transition-colors border-b border-gray-50 last:border-none capitalize"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Ingredient Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {ingredientsList.map((ing, idx) => (
                <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-olive/20 text-olive">
                  {ing}
                  <button 
                    onClick={() => setIngredientsList(ingredientsList.filter((_, i) => i !== idx))} 
                    className="ml-2 font-bold hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Analyze Button with Cabbage Cat Loader */}
            <button 
              onClick={handleAnalyze}
              disabled={loading || ingredientsList.length === 0}
              className={`mt-8 w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-wood hover:scale-[1.02] cursor-pointer'
              }`}
            >
              {loading ? (
                <>
                  <img src={Cat} className="h-8 w-8 animate-spin" alt="loading" />
                  Checking...
                </>
              ) : (
                'Check The Fridge'
              )}
            </button>
          </div>

          {/* Carousel or Results */}
          {!results ? (
            <RecipeCarousel />
          ) : (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <section className="bg-white rounded-2xl shadow-md overflow-hidden text-offblack">
                <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                  <h2 className="text-xl font-bold text-red-800">Current Footprint</h2>
                </div>
                <div className="p-6 text-center">
                  <span className="text-5xl font-black">{results.total_kg_co2.toFixed(1)}</span>
                  <span className="text-gray-500 ml-2 font-medium text-lg">kg CO2</span>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
    </div>
  );
}

export default App;