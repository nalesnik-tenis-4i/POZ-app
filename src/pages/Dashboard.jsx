import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, FileText, PlusCircle } from 'lucide-react';

const ToolCard = ({ to, title, desc, icon: Icon, color, active = true }) => (
  <Link 
    to={active ? to : '#'} 
    className={`block p-6 rounded-xl border transition-all duration-200 
      ${active 
        ? 'bg-white border-slate-200 hover:shadow-lg hover:border-indigo-300 cursor-pointer' 
        : 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed grayscale'
      }`}
  >
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
    <h3 className="text-lg font-bold text-slate-800">{title}</h3>
    <p className="text-sm text-slate-500 mt-2">{desc}</p>
  </Link>
);

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dostępne Narzędzia</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Kafel 1: Twoja obecna appka */}
        <ToolCard 
          to="/cardio" 
          title="Kardiologia Prewencyjna" 
          desc="Kalkulator SCORE2, SCORE2-OP oraz dobór terapii hipolipemizującej (polski region ryzyka)."
          icon={HeartPulse}
          color="bg-rose-500"
        />

        {/* Kafel 2: Przyszłość - Generator opisów */}
        <ToolCard 
          to="/texts" 
          title="Generator Opisów" 
          desc="Szybkie tworzenie opisów wizyt i wklejanie do systemów gabinetowych. (Wkrótce)"
          icon={FileText}
          color="bg-blue-500"
          active={false} // Wyłączony
        />

        {/* Kafel 3: Placeholder na przyszłość */}
        <ToolCard 
          to="/new" 
          title="Dodaj moduł..." 
          desc="Miejsce na kolejne kalkulatory (np. filtracja nerek, dawkowanie leków)."
          icon={PlusCircle}
          color="bg-emerald-500"
          active={false}
        />

      </div>
    </div>
  );
};

export default Dashboard;