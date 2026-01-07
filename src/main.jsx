import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Importujemy Twój główny komponent z nowego folderu
import CardioApp from './components/CardioApp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CardioApp />
  </StrictMode>,
)