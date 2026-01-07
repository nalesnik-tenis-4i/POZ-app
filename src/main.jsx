import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App' // Wracamy do nazwy App jako routera
import { PatientProvider } from './context/PatientContext'; // <--- Import

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PatientProvider>  {/* <--- Owiń App */}
      <App />
    </PatientProvider>
  </StrictMode>,
)