import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, Activity, Calculator, HeartPulse, Info } from 'lucide-react';
import { DIRECT_RISK_FACTORS, getRiskCategory, RISK_LABELS } from '../data/scoreData';
import { calculateScorePol } from '../logic/scoreEngine'; 

const RISK_WEIGHTS = {
  LOW: 1,
  MODERATE: 2,
  HIGH: 3,
  VERY_HIGH: 4
};

const RiskAssessmentWizard = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  
  // LEWA STRONA: Czynniki bezpośrednie
  const [selectedFactors, setSelectedFactors] = useState([]);

  // PRAWA STRONA: Dane do SCORE2 (Domyślnie puste)
  const [metrics, setMetrics] = useState({
    age: '', sex: 'male', smoker: false, sbp: '', cholMgDl: '', hdlMgDl: ''
  });

  // Stan wyniku końcowego
  const [finalResult, setFinalResult] = useState(null);

  // Helper: Obliczanie Non-HDL dla podglądu (tylko gdy mamy dane)
  const nonHdlDisplay = (metrics.cholMgDl && metrics.hdlMgDl) 
    ? metrics.cholMgDl - metrics.hdlMgDl 
    : null;

  // --- LOGIKA OBLICZEŃ ---
  const handleCalculateAll = () => {
    // Walidacja: Czy mamy cokolwiek do oceny?
    const hasDirectFactors = selectedFactors.length > 0;
    const hasScoreData = metrics.age && metrics.sbp && metrics.cholMgDl && metrics.hdlMgDl;

    if (!hasDirectFactors && !hasScoreData) {
      alert("Wprowadź parametry SCORE2 lub zaznacz czynniki ryzyka w lewej kolumnie.");
      return;
    }

    // 1. Analiza Lewej Kolumny (Direct Factors)
    let directRisk = null;
    if (hasDirectFactors) {
      const hasVeryHigh = selectedFactors.some(id => 
        DIRECT_RISK_FACTORS.find(f => f.id === id)?.risk === 'VERY_HIGH'
      );
      directRisk = hasVeryHigh 
        ? { category: 'VERY_HIGH', label: 'Bardzo Wysokie' } 
        : { category: 'HIGH', label: 'Wysokie' };
    }

    // 2. Analiza Prawej Kolumny (SCORE2 Engine) - Tylko jeśli dane są pełne
    let scoreResult = null;
    if (hasScoreData) {
      const scorePercent = calculateScorePol(metrics);
      const category = getRiskCategory(scorePercent, metrics.age);
      scoreResult = { category, scoreValue: scorePercent };
    }

    // 3. Porównanie (Max Risk)
    // Domyślnie wygrywa Direct (jeśli jest), chyba że Score (jeśli jest) jest wyższy.
    let winnerCategory = 'LOW';
    let winningScoreValue = null;

    if (directRisk && !scoreResult) {
      // Tylko ryzyko bezpośrednie
      winnerCategory = directRisk.category;
    } else if (!directRisk && scoreResult) {
      // Tylko SCORE2
      winnerCategory = scoreResult.category;
      winningScoreValue = scoreResult.scoreValue;
    } else {
      // Mamy oba -> Porównujemy wagi
      const directWeight = RISK_WEIGHTS[directRisk.category];
      const scoreWeight = RISK_WEIGHTS[scoreResult.category];

      if (scoreWeight > directWeight) {
        winnerCategory = scoreResult.category;
        winningScoreValue = scoreResult.scoreValue;
      } else {
        winnerCategory = directRisk.category;
        // Jeśli SCORE został policzony, ale przegrał wagą, i tak możemy go zachować dla info
        winningScoreValue = scoreResult.scoreValue; 
      }
    }

    setFinalResult({
      category: winnerCategory,
      scoreValue: winningScoreValue
    });
    
    setStep(2); // Przejście do podsumowania
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300">
      
      {/* NAGŁÓWEK */}
      <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
        <h2 className="text-lg font-bold flex items-center gap-2">
          {step === 1 ? <><HeartPulse size={20}/> Ocena Ryzyka Sercowo-Naczyniowego</> : <><Activity size={20}/> Podsumowanie</>}
        </h2>
      </div>
      
      <div className="p-6">
        
        {/* --- WIDOK 1: Dwie Kolumny (Input) --- */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* KOLUMNA LEWA: WYKLUCZENIA / RYZYKO BEZPOŚREDNIE */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col h-full">
                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500"/>
                  1. Obciążenia (Wykluczenia)
                </h3>
                
                <div className="space-y-2 flex-grow">
                  {DIRECT_RISK_FACTORS.map(factor => {
                    const isChecked = selectedFactors.includes(factor.id);
                    return (
                      <label 
                        key={factor.id} 
                        className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${
                          isChecked ? 'bg-white border-indigo-400 shadow-sm' : 'bg-slate-100/50 border-transparent hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) setSelectedFactors(prev => prev.filter(x => x !== factor.id));
                            else setSelectedFactors(prev => [...prev, factor.id]);
                          }} 
                          className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <div>
                          <span className={`text-sm font-semibold ${isChecked ? 'text-indigo-900' : 'text-slate-700'}`}>
                            {factor.label}
                          </span>
                          {factor.info && <p className="text-xs text-slate-400 mt-0.5">{factor.info}</p>}
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* INFO BOX - Pojawia się po zaznaczeniu czegokolwiek */}
                {selectedFactors.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-900 text-sm rounded animate-in fade-in duration-300">
                    <div className="flex gap-2 items-start">
                      <Info size={18} className="shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold mb-1">Informacja kliniczna</p>
                        <p className="opacity-90 leading-relaxed text-xs">
                          Skale ryzyka (jak SCORE2) nie zostały zaprojektowane dla pacjentów z tymi obciążeniami. 
                          Obecność tych czynników automatycznie kwalifikuje do grupy wysokiego lub bardzo wysokiego ryzyka.
                          <br/><br/>
                          Możesz pominąć sekcję 2 (kalkulator), chyba że chcesz sprawdzić parametry lipidowe.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* KOLUMNA PRAWA: DANE DO SCORE2 */}
              <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm relative flex flex-col h-full">
                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Calculator size={18} className="text-indigo-500"/>
                  2. Parametry Pacjenta (SCORE2)
                </h3>
                
                <div className="space-y-5 flex-grow">
                  {/* Wiek i Płeć */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Wiek</label>
                      <input 
                        type="number" value={metrics.age} 
                        onChange={e=>setMetrics({...metrics, age: e.target.value})} 
                        className="w-full mt-1 p-2 border rounded font-mono text-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-200"
                        placeholder="Lat"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Płeć</label>
                      <div className="flex mt-1">
                        <button onClick={()=>setMetrics({...metrics, sex: 'male'})} className={`flex-1 py-2 text-sm border-y border-l rounded-l ${metrics.sex==='male' ? 'bg-indigo-600 text-white' : 'bg-slate-50 hover:bg-slate-100'}`}>M</button>
                        <button onClick={()=>setMetrics({...metrics, sex: 'female'})} className={`flex-1 py-2 text-sm border rounded-r ${metrics.sex==='female' ? 'bg-pink-600 text-white' : 'bg-slate-50 hover:bg-slate-100'}`}>K</button>
                      </div>
                    </div>
                  </div>

                  {/* Papierosy */}
                  <label className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" checked={metrics.smoker} onChange={e=>setMetrics({...metrics, smoker: e.target.checked})} className="w-5 h-5 text-indigo-600"/>
                    <span className="font-medium text-slate-700">Aktywny palacz tytoniu</span>
                  </label>

                  {/* Parametry Laboratorium */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed">
                     <div className="col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Ciśnienie SBP (mmHg)</label>
                        <input 
                          type="number" value={metrics.sbp} onChange={e=>setMetrics({...metrics, sbp: e.target.value})} 
                          className="w-full p-2 border rounded font-mono text-lg placeholder-gray-200"
                          placeholder="np. 130"
                        />
                     </div>
                     
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Chol. Całkowity</label>
                        <input 
                          type="number" value={metrics.cholMgDl} onChange={e=>setMetrics({...metrics, cholMgDl: e.target.value})} 
                          className="w-full p-2 border rounded font-mono text-lg placeholder-gray-200"
                          placeholder="mg/dL"
                        />
                     </div>
                     
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">HDL</label>
                        <input 
                          type="number" value={metrics.hdlMgDl} onChange={e=>setMetrics({...metrics, hdlMgDl: e.target.value})} 
                          className="w-full p-2 border rounded font-mono text-lg placeholder-gray-200"
                          placeholder="mg/dL"
                        />
                     </div>
                  </div>

                  {/* Podgląd Non-HDL */}
                  <div className={`p-2 rounded text-center border transition-colors ${nonHdlDisplay ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-transparent'}`}>
                    <span className="text-xs text-slate-500 font-bold uppercase mr-2">Wyliczony Non-HDL:</span>
                    {nonHdlDisplay ? (
                       <><span className="font-mono font-bold text-indigo-900">{nonHdlDisplay}</span> <span className="text-xs">mg/dL</span></>
                    ) : (
                       <span className="text-xs text-slate-300 italic">Wpisz TC i HDL</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BAR */}
            <div className="mt-8 pt-4 border-t flex justify-end">
              <button 
                onClick={handleCalculateAll}
                className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-3"
              >
                Analizuj i Oblicz Ryzyko <ArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* --- WIDOK 2: Wynik (Podsumowanie) --- */}
        {step === 2 && finalResult && (
          <div className="text-center space-y-8 animate-in zoom-in-95 duration-300 py-4">
            
            <div className={`p-10 rounded-xl border-4 ${RISK_LABELS[finalResult.category].bg} ${RISK_LABELS[finalResult.category].border} shadow-lg max-w-2xl mx-auto`}>
              
              <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-2 text-slate-600">
                Zidentyfikowana Kategoria
              </p>
              
              <h2 className="text-xl font-bold text-slate-800 mb-1">
                Ryzyko sercowo-naczyniowe
              </h2>
              
              <h3 className={`text-4xl md:text-5xl font-extrabold ${RISK_LABELS[finalResult.category].color}`}>
                {RISK_LABELS[finalResult.category].label}
              </h3>

              {finalResult.scoreValue && (
                <p className="mt-4 text-sm text-slate-500 font-mono">
                  SCORE2: {finalResult.scoreValue}%
                </p>
              )}
            </div>
            
            <div className="flex gap-4 justify-center pt-4">
              <button onClick={()=>setStep(1)} className="px-6 py-3 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium transition">
                Wróć i popraw dane
              </button>
              <button 
                onClick={() => onComplete({ 
                  category: finalResult.category, 
                  label: RISK_LABELS[finalResult.category].label,
                  scoreValue: finalResult.scoreValue 
                })}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 hover:shadow-lg transition flex items-center gap-2"
              >
                Dobierz terapię <ArrowRight size={20}/>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RiskAssessmentWizard;