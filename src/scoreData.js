// scoreData.js

// 1. BRAMKA: Czynniki automatycznie kwalifikujące do wysokiego ryzyka
// Jeśli pacjent ma którykolwiek z nich -> NIE liczymy SCORE2.
export const DIRECT_RISK_FACTORS = [
  { 
    id: 'ascvd', 
    label: 'Udokumentowana choroba sercowo-naczyniowa (ASCVD)', 
    risk: 'VERY_HIGH',
    info: 'Zawał, udar, TIA, miażdżyca w obrazowaniu, rewaskularyzacja.'
  },
  { 
    id: 'dm_severe', 
    label: 'Cukrzyca z powikłaniami narządowymi', 
    risk: 'VERY_HIGH',
    info: 'Np. retinopatia, neuropatia, lub cukrzyca typu 1 > 20 lat.'
  },
  { 
    id: 'dm_long', 
    label: 'Cukrzyca > 10 lat (bez powikłań)', 
    risk: 'HIGH',
    info: 'Bez innych powikłań i czynników ryzyka.'
  },
  { 
    id: 'ckd_severe', 
    label: 'Ciężka przewlekła choroba nerek (eGFR < 30)', 
    risk: 'VERY_HIGH',
    info: ''
  },
  { 
    id: 'ckd_moderate', 
    label: 'Umiarkowana PChN (eGFR 30-59)', 
    risk: 'HIGH',
    info: ''
  },
  { 
    id: 'fh', 
    label: 'Rodzinna Hipercholesterolemia (FH)', 
    risk: 'HIGH',
    info: 'Z automatu wysokie ryzyko.'
  }
];

// 2. INTERPRETACJA WYNIKU SCORE2 (Zależna od wieku!)
// Źródło: ESC Guidelines 2021 (i Twój kod R)
export const getRiskCategory = (scorePercent, age) => {
  const score = Number(scorePercent);
  
  // Grupa < 50 lat
  if (age < 50) {
    if (score < 2.5) return 'LOW';
    if (score < 7.5) return 'MODERATE';
    return 'HIGH'; // >= 7.5
  } 
  
  // Grupa 50 - 69 lat
  else if (age < 70) {
    if (score < 5.0) return 'LOW';
    if (score < 10.0) return 'MODERATE';
    return 'HIGH'; // >= 10
  } 
  
  // Grupa >= 70 lat (SCORE2-OP)
  else {
    if (score < 7.5) return 'LOW';
    if (score < 15.0) return 'MODERATE';
    return 'HIGH'; // >= 15
  }
};

export const RISK_LABELS = {
  LOW: { label: "Niskie", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  MODERATE: { label: "Umiarkowane", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  HIGH: { label: "Wysokie", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  VERY_HIGH: { label: "Bardzo Wysokie", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" }
};