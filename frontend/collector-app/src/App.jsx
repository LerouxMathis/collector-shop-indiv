import React, { useState, useEffect } from 'react';
import keycloak from './config/keycloak';
import Catalog from './components/Catalog';
import Header from './Header';
import './App.css';

function App() {
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  

  useEffect(() => {
    keycloak.init({ onLoad: 'check-sso', checkLoginIframe: false })
      .then((auth) => {
        setAuthenticated(auth);
        setKeycloakInitialized(true);
        keycloak.onTokenExpired = () => {
          keycloak.updateToken(30).catch(() => {
            keycloak.logout();
          });
        };
      })
      .catch((err) => {
        console.error("Erreur d'initialisation Keycloak", err);
      });
  }, []);

  if (!keycloakInitialized) {
    return <div style={styles.loading}>Chargement de Collector.shop...</div>;
  }

    return (
    <div>
      <Header 
        authenticated={authenticated} 
        onSellClick={() => setShowAddForm(!showAddForm)} 
      />
      <main className="main-container">
        <Catalog 
          authenticated={authenticated} 
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
        />
      </main>
    </div>
  );
}

const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: 'var(--primary-color)',
  },
  error: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: 'red',
  },
};

export default App;