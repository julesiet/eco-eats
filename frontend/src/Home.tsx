import { useState } from 'react'
import { Link } from 'react-router-dom'
import catAndLogo from './assets/logowcat.png'

function App() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div
      className="min-h-screen flex bg-offblack text-white"
      style={{ fontFamily: 'Citizens, system-ui, sans-serif' }}
    >
      <aside
        className={`min-h-screen bg-wood border-r border-olive/40 shadow-2xl transition-all duration-300 ease-in-out ${
          isOpen ? 'w-1/5 min-w-[240px]' : 'w-20'
        }`}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-8 flex items-center justify-between">
            {isOpen ? (
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={catAndLogo}
                  alt="Eco-Eats logo"
                  className="h-12 w-auto object-contain"
                />
                <span className="text-2xl font-bold text-olive tracking-wide">
                  ECO-EATS
                </span>
              </div>
            ) : (
              <div className="h-12" />
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-white hover:bg-olive/20 hover:cursor-pointer transition text-3xl leading-none"
              aria-label="Toggle sidebar"
            >
              {isOpen ? '←' : '☰'}
            </button>
          </div>

          <nav className="flex flex-col gap-3">
            <Link
              to="/"
              className="flex items-center gap-4 rounded-xl px-3 py-3 text-white hover:bg-olive/20 transition"
            >
              <span className="text-2xl w-8 text-center">⌂</span>
              {isOpen && <span className="text-lg">Home</span>}
            </Link>

            <Link
              to="/fridge"
              className="flex items-center gap-4 rounded-xl px-3 py-3 text-white hover:bg-olive/20 transition"
            >
              <span className="text-2xl w-8 text-center">▣</span>
              {isOpen && <span className="text-lg">My Fridge</span>}
            </Link>
          </nav>

          <div className="mt-auto rounded-2xl bg-offblack/40 p-4 border border-olive/30">
            {isOpen ? (
              <div>
                <div className="mb-2 flex items-center gap-2 text-olive">
                  <span className="text-lg">✿</span>
                  <span className="font-semibold">Sustainable Swaps</span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  Build greener meals with ingredients already in your kitchen.
                </p>
              </div>
            ) : (
              <div className="flex justify-center text-olive text-lg">✿</div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 min-h-screen bg-offblack">
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
                Use the sidebar to navigate your app. This layout keeps the menu
                full-height, anchored to the left, and expands to about one-fifth
                of the screen.
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

              <Link
                to="/"
                className="rounded-xl border border-wood px-6 py-3 text-wood font-semibold hover:bg-wood hover:text-white transition"
              >
                Back Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App