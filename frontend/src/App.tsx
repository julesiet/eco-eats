import { useState } from 'react';
import RecipeCard from './RecipeCard';
import RecipeModal from './RecipeModal';

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

function App() {
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredientsList, setIngredientsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<DiscoveryResponse | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeIdea | null>(null);

  const handleAddIngredient = () => {
    if (ingredientInput.trim() !== '') {
      setIngredientsList([...ingredientsList, ingredientInput.trim().toLowerCase()]);
      setIngredientInput('');
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
      const data: DiscoveryResponse = await response.json();
      setResults(data);
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
            <h1 className="text-4xl font-extrabold text-olive tracking-tight sm:text-5xl">🌍 My Fridge</h1>
            <p className="mt-4 text-lg text-white/70">Audit your ingredients and find greener alternatives.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-10 text-offblack">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                className="flex-1 block w-full rounded-lg border-gray-300 border p-3 focus:ring-olive focus:border-olive shadow-sm"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
                placeholder="Add ingredient..."
              />
              <button 
                onClick={handleAddIngredient}
                className="px-6 py-3 rounded-lg text-white bg-olive font-medium hover:bg-olive/90 transition-colors"
              >
                Add Item
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {ingredientsList.map((ing, idx) => (
                <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-olive/20 text-olive">
                  {ing}
                  <button onClick={() => setIngredientsList(ingredientsList.filter((_, i) => i !== idx))} className="ml-2 font-bold">×</button>
                </span>
              ))}
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={loading || ingredientsList.length === 0}
              className={`mt-8 w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-all ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-wood hover:scale-[1.02] cursor-pointer'
              }`}
            >
              {loading ? 'Calculating...' : 'Analyze My Fridge'}
            </button>
          </div>

          {results && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <section className="bg-white rounded-2xl shadow-md overflow-hidden text-offblack">
                <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                  <h2 className="text-xl font-bold text-red-800">Current Footprint</h2>
                </div>
                <div className="p-6">
                  <div className="text-center mb-6">
                    <span className="text-5xl font-black">{results.total_kg_co2.toFixed(1)}</span>
                    <span className="text-gray-500 ml-2 font-medium text-lg">kg CO2</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {results.audit_breakdown.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="capitalize">{item.name}</span>
                        <span className="text-red-600 font-bold">+{item.kg_co2.toFixed(1)} kg</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-6">🌱 Greener Alternatives</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {results.recipe_ideas.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} onClick={setSelectedRecipe} />
                  ))}
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