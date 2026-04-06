import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import keycloak from './config/keycloak';

vi.mock('./Header', () => ({ default: () => <div data-testid="header-mock">Header</div> }));
vi.mock('./components/Catalog', () => ({ default: () => <div data-testid="catalog-mock">Catalog</div> }));
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
    keycloak.init.mockReturnValue(new Promise(() => {})); 
    
    render(<App />);
    
    expect(screen.getByText(/Connexion sécurisée en cours.../i)).toBeInTheDocument();
  });

  it('doit afficher le Header et le Catalog après une authentification réussie', async () => {
    keycloak.init.mockResolvedValue(true);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('header-mock')).toBeInTheDocument();
      expect(screen.getByTestId('catalog-mock')).toBeInTheDocument();
    });
  });

  it('doit afficher un message d erreur si l authentification échoue', async () => {
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