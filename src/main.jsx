import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { SecurityProvider } from './context/SecurityContext'
import { ToastProvider } from './context/ToastContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SecurityProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </SecurityProvider>
    </AuthProvider>
  </StrictMode>,
)
