import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { SecurityProvider } from './context/SecurityContext'
import { ToastProvider } from './context/ToastContext'
import { RemoteConfigProvider } from './context/RemoteConfigContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RemoteConfigProvider>
      <AuthProvider>
        <SecurityProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </SecurityProvider>
      </AuthProvider>
    </RemoteConfigProvider>
  </StrictMode>,
)
