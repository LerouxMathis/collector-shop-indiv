import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import keycloak from './config/keycloak';

vi.mock('./Header', () => ({ 
  default: ({ authenticated }) => <div data-testid="header-mock">Header {authenticated ? 'Auth' : 'Guest'}</div> 
}));
vi.mock('./components/Catalog', () => ({ 
  default: ({ authenticated }) => <div data-testid="catalog-mock">Catalog {authenticated ? 'Auth' : 'Guest'}</div> 
}));

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
    expect(screen.getByText(/Chargement de Collector.shop.../i)).toBeInTheDocument();
  });

  it('doit afficher le Header et le Catalog en mode AUTH après succès', async () => {
    keycloak.init.mockResolvedValue(true);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Header Auth/i)).toBeInTheDocument();
      expect(screen.getByText(/Catalog Auth/i)).toBeInTheDocument();
    });
  });

  it('doit afficher le Header et le Catalog en mode INVITÉ si non connecté (check-sso)', async () => {
    keycloak.init.mockResolvedValue(false);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Header Guest/i)).toBeInTheDocument();
      expect(screen.getByText(/Catalog Guest/i)).toBeInTheDocument();
    });
  });

  it('doit logger une erreur en console si Keycloak crash', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    keycloak.init.mockRejectedValue(new Error('Network Error'));

    render(<App />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Erreur d'initialisation Keycloak"), 
        expect.any(Error)
      );
    });
    consoleSpy.mockRestore();
  });
});