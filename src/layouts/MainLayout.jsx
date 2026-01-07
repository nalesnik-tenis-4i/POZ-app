import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Activity, RotateCcw } from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import InfoBar from '../components/GlobalInfo/InfoBar';

const MainLayout = () => {
  const { resetPatient } = usePatient();

  const handleReset = () => {
    if (window.confirm("Czy na pewno chcesz wyczyścić wszystkie dane pacjenta i zacząć od nowa?")) {
      resetPatient();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* --- GÓRNA NAWIGACJA --- */}
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo i Link do Pulpitu */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-800 hover:text-indigo-600 transition group">
            <div className="bg-indigo-100 p-1.5 rounded-lg group-hover:bg-indigo-200 transition">
              <Activity className="text-indigo-600" size={24} />
            </div>
            <span>Medical Toolkit</span>
            <span className="text-xs font-normal text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 ml-1">v0.2</span>
          </Link>

          {/* Przycisk Resetu (Nowy Pacjent) */}
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors border border-red-100 hover:border-red-200"
            title="Wyczyść formularze i zacznij wizytę od nowa"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Nowy Pacjent</span>
          </button>
        </div>
      </nav>

      {/* --- GŁÓWNA TREŚĆ (Zmienna) --- */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
          <Outlet /> 
        </div>
      </main>

      {/* --- STOPKA INFORMACYJNA --- */}
      <InfoBar />
    </div>
  );
};

export default MainLayout;