import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppWithErrorHandling } from './components/AppWithErrorHandling'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithErrorHandling />
  </StrictMode>,
)
