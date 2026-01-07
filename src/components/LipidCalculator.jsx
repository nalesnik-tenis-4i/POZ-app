import React, { useState, useMemo, useEffect } from 'react';
import { RISK_TARGETS } from '../lipidData';
import { calculateTreatment } from '../lipidUtils';

const LipidCalculator = ({ forcedRisk = null }) => {
  const [ldl, setLdl] = useState('');
  // Jeśli forcedRisk jest podany, użyj go. Jeśli nie, domyślnie VERY_HIGH (lub cokolwiek)
  const [risk, setRisk] = useState(forcedRisk || 'VERY_HIGH');

  // Efekt: Jeśli parent zmieni ryzyko, zaktualizuj local state
  useEffect(() => {
    if (forcedRisk) setRisk(forcedRisk);
  }, [forcedRisk]);

  const result = useMemo(() => calculateTreatment(Number(ldl), risk), [ldl, risk]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
        <h2 className="text-lg font-bold">Krok 2: Cel Terapeutyczny i Leki</h2>
      </div>
      
      <div className="p-6 space-y-4">
        
        {/* Sekcja Ryzyka - Jeśli forcedRisk istnieje, pokazujemy tylko info, jeśli nie - Select */}
        {!forcedRisk ? (
          <div>
            <label className="block text-sm font-medium text-gray-700">Ryzyko</label>
            <select 
              value={risk} 
              onChange={(e) => setRisk(e.target.value)}
              className="mt-1 block w-full border p-2 rounded"
            >
              {Object.entries(RISK_TARGETS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
        ) : (
          // Ukryty input dla logiki, wizualnie obsłużony w CardioApp.jsx
          null 
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Podaj aktualny LDL pacjenta (mg/dL)
          </label>
          <input 
            type="number" 
            value={ldl}
            onChange={(e) => setLdl(e.target.value)}
            className="w-full border-2 border-indigo-100 rounded-md shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500 text-lg"
            placeholder="np. 145"
            autoFocus // Automatyczny focus, żeby lekarz mógł od razu pisać
          />
          <p className="text-xs text-gray-500 mt-1">
            Dlaczego pytam o LDL? W poprzednim kroku podano Cholesterol Całkowity i HDL. 
            Bez trójglicerydów wzór Friedewalda jest nieprecyzyjny. Lepiej podać wynik bezpośredni.
          </p>
        </div>

        <hr className="border-gray-200" />

        {result ? (
          <div className={`p-5 rounded-lg border-l-4 ${result.status === 'OK' ? 'bg-green-50 border-green-500' : 'bg-blue-50 border-blue-600'}`}>
            <div className="flex justify-between items-end mb-4">
              <div>
                <span className="text-sm text-gray-500 block">Cel terapeutyczny</span>
                <span className="text-2xl font-bold text-gray-800">&lt; {result.target} mg/dL</span>
              </div>
              {result.reductionPercent > 0 && (
                 <div className="text-right">
                    <span className="text-sm text-gray-500 block">Wymagana redukcja</span>
                    <span className="text-xl font-bold text-red-600">-{result.reductionPercent}%</span>
                 </div>
              )}
            </div>

            {result.status !== 'OK' && (
              <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
                <h3 className="font-bold text-indigo-900 mb-1">{result.therapyLabel}</h3>
                <p className="text-sm text-gray-600 mb-3 italic">{result.description}</p>
                <ul className="space-y-2">
                  {result.drugs.map((drug, idx) => (
                    <li key={idx} className="flex justify-between items-center border-b pb-1 last:border-0">
                      <span className="font-medium text-gray-800">{drug.name}</span>
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-mono">{drug.dose}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.status === 'OK' && (
               <p className="text-green-700 font-medium flex items-center">
                 <span className="text-xl mr-2">✅</span> {result.message}
               </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 bg-gray-50 rounded border border-dashed border-gray-300">
            Wpisz LDL, aby otrzymać rekomendację lekową.
          </div>
        )}
      </div>
    </div>
  );
};

export default LipidCalculator;