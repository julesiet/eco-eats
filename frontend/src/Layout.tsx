import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import catAndLogo from './assets/logowcat.png';

const Layout = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className="min-h-screen flex bg-offblack text-white"
      style={{ fontFamily: 'Citizens, system-ui, sans-serif' }}
    >
      {/* SIDEBAR NAVBAR */}
      <aside
        className={`min-h-screen bg-wood border-r border-olive/40 shadow-2xl transition-all duration-300 ease-in-out sticky top-0 ${
          isOpen ? 'w-1/5 min-w-60' : 'w-20'
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
              to="/home"
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
              {isOpen && <span className="text-lg">The Fridge</span>}
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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-h-screen bg-offblack overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;