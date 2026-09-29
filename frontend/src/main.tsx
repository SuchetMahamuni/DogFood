import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Apply port-based color theme before React renders (avoids flash)
import { bootTheme } from './lib/themes'
bootTheme()
// Init auth store (registers the 401 logout listener)
import './store/authStore'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
