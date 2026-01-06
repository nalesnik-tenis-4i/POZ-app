import React, { useState } from 'react';
import { DIRECT_RISK_FACTORS, getRiskCategory, RISK_LABELS } from './scoreData';
import { calculateScorePol } from './scoreEngine'; 

const RiskAssessmentWizard = ({ onComplete }) => { // PROP onComplete
  const [step, setStep] = useState(1);
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [metrics, setMetrics] = useState({
    age: 55, sex: 'male', smoker: false, sbp: 130, cholMgDl: 190, hdlMgDl: 50
  });

  // Funkcja pomocnicza do zakończenia procesu
  const finishAssessment = (category, scoreValue, source) => {
    // Zamiast tylko ustawiać stan lokalny, przekazujemy dane do rodzica
    // Ale najpierw możemy pokazać podsumowanie lokalnie, lub od razu przejść dalej.
    // Tutaj zrobimy tak: pokażemy wynik, a user kliknie "Dobierz leki"
    
    setInternalResult({ category, scoreValue, source });
    setStep(3);
  };

  const [internalResult, setInternalResult] = useState(null);

  const handleGatekeeper = () => {
    const veryHigh = selectedFactors.find(id => DIRECT_RISK_FACTORS.find(f => f.id === id)?.risk === 'VERY_HIGH');
    if (veryHigh) return finishAssessment('VERY_HIGH', null, 'DIRECT');
    
    const high = selectedFactors.find(id => DIRECT_RISK_FACTORS.find(f => f.id === id)?.risk === 'HIGH');
    if (high) return finishAssessment('HIGH', null, 'DIRECT');

    setStep(2);
  };

  const handleCalculation = () => {
    const scorePercent = calculateScorePol(metrics);
    const category = getRiskCategory(scorePercent, metrics.age);
    finishAssessment(category, scorePercent, 'CALC');
  };

  // --- RENDER (Fragmenty skrócone tam gdzie bez zmian) ---
  
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-slate-800 p-4 text-white">
        <h2 className="text-lg font-bold">Krok 1: Ocena Ryzyka (SCORE2 / Wywiad)</h2>
      </div>
      
      <div className="p-6">
        {step === 1 && (
          /* ... (To samo co wcześniej: Checkboxy + przycisk Dalej) ... */
          <div className="space-y-4">
             {/* ...Kod checkboxów... */}
             {DIRECT_RISK_FACTORS.map(factor => (
                <label key={factor.id} className="flex items-start space-x-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" onChange={() => {
                      if (selectedFactors.includes(factor.id)) setSelectedFactors(prev => prev.filter(x => x !== factor.id));
                      else setSelectedFactors(prev => [...prev, factor.id]);
                  }} className="mt-1"/>
                  <span>{factor.label}</span>
                </label>
             ))}
             <button onClick={handleGatekeeper} className="w-full bg-blue-600 text-white py-2 rounded">Dalej</button>
          </div>
        )}

        {step === 2 && (
          /* ... (To samo co wcześniej: Inputy wieku, cholesterolu itp.) ... */
          <div className="space-y-4">
            {/* Skrócony widok inputów */}
            <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs">Wiek</label><input type="number" value={metrics.age} onChange={e=>setMetrics({...metrics, age: Number(e.target.value)})} className="border p-2 w-full"/></div>
                {/* ... reszta inputów ... */}
                <div><label className="text-xs">TC (mg/dL)</label><input type="number" value={metrics.cholMgDl} onChange={e=>setMetrics({...metrics, cholMgDl: Number(e.target.value)})} className="border p-2 w-full"/></div>
                <div><label className="text-xs">HDL (mg/dL)</label><input type="number" value={metrics.hdlMgDl} onChange={e=>setMetrics({...metrics, hdlMgDl: Number(e.target.value)})} className="border p-2 w-full"/></div>
            </div>
            <button onClick={handleCalculation} className="w-full bg-indigo-600 text-white py-2 rounded">Oblicz</button>
          </div>
        )}

        {step === 3 && internalResult && (
          <div className="text-center space-y-6">
            <div className={`p-6 rounded-xl border-2 ${RISK_LABELS[internalResult.category].bg} ${RISK_LABELS[internalResult.category].border}`}>
              <h3 className={`text-2xl font-bold ${RISK_LABELS[internalResult.category].color}`}>
                {RISK_LABELS[internalResult.category].label}
              </h3>
              {internalResult.scoreValue && <p className="text-xl font-mono mt-2">{internalResult.scoreValue}%</p>}
            </div>
            
            <p className="text-gray-600">Ocena zakończona. Przejdź do ustalenia celu terapeutycznego.</p>
            
            <button 
              onClick={() => onComplete({ 
                category: internalResult.category, 
                label: RISK_LABELS[internalResult.category].label,
                scoreValue: internalResult.scoreValue 
              })}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-lg flex justify-center items-center"
            >
              Przejdź do Doboru Leków &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskAssessmentWizard;