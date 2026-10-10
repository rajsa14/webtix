import '@fontsource/instrument-sans/400.css'
import '@fontsource/instrument-sans/500.css'
import '@fontsource/instrument-sans/700.css'
import '@fontsource/instrument-sans/700-italic.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/caveat/700.css'
// Only the Šlapadlo "after" screen uses Archivo; browsers download a face only when text uses it.
import '@fontsource-variable/archivo/wdth.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
