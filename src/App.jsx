import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import CardioApp from './pages/CardioApp'; // Import Twojej logiki kardiologicznej

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Wszystkie ścieżki wewnątrz MainLayout mają ramkę i stopkę */}
        <Route path="/" element={<MainLayout />}>
          
          {/* Strona główna (pulpit) */}
          <Route index element={<Dashboard />} />
          
          {/* Twoja appka kardiologiczna pod osobnym adresem */}
          <Route path="cardio" element={<CardioApp />} />
          
          {/* Tu będziesz dodawać kolejne: */}
          {/* <Route path="teksty" element={<TextGenerator />} /> */}

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;