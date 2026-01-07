// scoreUtils.js
import { SCORE_THRESHOLDS, DIRECT_RISK_FACTORS } from './scoreData';

// --- LOGIKA BRAMKI (GATEKEEPER) ---
export const assessDirectRisk = (checkedFactors) => {
  // checkedFactors to tablica ID, np. ['dm_long', 'ckd_moderate']
  
  // Szukamy najwyższego ryzyka (Very High > High)
  const hasVeryHigh = checkedFactors.some(id => 
    DIRECT_RISK_FACTORS.find(f => f.id === id)?.risk === 'VERY_HIGH'
  );
  
  if (hasVeryHigh) return 'VERY_HIGH';

  const hasHigh = checkedFactors.some(id => 
    DIRECT_RISK_FACTORS.find(f => f.id === id)?.risk === 'HIGH'
  );

  if (hasHigh) return 'HIGH';

  return null; // Brak automatycznego ryzyka -> idź do SCORE2
};


// --- LOGIKA SCORE2 ---
export const interpretScoreResult = (scoreValue, age) => {
  let thresholds;

  if (age < 50) thresholds = SCORE_THRESHOLDS.UNDER_50;
  else if (age < 70) thresholds = SCORE_THRESHOLDS.AGE_50_69;
  else thresholds = SCORE_THRESHOLDS.OVER_70;

  if (scoreValue < thresholds.low) return 'LOW';
  if (scoreValue < thresholds.high) return 'MODERATE';
  if (scoreValue >= thresholds.high) return 'HIGH'; 
  // Uwaga: SCORE2 rzadko definiuje 'Very High' dla populacji ogólnej bez chorób, 
  // ale >10-15% często traktuje się klinicznie bardzo poważnie.
  return 'HIGH'; 
};

// Symulacja obliczeń (Placeholder dla algorytmu Coxa)
// W prawdziwej appce tutaj wstawiasz bibliotekę "esc-score-calculation" 
// lub wielką mapę współczynników dla Polski.
export const calculateScoreValue = ({ age, sex, smoker, sbp, nonHdl }) => {
  // Prosty algorytm heurystyczny dla celów demo (nie używać klinicznie!)
  let base = 1;
  
  // Wiek to główny driver
  base += (age - 40) * 0.2; 
  
  // Mężczyźni mają wyższe ryzyko
  if (sex === 'male') base *= 1.5;
  
  // Palenie
  if (smoker) base *= 2.0;
  
  // Ciśnienie (każde 20mmHg powyżej 120 podbija ryzyko)
  if (sbp > 120) base += ((sbp - 120) / 20) * 1.5;
  
  // Cholesterol
  if (nonHdl > 100) base += ((nonHdl - 100) / 40) * 1.0;

  return base.toFixed(1); // Zwraca % ryzyka (np. 4.5)
};