import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 6 Low-carbon recipes for the automatic rotation
const ROTATING_RECIPES = [
  { title: "Lentil Shepherd's Pie", co2: "0.6", icon: "🍲" },
  { title: "Roasted Chickpea Tacos", co2: "0.4", icon: "🌮" },
  { title: "Mushroom Risotto", co2: "0.8", icon: "🍄" },
  { title: "Black Bean Burgers", co2: "0.5", icon: "🍔" },
  { title: "Spinach & Ricotta Lasagna", co2: "0.9", icon: "🍝" },
  { title: "Quinoa Buddha Bowl", co2: "0.3", icon: "🥗" },
];

export default function RecipeCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_RECIPES.length);
    }, 3000); // Rotates every 3 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-8 w-full max-w-4xl mx-auto overflow-hidden">
      <p className="text-center text-white font-bold uppercase tracking-widest text-sm mb-4">
         Check out some of our curated recipes!
      </p>
      
      <div className="relative h-28 bg-white/10 border border-white/30 rounded-2xl flex items-center justify-center shadow-inner">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex items-center gap-6"
          >
            <span className="text-5xl drop-shadow-md">{ROTATING_RECIPES[index].icon}</span>
            <div className="text-left">
              <h4 className="text-xl font-bold text-white">
                {ROTATING_RECIPES[index].title}
              </h4>
              <p className="text-olive font-semibold text-sm">
                Estimated {ROTATING_RECIPES[index].co2}kg CO2 per serving
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {ROTATING_RECIPES.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              i === index ? 'bg-olive w-8' : 'bg-olive/20 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}