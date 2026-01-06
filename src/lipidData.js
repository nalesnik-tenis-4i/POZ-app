// lipidData.js

export const RISK_TARGETS = {
  VERY_HIGH: { 
    target: 55, 
    label: "Bardzo wysokie (np. po zawale, cukrzyca powikłana, SCORE2 > 7.5-10%)" 
  },
  HIGH: { 
    target: 70, 
    label: "Wysokie (np. długa cukrzyca, BP > 180/110, SCORE2 5-10%)" 
  },
  MODERATE: { 
    target: 100, 
    label: "Umiarkowane (SCORE2 1-5%)" 
  },
  LOW: { 
    target: 116, 
    label: "Niskie (SCORE2 < 1%)" 
  }
};

// Tzw. "bins" - koszyki terapeutyczne w zależności od wymaganej redukcji
export const THERAPY_TIERS = [
  {
    minReduction: 55, // Powyżej 55% redukcji
    label: "Terapia Skojarzona (Statyna + Ezetymib)",
    description: "Monoterapia statyną ma sufit skuteczności ok. 50-60%. Konieczne dodanie ezetymibu.",
    drugs: [
      { name: "Atorwastatyna + Ezetymib", dose: "40-80 mg + 10 mg" },
      { name: "Rozuwastatyna + Ezetymib", dose: "20-40 mg + 10 mg" }
    ]
  },
  {
    minReduction: 50, // 50-55%
    label: "Statyna o wysokiej intensywności (High Intensity)",
    description: "Cel to redukcja o ≥50%. Wymagane najwyższe dawki.",
    drugs: [
      { name: "Atorwastatyna", dose: "40-80 mg" },
      { name: "Rozuwastatyna", dose: "20-40 mg" }
    ]
  },
  {
    minReduction: 30, // 30-49%
    label: "Statyna o umiarkowanej intensywności (Moderate Intensity)",
    description: "Standardowe leczenie dla umiarkowanego ryzyka.",
    drugs: [
      { name: "Atorwastatyna", dose: "10-20 mg" },
      { name: "Rozuwastatyna", dose: "5-10 mg" },
      { name: "Simwastatyna", dose: "20-40 mg" } // Opcjonalnie, coraz rzadziej stosowana
    ]
  },
  {
    minReduction: 0, // < 30%
    label: "Statyna o niskiej intensywności / Styl życia",
    description: "Wymagana niewielka korekta.",
    drugs: [
      { name: "Simwastatyna", dose: "10 mg" },
      { name: "Prawastatyna", dose: "20-40 mg" }
    ]
  }
];