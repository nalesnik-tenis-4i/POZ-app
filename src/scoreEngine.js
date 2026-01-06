// scoreEngine.js

// Stałe kalibracyjne dla regionu HIGH RISK (Polska)
// Wyciągnięte z sekcji "High Risk" w Twoim kodzie R
const SCALES = {
  male_under70:   { scale1: 0.3207, scale2: 0.9360 },
  female_under70: { scale1: 0.5710, scale2: 0.9369 },
  male_over70:    { scale1: 0.08,   scale2: 1.15 },   // SCORE2-OP
  female_over70:  { scale1: 0.38,   scale2: 1.09 }    // SCORE2-OP
};

export const calculateScorePol = ({ age, sex, smoker, sbp, cholMgDl, hdlMgDl }) => {
  // 1. Konwersja jednostek (mg/dL -> mmol/L)
  const totalChol = cholMgDl / 38.67;
  const hdlChol = hdlMgDl / 38.67;
  
  // 2. Normalizacja inputów
  const isSmoker = smoker ? 1 : 0;
  // Cukrzyca zawsze 0, bo cukrzycy nie wchodzą do SCORE2 w algorytmie decyzyjnym
  const diabetes = 0; 
  
  let riskPercent = 0;

  // --- LOGIKA DLA WIEKU < 70 (SCORE2) ---
  if (age < 70) {
    // Zmienne pomocnicze (centrowanie)
    const ageFactor = (age - 60) / 5;
    const sbpFactor = (sbp - 120) / 20;
    const cholFactor = (totalChol - 6);
    const hdlFactor = (hdlChol - 1.3) / 0.5;

    if (sex === 'male') {
      // Formuła dla mężczyzn < 70 (High Risk)
      const linearSum = 
        0.3742 * ageFactor +
        0.6012 * isSmoker +
        0.2777 * sbpFactor +
        0.6457 * diabetes +
        0.1458 * cholFactor +
        (-0.2698) * hdlFactor +
        (-0.0755) * ageFactor * isSmoker +
        (-0.0255) * ageFactor * sbpFactor +
        (-0.0281) * ageFactor * cholFactor +
        0.0426 * ageFactor * hdlFactor +
        (-0.0983) * ageFactor * diabetes;

      const baselineRisk = 1 - Math.pow(0.9605, Math.exp(linearSum));
      // Rekalibracja
      riskPercent = 1 - Math.exp(-Math.exp(SCALES.male_under70.scale1 + SCALES.male_under70.scale2 * Math.log(-Math.log(1 - baselineRisk))));
    
    } else { // female
      // Formuła dla kobiet < 70 (High Risk)
      const linearSum = 
        0.4648 * ageFactor +
        0.7744 * isSmoker +
        0.3131 * sbpFactor +
        0.8096 * diabetes +
        0.1002 * cholFactor +
        (-0.2606) * hdlFactor +
        (-0.1088) * ageFactor * isSmoker +
        (-0.0277) * ageFactor * sbpFactor +
        (-0.0226) * ageFactor * cholFactor +
        0.0613 * ageFactor * hdlFactor +
        (-0.1272) * ageFactor * diabetes;

      const baselineRisk = 1 - Math.pow(0.9776, Math.exp(linearSum));
      riskPercent = 1 - Math.exp(-Math.exp(SCALES.female_under70.scale1 + SCALES.female_under70.scale2 * Math.log(-Math.log(1 - baselineRisk))));
    }
  } 
  
  // --- LOGIKA DLA WIEKU >= 70 (SCORE2-OP) ---
  else {
    const ageFactorOP = (age - 73);
    const sbpFactorOP = (sbp - 150);
    const cholFactorOP = (totalChol - 6);
    const hdlFactorOP = (hdlChol - 1.4);

    if (sex === 'male') {
       const linearSum = 
         0.0634 * ageFactorOP +
         0.4245 * diabetes +
         0.3524 * isSmoker +
         0.0094 * sbpFactorOP +
         0.0850 * cholFactorOP +
         (-0.3564) * hdlFactorOP +
         (-0.0174) * ageFactorOP * diabetes +
         (-0.0247) * ageFactorOP * isSmoker +
         (-0.0005) * ageFactorOP * sbpFactorOP +
         0.0073 * ageFactorOP * cholFactorOP +
         0.0091 * ageFactorOP * hdlFactorOP;

       // Uwaga: w kodzie R jest przesunięcie -0.0929 w wykładniku dla OP male
       const baselineRisk = 1 - Math.pow(0.7576, Math.exp(linearSum - 0.0929));
       riskPercent = 1 - Math.exp(-Math.exp(SCALES.male_over70.scale1 + SCALES.male_over70.scale2 * Math.log(-Math.log(1 - baselineRisk))));

    } else { // female OP
       const linearSum = 
         0.0789 * ageFactorOP +
         0.6010 * diabetes +
         0.4921 * isSmoker +
         0.0102 * sbpFactorOP +
         0.0605 * cholFactorOP +
         (-0.3040) * hdlFactorOP +
         (-0.0107) * ageFactorOP * diabetes +
         (-0.0255) * ageFactorOP * isSmoker +
         (-0.0004) * ageFactorOP * sbpFactorOP +
         (-0.0009) * ageFactorOP * cholFactorOP +
         0.0154 * ageFactorOP * hdlFactorOP;

       // Uwaga: w kodzie R jest przesunięcie -0.229 dla OP female
       const baselineRisk = 1 - Math.pow(0.8082, Math.exp(linearSum - 0.229));
       riskPercent = 1 - Math.exp(-Math.exp(SCALES.female_over70.scale1 + SCALES.female_over70.scale2 * Math.log(-Math.log(1 - baselineRisk))));
    }
  }

  return (riskPercent * 100).toFixed(1); // Zwracamy wynik w %
};