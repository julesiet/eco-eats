import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from './App.tsx'
import Home from './Home.tsx'
import Layout from './Layout.tsx' 
import Recipes from './Recipes.tsx';
import './index.css'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/fridge" element={<App />} />
          <Route path="/recipes" element={<Recipes/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);