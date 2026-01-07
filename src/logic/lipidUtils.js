// lipidUtils.js
import { RISK_TARGETS, THERAPY_TIERS } from '../data/lipidData';

export const calculateTreatment = (currentLdl, riskCategory) => {
  // Walidacja
  if (!currentLdl || !riskCategory || currentLdl <= 0) return null;

  const targetInfo = RISK_TARGETS[riskCategory];
  const target = targetInfo.target;

  // 1. Sprawdź czy pacjent jest w celu
  if (currentLdl <= target) {
    return {
      status: "OK",
      target,
      reductionNeeded: 0,
      message: "Pacjent w celu terapeutycznym. Utrzymać obecne leczenie."
    };
  }

  // 2. Oblicz redukcję
  const reductionFraction = (currentLdl - target) / currentLdl;
  const reductionPercent = reductionFraction * 100;

  // 3. Znajdź odpowiedni koszyk leków (find zwraca pierwszy pasujący warunek)
  const therapy = THERAPY_TIERS.find(tier => reductionPercent >= tier.minReduction);

  return {
    status: "ACTION_REQUIRED",
    target,
    reductionPercent: reductionPercent.toFixed(1),
    therapyLabel: therapy?.label || "Konsultacja specjalistyczna", // Fallback dla ekstremalnych wartości
    description: therapy?.description,
    drugs: therapy?.drugs || []
  };
};

