import { useContext, useState } from 'react';
import { PantryContext } from './main';
import RecipeCard from './RecipeCard';
import RecipeModal from './RecipeModal';

export default function Pantry() {
  const { history } = useContext(PantryContext);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-barnaby text-olive mb-2">The Pantry</h1>
      <p className="text-white/60 mb-10 text-lg font-sans">Missed a good meal? Fiending for a low emission bite? You'll find all your generated recipes here! </p>

      {history.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-olive/20 rounded-3xl">
          <p className="text-white/40 text-xl font-sans">Your pantry is empty. Go to the fridge to start cooking!</p>
        </div>
      ) : (
        <div className="space-y-16">
          {history.map((entry: any, i: number) => (
            <div key={i} className="animate-in fade-in slide-in-from-left-4">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-olive text-offblack px-4 py-1 rounded-full font-bold text-sm shadow-md">
                  Generated at {entry.timestamp}
                </span>
                <div className="h-px flex-1 bg-olive/20"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {entry.recipes.map((recipe: any) => (
                  <RecipeCard key={recipe.id} recipe={recipe} onClick={setSelectedRecipe} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
    </div>
  );
}