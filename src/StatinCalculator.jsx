import React, { useState, useMemo } from 'react';

// 1. Stałe medyczne (Single Source of Truth)
const RISK_TARGETS = {
  VERY_HIGH: 55,
  HIGH: 70,
  MODERATE: 100,
  LOW: 116,
};

const RISK_LABELS = {
  VERY_HIGH: 'Bardzo duże (np. po zawale, cukrzyca z powikłaniami)',
  HIGH: 'Duże (np. długa cukrzyca, wysoki SCORE2)',
  MODERATE: 'Umiarkowane',
  LOW: 'Niskie',
};

// 2. Czysta funkcja logiczna (łatwa do testowania unit testami)
const getRecommendation = (currentLdl, riskCategory) => {
  if (!currentLdl || !riskCategory) return null;

  const target = RISK_TARGETS[riskCategory];
  
  // Jeśli pacjent jest już w celu
  if (currentLdl <= target) {
    return {
      action: "Brak zmian farmakologicznych",
      details: "Pacjent znajduje się w celu terapeutycznym. Utrzymać obecne postępowanie/styl życia.",
      intensity: "none"
    };
  }

  // Obliczamy wymaganą redukcję (w ułamku, np. 0.50 = 50%)
  const reductionNeeded = (currentLdl - target) / currentLdl;
  const reductionPercent = (reductionNeeded * 100).toFixed(1);

  let recommendation = {};

  // Logika doboru siły statyny
  if (reductionNeeded >= 0.55) {
    recommendation = {
      action: "Terapia Skojarzona (Statyna + Ezetymib)",
      details: `Wymagana redukcja to aż ${reductionPercent}%. Monoterapia może nie wystarczyć. Rozważ: Rozuwastatyna 20-40mg + Ezetymib 10mg lub Atorwastatyna 40-80mg + Ezetymib 10mg.`,
      intensity: "extreme"
    };
  } else if (reductionNeeded >= 0.50) {
    recommendation = {
      action: "Silna Statyna (High Intensity)",
      details: `Wymagana redukcja to ${reductionPercent}%. Startuj z: Rozuwastatyna 20-40mg lub Atorwastatyna 40-80mg.`,
      intensity: "high"
    };
  } else if (reductionNeeded >= 0.30) {
    recommendation = {
      action: "Umiarkowana/Silna Statyna",
      details: `Wymagana redukcja to ${reductionPercent}%. Rozważ: Rozuwastatyna 5-10mg lub Atorwastatyna 10-20mg.`,
      intensity: "moderate"
    };
  } else {
    recommendation = {
      action: "Umiarkowana/Słaba Statyna",
      details: `Wymagana redukcja to tylko ${reductionPercent}%. Wystarczy mniejsza dawka lub zmiana stylu życia (jeśli ryzyko niskie).`,
      intensity: "low"
    };
  }

  return { ...recommendation, target, reductionPercent };
};

// 3. Komponent Reacta
const StatinCalculator = () => {
  const [ldl, setLdl] = useState('');
  const [risk, setRisk] = useState('VERY_HIGH');

  // useMemo optymalizuje wydajność - przelicza tylko gdy zmienią się inputy
  const result = useMemo(() => getRecommendation(Number(ldl), risk), [ldl, risk]);

  return (
    <div style={{ padding: '20px', maxWidth: '500px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Kalkulator Doboru Statyn</h2>
      
      {/* Formularz */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>LDL wyjściowy (mg/dL):</label>
        <input 
          type="number" 
          value={ldl} 
          onChange={(e) => setLdl(e.target.value)}
          placeholder="np. 140"
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Ryzyko sercowo-naczyniowe:</label>
        <select 
          value={risk} 
          onChange={(e) => setRisk(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        >
          {Object.entries(RISK_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <hr />

      {/* Wynik */}
      {result ? (
        <div style={{ marginTop: '20px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
          <h3>Zalecenie: {result.action}</h3>
          <p><strong>Cel terapeutyczny:</strong> &lt; {result.target} mg/dL</p>
          <p><strong>Wymagana redukcja:</strong> {result.intensity === 'none' ? '0%' : `${result.reductionPercent}%`}</p>
          <p style={{ color: '#333', marginTop: '10px' }}><em>{result.details}</em></p>
        </div>
      ) : (
        <p style={{ color: '#666' }}>Wpisz wynik LDL, aby otrzymać rekomendację.</p>
      )}
    </div>
  );
};

export default StatinCalculator;