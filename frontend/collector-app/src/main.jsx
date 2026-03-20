import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode désactivé temporairement pour éviter le double-appel d'initialisation Keycloak en dev
  <App />
)