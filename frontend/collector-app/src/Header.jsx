import React from 'react';
import keycloak from './config/keycloak';

const Header = ({ authenticated }) => {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.logoGroup}>
          <span style={styles.logoIcon}>C</span>
          <h1 style={styles.title}>Collector<span style={styles.dot}>.</span>shop</h1>
        </div>
        <div style={styles.userGroup}>
          {authenticated ? (
            <>
              <span style={styles.welcome}>Bonjour, <strong>{keycloak.tokenParsed?.preferred_username}</strong></span>
              <button style={styles.logoutButton} onClick={() => keycloak.logout()}>Déconnexion</button>
            </>
          ) : (
            <button style={styles.loginButton} onClick={() => keycloak.login()}>Se connecter</button>
          )}
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: 'var(--card-background)',
    padding: '16px 0',
    borderBottom: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '700',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-color)',
  },
  dot: {
    color: 'var(--primary-color)',
  },
  userGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  welcome: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
};

export default Header;