import { useState } from 'react';

interface IngredientAudit {
  name: string;
  kg_co2: number;
}

interface RecipeIdea {
  id: number;
  title: string;
  image_url: string;
  estimated_co2: number;
  swap_note: string;
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-green-700 tracking-tight sm:text-5xl">
            🌍 EcoEats
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Audit your fridge's carbon footprint and find sustainable swaps.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              className="flex-1 block w-full rounded-lg border-gray-300 border p-3 focus:ring-green-500 focus:border-green-500 shadow-sm"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
              placeholder="Add ingredient (e.g. beef, spinach...)"
            />
            <button 
              onClick={handleAddIngredient}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 hover:cursor-pointer focus:outline-none transition-colors"
            >
              Add Item
            </button>
          </div>

          {/* Ingredient Pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {ingredientsList.map((ing, idx) => (
              <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {ing}
                <button 
                  onClick={() => setIngredientsList(ingredientsList.filter((_, i) => i !== idx))}
                  className="ml-2 text-green-600 hover:text-green-900 hover:cursor-pointer font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <button 
            onClick={handleAnalyze}
            disabled={loading || ingredientsList.length === 0}
            className={`hover:cursor-pointer mt-8 w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-all ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-linear-to-r from-green-600 to-teal-600 hover:scale-[1.02]'
            }`}
          >
            {loading ? 'Calculating Impact...' : 'Analyze My Fridge'}
          </button>
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Results Section */}
        {results && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Audit Breakdown */}
            <section className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                <h2 className="text-xl font-bold text-red-800">Current Fridge Impact</h2>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <span className="text-5xl font-black text-gray-800">{results.total_kg_co2}</span>
                  <span className="text-gray-500 ml-2 font-medium text-lg">kg CO2 Total</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.audit_breakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="capitalize text-gray-700 font-medium">{item.name}</span>
                      <span className="text-red-600 font-mono font-bold">+{item.kg_co2} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Recipe Suggestions */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">🌱</span> Greener Alternatives
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.recipe_ideas.map((recipe) => (
                  <div key={recipe.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl transition-shadow">
                    <img src={recipe.image_url} alt={recipe.title} className="h-48 w-full object-cover" />
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">{recipe.title}</h3>
                      <div className="flex items-center text-sm font-semibold text-green-700 bg-green-50 px-2 py-1 rounded w-fit mb-4">
                        Cost: {recipe.estimated_co2} kg CO2
                      </div>
                      <p className="text-gray-600 text-sm italic bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                        "{recipe.swap_note}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;