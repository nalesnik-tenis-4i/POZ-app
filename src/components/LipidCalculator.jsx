import React, { useState, useMemo } from 'react';
import { ClipboardCopy, Check, AlertCircle } from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { RISK_TARGETS } from '../data/lipidData';
import { calculateTreatment } from '../logic/lipidUtils';

// Proste etykiety do notatki (bez opisów typu "np. po zawale")
const SIMPLE_RISK_LABELS = {
  VERY_HIGH: 'BARDZO WYSOKIE',
  HIGH: 'WYSOKIE',
  MODERATE: 'UMIARKOWANE',
  LOW: 'NISKIE'
};

// ZMIANA 1: Odbieramy prop forcedRisk (przekazywany z CardioApp)
const LipidCalculator = ({ forcedRisk }) => {
  const { patientData, updatePatient } = usePatient();
  const [copied, setCopied] = useState(false);

  // Pobieramy dane z Contextu (globalne)
  const ldl = patientData.metrics.ldl || '';
  
  // ZMIANA 2: Priorytet dla forcedRisk. Jeśli go nie ma -> Context -> Fallback 'VERY_HIGH'
  const riskCategory = forcedRisk || patientData.diagnosis || 'VERY_HIGH';

  // Obliczenia (useMemo dla wydajności)
  const result = useMemo(() => {
    return calculateTreatment(Number(ldl), riskCategory);
  }, [ldl, riskCategory]);

  // --- GENERATOR NOTATKI ---
  const generateMedicalNote = () => {
    // 1. Ryzyko - Czysta etykieta + SCORE2 (jeśli istnieje)
    const riskLabel = SIMPLE_RISK_LABELS[riskCategory] || riskCategory;
    const scoreInfo = patientData.scoreValue ? ` (SCORE2: ${patientData.scoreValue}%)` : '';

    // 2. Leki - Tylko string z lekami
    let drugString = '';
    if (result?.drugs && result.drugs.length > 0) {
      drugString = result.drugs.map(d => `${d.name} ${d.dose}`).join(' LUB ');
    } else if (result?.status === 'OK') {
      drugString = 'Pacjent w celu terapeutycznym. Utrzymać obecne leczenie.';
    } else {
      // Fallback, gdyby drugs było puste a status nie OK (np. mała redukcja - styl życia)
      drugString = result?.description || 'Zalecana modyfikacja stylu życia.';
    }

    return `
Zidentyfikowane ryzyko sercowo-naczyniowe: ${riskLabel}${scoreInfo}

WYNIKI BADAŃ:
LDL: ${ldl} mg/dL
${patientData.metrics.cholTotal ? `TC: ${patientData.metrics.cholTotal} mg/dL` : ''}

CEL TERAPEUTYCZNY:
Docelowe stężenie LDL < ${result?.target || '-'} mg/dL
Wymagana redukcja: ${result?.reductionPercent || '0'}%

ZALECENIA FARMAKOLOGICZNE:
${drugString}

(Lek zapisano zgodnie z systemem eRecept / IKP).
`.trim();
  };

  const handleCopy = () => {
    const text = generateMedicalNote();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      
      {/* Nagłówek Wizualny */}
      <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
        <h2 className="text-lg font-bold">Krok 2: Cel Terapeutyczny i Leki</h2>
        {/* Etykieta ryzyka widoczna dla lekarza w UI (pełna) */}
        <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300 hidden sm:inline-block">
          {RISK_TARGETS[riskCategory]?.label || riskCategory}
        </span>
      </div>
      
      <div className="p-6 space-y-6">
        
        {/* INPUT LDL */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Aktualny poziom LDL (mg/dL)
          </label>
          <div className="relative">
            <input 
              type="number" 
              value={ldl}
              onChange={(e) => updatePatient({ metrics: { ldl: e.target.value } })}
              className="w-full border-2 border-indigo-100 rounded-lg shadow-sm p-4 text-2xl font-mono focus:border-indigo-500 focus:ring-indigo-500 outline-none transition"
              placeholder="np. 145"
              autoFocus 
            />
            <span className="absolute right-4 top-5 text-gray-400 font-medium">mg/dL</span>
          </div>
        </div>

        {/* WYNIKI OBLICZEŃ (WIZUALNE DLA LEKARZA) */}
        {ldl && result ? (
          <div className={`p-5 rounded-lg border-l-4 animate-in slide-in-from-top-2 duration-300 ${result.status === 'OK' ? 'bg-green-50 border-green-500' : 'bg-indigo-50 border-indigo-500'}`}>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-4 gap-4">
              <div>
                <span className="text-sm text-gray-500 block uppercase tracking-wide font-semibold">Cel terapeutyczny</span>
                <span className="text-3xl font-bold text-gray-800">&lt; {result.target} <span className="text-lg text-gray-500 font-normal">mg/dL</span></span>
              </div>
              {result.reductionPercent > 0 && (
                 <div className="sm:text-right">
                    <span className="text-sm text-gray-500 block uppercase tracking-wide font-semibold">Wymagana redukcja</span>
                    <span className="text-2xl font-bold text-rose-600">-{result.reductionPercent}%</span>
                 </div>
              )}
            </div>

            <hr className="border-gray-200/50 my-3" />

            {/* Lista leków (Interfejs graficzny) */}
            {result.status !== 'OK' ? (
              <div>
                <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                  <AlertCircle size={18} /> Strategia leczenia
                </h3>
                {result.drugs && result.drugs.length > 0 ? (
                  <ul className="space-y-2">
                    {result.drugs.map((drug, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-white/60 p-2 rounded border border-indigo-100">
                        <span className="font-medium text-gray-800">{drug.name}</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-mono font-bold">{drug.dose}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600 italic">{result.description}</p>
                )}
              </div>
            ) : (
               <p className="text-green-700 font-medium flex items-center gap-2 bg-green-100/50 p-2 rounded">
                 <Check size={20} /> Pacjent w celu. Utrzymać leczenie.
               </p>
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            Wpisz wartość LDL powyżej, aby otrzymać rekomendację.
          </div>
        )}

        {/* --- SEKCJA KOPIOWANIA (NOTATKA TEKSTOWA) --- */}
        {ldl && result && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-end mb-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Tekst do wklejenia (P1 / Szpital)
              </h4>
              {copied && <span className="text-xs text-green-600 font-medium animate-pulse">Skopiowano!</span>}
            </div>

            {/* Podgląd */}
            <div className="bg-slate-100 p-4 rounded-lg font-mono text-xs text-slate-700 mb-3 whitespace-pre-wrap border border-slate-200">
              {generateMedicalNote()}
            </div>
            
            <button 
              onClick={handleCopy}
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg font-bold transition-all shadow-sm ${
                copied 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-300'
              }`}
            >
              {copied ? <Check size={18} /> : <ClipboardCopy size={18} />}
              {copied ? 'Kopiuj do dokumentacji' : 'Kopiuj treść'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default LipidCalculator;