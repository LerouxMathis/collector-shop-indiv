import React from 'react';
import keycloak from './config/keycloak';

const Header = ({ authenticated, onSellClick }) => {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.logoGroup} onClick={() => window.location.href = '/'}>
          <span style={styles.logoIcon}>C</span>
          <span style={styles.logoText}>collector<span style={{color: 'var(--primary-color)'}}>.</span>shop</span>
        </div>

        <div style={styles.actionGroup}>
          {authenticated ? (
            <div style={styles.userSection}>
              <span style={styles.username}>{keycloak.tokenParsed?.preferred_username}</span>
              <button style={styles.secondaryBtn} onClick={() => keycloak.logout()}>Déconnexion</button>
              <button style={styles.sellBtn} onClick={onSellClick}>
                Vendre maintenant
              </button>
            </div>
          ) : (
            <button style={styles.primaryBtn} onClick={() => keycloak.login()}>
              S'inscrire | Se connecter
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#fff',
    borderBottom: '1px solid var(--border)',
    padding: '12px 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoGroup: { display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' },
  logoIcon: { backgroundColor: 'var(--primary-color)', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' },
  logoText: { fontSize: '22px', fontWeight: 'bold', letterSpacing: '-0.5px' },
  actionGroup: { display: 'flex', gap: '15px', alignItems: 'center' },
  userSection: { display: 'flex', alignItems: 'center', gap: '12px', borderRight: '1px solid var(--border)', paddingRight: '15px' },
  username: { fontSize: '14px', fontWeight: '500' },
  primaryBtn: { backgroundColor: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '8px 14px', borderRadius: 'var(--radius)', fontWeight: '500' },
  secondaryBtn: { backgroundColor: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' },
  sellBtn: { backgroundColor: 'var(--primary-color)', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 'var(--radius)', fontWeight: '500' },
};

export default Header;