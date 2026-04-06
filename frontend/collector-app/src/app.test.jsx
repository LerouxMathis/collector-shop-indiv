import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import keycloak from './config/keycloak';

// 1. On Mock les composants enfants pour isoler le test de App.jsx
vi.mock('./Header', () => ({ default: () => <div data-testid="header-mock">Header</div> }));
vi.mock('./components/Catalog', () => ({ default: () => <div data-testid="catalog-mock">Catalog</div> }));

// 2. On Mock la configuration Keycloak
vi.mock('./config/keycloak', () => ({
  default: {
    init: vi.fn(),
    logout: vi.fn(),
    updateToken: vi.fn(),
    token: 'fake-token'
  }
}));

describe('App Component (Security Root)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('doit afficher l écran de chargement au démarrage', () => {
    // On simule une promesse qui ne se résout pas immédiatement
    keycloak.init.mockReturnValue(new Promise(() => {})); 
    
    render(<App />);
    
    expect(screen.getByText(/Connexion sécurisée en cours.../i)).toBeInTheDocument();
  });

  it('doit afficher le Header et le Catalog après une authentification réussie', async () => {
    // On simule un succès d'auth
    keycloak.init.mockResolvedValue(true);

    render(<App />);

    // On attend que l'état interne React change
    await waitFor(() => {
      expect(screen.getByTestid('header-mock')).toBeInTheDocument();
      expect(screen.getByTestid('catalog-mock')).toBeInTheDocument();
    });
  });

  it('doit afficher un message d erreur si l authentification échoue', async () => {
    // On simule une initialisation réussie mais un utilisateur non-authentifié
    keycloak.init.mockResolvedValue(false);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Échec de l'authentification/i)).toBeInTheDocument();
    });
  });

  it('doit logger une erreur en console si Keycloak crash', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    keycloak.init.mockRejectedValue(new Error('Network Error'));

    render(<App />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Erreur d'initialisation Keycloak"), expect.any(Error));
    });
    consoleSpy.mockRestore();
  });
});