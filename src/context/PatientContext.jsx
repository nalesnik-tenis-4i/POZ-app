import React, { createContext, useState, useEffect, useContext } from 'react';

const PatientContext = createContext();

// Domyślny stan pacjenta (pusty)
const initialPatientState = {
  age: '',
  sex: 'male',
  metrics: { // Dane pomiarowe
    sbp: '',
    cholTotal: '',
    hdl: '',
    ldl: '',
    tg: ''
  },
  risks: [], // Np. ['smoker', 'diabetes']
  diagnosis: null, // Wynik ze SCORE2 (np. 'HIGH')
  recommendations: null // Tekst z kalkulatora statyn
};

export const PatientProvider = ({ children }) => {
  // Próba odczytu z localStorage przy starcie
  const [patientData, setPatientData] = useState(() => {
    const saved = localStorage.getItem('current_patient');
    return saved ? JSON.parse(saved) : initialPatientState;
  });

  // Automatyczny zapis do localStorage przy każdej zmianie
  useEffect(() => {
    localStorage.setItem('current_patient', JSON.stringify(patientData));
  }, [patientData]);

  // Funkcja do aktualizacji konkretnych pól (tzw. deep merge dla wygody)
  const updatePatient = (newData) => {
    setPatientData(prev => ({
      ...prev,
      ...newData,
      metrics: { ...prev.metrics, ...newData.metrics } // łączenie zagnieżdżonych obiektów
    }));
  };

  // Funkcja czyszcząca (Nowy Pacjent)
  const resetPatient = () => {
    setPatientData(initialPatientState);
    localStorage.removeItem('current_patient');
    window.location.reload(); // Najbezpieczniejszy sposób na wyczyszczenie formularzy
  };

  return (
    <PatientContext.Provider value={{ patientData, updatePatient, resetPatient }}>
      {children}
    </PatientContext.Provider>
  );
};

// Własny hook dla wygody (żeby nie pisać ciągle useContext)
export const usePatient = () => useContext(PatientContext);