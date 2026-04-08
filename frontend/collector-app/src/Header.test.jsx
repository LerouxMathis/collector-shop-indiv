import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';
import keycloak from './config/keycloak';

vi.mock('./config/keycloak', () => ({
  default: {
    tokenParsed: {
      preferred_username: 'MathisTest'
    },
    logout: vi.fn()
  }
}));

describe('Header Component', () => {
  it('doit afficher le nom de l application et le logo', () => {
    render(<Header />);
    expect(screen.getByText(/Collector/i)).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('doit afficher le nom de l utilisateur connecté via Keycloak', () => {
    render(<Header />);
    expect(screen.getByText(/MathisTest/i)).toBeInTheDocument();
  });

  it('doit appeler la fonction logout de Keycloak lors du clic sur le bouton', () => {
    render(<Header />);
    const logoutButton = screen.getByRole('button', { name: /Déconnexion/i });
    
    fireEvent.click(logoutButton);
    expect(keycloak.logout).toHaveBeenCalledTimes(1);
  });
});