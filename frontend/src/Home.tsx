import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import kittyGrin from './assets/kittygrin.png';

function Home() {

  // literally JUST for confetti
  const handleHover = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Fires confetti from the center of the image
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { 
        x: (rect.left + rect.width / 2) / window.innerWidth, 
        y: (rect.top + rect.height / 2) / window.innerHeight 
      },
      colors: ['#8fa045'], 
      ticks: 500,
      gravity: 1.2,
      scalar: 0.7,
      shapes: ['circle']
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-5xl rounded-3xl border border-olive/30 bg-white text-offblack shadow-2xl p-8 md:p-12">
        
        <div className="mb-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          
          {/* Left Side: Text Content */}
          <div className="md:w-2/3">
            <p className="text-sm uppercase tracking-[0.25em] text-olive">
              Eco-Eats
            </p>
            {/* Note: If you want to use your Barnaby font here like in the screenshot, add font-barnaby to this h1! */}
            <h1 className="mt-3 text-4xl md:text-6xl font-barnaby leading-tight text-wood">
              Welcome to your (future) sustainable kitchen!
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-offblack/70">
              We are EcoEats! This web app is designed to help you eat smarter,
              both literally and for the environment - understand what you are eating,
              how it impacts the environment, and have a great time cooking.
            </p>
          </div>

          <div className="md:w-1/3 h-50 grid justify-end w-full relative">
            <img 
              src={kittyGrin} 
              alt="Sustainable salad animation" 
              onMouseEnter={handleHover}
              className="w-80 md:w-lg h-auto object-contain -mr-4 md:-mr-12 hover-spin cursor-pointer transition-transform" 
            />
        </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-olive/30 bg-olive/10 p-6">
            <h2 className="text-2xl font-semibold text-wood">Track Ingredients</h2>
            <p className="mt-3 text-offblack/70">
              Log what you already have and discover lower-impact swaps.
            </p>
          </div>

          <div className="rounded-2xl border border-wood/20 bg-wood text-white p-6">
            <h2 className="text-2xl font-semibold">Find Better Recipes</h2>
            <p className="mt-3 text-white/80">
              Explore meal ideas that lower your food footprint without
              sacrificing flavor.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/fridge"
            className="rounded-xl bg-olive px-6 py-3 text-white font-semibold hover:bg-olive/90 transition"
          >
            Go to The Fridge
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;