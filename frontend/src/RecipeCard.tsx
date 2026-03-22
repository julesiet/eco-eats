import React from 'react';

interface RecipeCardProps {
  recipe: any;
  onClick: (recipe: any) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  return (
    <div 
      onClick={() => onClick(recipe)} 
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl transition-all hover:scale-[1.03] cursor-pointer"
    >
      <img 
        src={recipe.image_url} 
        alt={recipe.title} 
        className="h-48 w-full object-cover" 
      />
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">
          {recipe.title}
        </h3>
        <div className="flex items-center text-sm font-semibold text-green-700 bg-green-50 px-2 py-1 rounded w-fit mb-4">
          Cost: {recipe.estimated_co2.toFixed(1)} kg CO2
        </div>
        <p className="text-gray-600 text-xs italic">
          Click for instructions & breakdown →
        </p>
      </div>
    </div>
  );
};

export default RecipeCard;