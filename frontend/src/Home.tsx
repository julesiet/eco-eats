import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-5xl rounded-3xl border border-olive/30 bg-white text-offblack shadow-2xl p-8 md:p-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-olive">
            Eco-Eats
          </p>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold leading-tight text-wood">
            Welcome to your sustainable kitchen
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-offblack/70">
            Your journey to a lower carbon footprint starts here. Analyze your current 
            ingredients or explore recipe alternatives using the navigation menu.
          </p>
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
            className="rounded-xl bg-olive px-6 py-3 text-offblack font-semibold hover:opacity-90 transition"
          >
            Go to My Fridge
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;