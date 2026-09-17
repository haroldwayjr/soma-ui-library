import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initColorScheme } from '@nova/ui'
import '@fontsource/figtree/400.css'
import '@fontsource/figtree/500.css'
import '@fontsource/figtree/600.css'
import '@fontsource/figtree/700.css'
import '@nova/ui/styles.css'
import './styles/soma-bridge.css.ts'
import './index.css'
import App from './App.tsx'

initColorScheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
