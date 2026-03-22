import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface RecipeIdea {
  id: number;
  title: string;
  image_url: string;
  estimated_co2: number;
  swap_note: string;
  // New fields for the Dashboard
  instructions: string[];
  prep_time: number;
  cook_time: number;
  co2_split: ChartData[];
  macros: ChartData[];
}

interface ChartData {
  name: string;
  value: number;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const RecipeModal = ({ recipe, onClose }: { recipe: RecipeIdea; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
    <div 
      className="bg-[#8B9D44] border-4 border-[#6B7D34] rounded-2xl shadow-2xl max-w-5xl w-full p-1 animate-in zoom-in-95" 
      onClick={e => e.stopPropagation()}
    >
      <div className="bg-white p-6 md:p-10 flex flex-col md:row relative max-h-[90vh] overflow-y-auto rounded-2xl">
        <button onClick={onClose} className="absolute top-2 right-4 text-3xl font-serif text-gray-400 hover:text-black">X</button>

        <div className="flex flex-col md:flex-row">
          {/* Left Side: Instructions */}
          <div className="md:w-3/5 pr-0 md:pr-8 border-b md:border-b-0 md:border-r border-gray-200">
            <h2 className="text-4xl font-barnaby underline decoration-2 uppercase tracking-wide mb-6 text-offblack">{recipe.title}</h2>
            <div className="flex gap-4 mb-8 text-xs font-bold text-gray-500 uppercase">
              <span>Prep: {recipe.prep_time}m</span>
              <span>Cook: {recipe.cook_time}m</span>
              <span className="text-green-600">Total CO2: {recipe.estimated_co2.toFixed(1)}kg</span>
            </div>
            
            <h3 className="text-xl font-bold mb-4 text-offblack">Preparation:</h3>
            <div className="space-y-4">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-3 text-gray-700 text-sm leading-relaxed">
                  <span className="font-bold text-[#8B9D44]">{i + 1}.</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Charts */}
          <div className="md:w-2/5 pl-0 md:pl-8 pt-8 md:pt-0 flex flex-col items-center">
            <div className="bg-[#8B9D44] p-3 rounded-sm w-full mb-6 shadow-inner">
              <div className="h-48 w-full bg-white/20 rounded">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={recipe.co2_split} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85}>
                      {recipe.co2_split.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="w-full mb-8">
              <h4 className="text-xl font-serif text-gray-600 border-b border-gray-100 pb-2 mb-3">Impact Breakdown</h4>
              {recipe.co2_split.map((item, i) => (
                <div key={i} className="flex justify-between text-sm font-serif text-gray-500 mb-1">
                  <span>{item.name}</span>
                  <span className="font-bold">{item.value}kg</span>
                </div>
              ))}
            </div>

            <div className="border-4 border-[#8B9D44] p-1 shadow-lg w-full">
              <img src={recipe.image_url} className="w-full h-44 object-cover" alt="Dish" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default RecipeModal