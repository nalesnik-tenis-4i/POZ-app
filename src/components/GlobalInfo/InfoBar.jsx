import React from 'react';
import { ShieldAlert, Monitor, FileText } from 'lucide-react';

const InfoBar = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs p-4 border-t border-slate-700">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Sekcja 1: Techniczne */}
        <div className="flex items-center gap-2">
          <Monitor size={16} />
          <span>App Desktop Only (Loklana). Żadne dane nie opuszczają urządzenia.</span>
        </div>

        {/* Sekcja 2: Disclaimer */}
        <div className="flex items-center gap-2 text-center md:text-left">
          <ShieldAlert size={16} className="text-yellow-500" />
          <span className="opacity-80">
            Narzędzie pomocnicze. Decyzję podejmuje lekarz. Dokładamy staranności, ale weryfikuj wyniki.
          </span>
        </div>

        {/* Sekcja 3: Zgłaszanie błędów */}
        <a 
          href="https://forms.google.com/TWOJ_LINK" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded transition-colors text-white"
        >
          <FileText size={14} />
          <span>Zgłoś błąd / Sugestie</span>
        </a>

      </div>
    </footer>
  );
};

export default InfoBar;