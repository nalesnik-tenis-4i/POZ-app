import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App' // Wracamy do nazwy App jako routera

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)