import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from './App.tsx'
import Home from './Home.tsx'
import Layout from './Layout.tsx' 
import Recipes from './Recipes.tsx';
import Pantry from './Pantry.tsx'; 
import './index.css'

export const PantryContext = React.createContext<any>(null);

function Root() {
  const [history, setHistory] = useState<any[]>([]);
  return (
    <PantryContext.Provider value={{ history, setHistory }}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/fridge" element={<App />} />
            <Route path="/recipes" element={<Recipes/>}/>
            <Route path="/pantry" element={<Pantry/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </PantryContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);