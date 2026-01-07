import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import InfoBar from '../components/GlobalInfo/InfoBar';
import { Activity } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Prosta belka nawigacyjna na górze */}
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-800 hover:text-indigo-600 transition">
            <Activity className="text-indigo-600" />
            Medical Toolkit <span className="text-xs font-normal text-slate-400 border border-slate-200 rounded px-1">v0.1</span>
          </Link>
        </div>
      </nav>

      {/* Zmienna treść (Tu wpadnie Dashboard albo CardioApp) */}
      <main className="flex-grow p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet /> 
        </div>
      </main>

      {/* Twoja stała zakładka na dole */}
      <InfoBar />
    </div>
  );
};

export default MainLayout;