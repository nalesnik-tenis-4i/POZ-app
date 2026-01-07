import React, { useState } from 'react';
import RiskAssessmentWizard from './RiskAssessmentWizard';
import LipidCalculator from './LipidCalculator';

const CardioApp = () => {
  // Stan przechowujący wynik oceny ryzyka
  // null = brak oceny (pokaż kreator)
  // object = ocena zakończona (pokaż kalkulator lipidowy)
  const [patientRisk, setPatientRisk] = useState(null);

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 font-sans">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-800">System Decyzyjny Prewencji CVD</h1>
        <p className="text-slate-500 mt-2">Standard ESC 2021/2026 • Region Polska (High Risk)</p>
      </header>

      <main className="max-w-2xl mx-auto">
        {!patientRisk ? (
          /* MODUŁ 1: OCENA RYZYKA */
          <RiskAssessmentWizard 
            onComplete={(riskData) => setPatientRisk(riskData)} 
          />
        ) : (
          /* MODUŁ 2: DOBÓR STATYN */
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            
            {/* Karta informacyjna z wynikiem ryzyka (aby lekarz pamiętał skąd to się wzięło) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-indigo-500 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Zidentyfikowane Ryzyko</p>
                <p className="text-xl font-bold text-gray-800">
                  {patientRisk.label} 
                  {patientRisk.scoreValue && <span className="text-sm font-normal text-gray-500 ml-2">(SCORE2: {patientRisk.scoreValue}%)</span>}
                </p>
              </div>
              <button 
                onClick={() => setPatientRisk(null)}
                className="text-sm text-indigo-600 hover:text-indigo-800 underline"
              >
                Zmień / Przelicz ponownie
              </button>
            </div>

            {/* Właściwy kalkulator leków */}
            <LipidCalculator 
              forcedRisk={patientRisk.category} 
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default CardioApp;