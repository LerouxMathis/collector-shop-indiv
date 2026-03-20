import React, { useState, useEffect } from 'react';
import keycloak from './config/keycloak';
import Catalog from './components/Catalog';

function App() {
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    keycloak.init({ onLoad: 'login-required', checkLoginIframe: false })
      .then((auth) => {
        setAuthenticated(auth);
        setKeycloakInitialized(true);
        
        // Mécanisme de rafraîchissement du token (Sécurité Proactive)
        keycloak.onTokenExpired = () => {
          console.log('Token expiré, rafraîchissement en cours...');
          keycloak.updateToken(30).catch(() => {
            console.error('Échec du rafraîchissement, déconnexion...');
            keycloak.logout();
          });
        };
      })
      .catch((err) => {
        console.error("Erreur d'initialisation Keycloak", err);
      });
  }, []);

  if (!keycloakInitialized) {
    return <div>Chargement de la sécurisation (Connexion à Keycloak)...</div>;
  }

  if (!authenticated) {
    return <div>Authentification échouée.</div>;
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '40px', maxWidth: '800px', margin: 'auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Collector.shop</h1>
        <div>
          <span>Connecté en tant que <strong>{keycloak.tokenParsed?.preferred_username}</strong> </span>
          <button onClick={() => keycloak.logout()}>Déconnexion</button>
        </div>
      </header>
      <hr />
      <Catalog />
    </div>
  );
}

export default App;