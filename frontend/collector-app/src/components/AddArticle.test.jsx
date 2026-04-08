import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddArticle from '../components/AddArticle';
import api from '../services/api';

vi.mock('../services/api');
const mockOnArticleAdded = vi.fn();
const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('AddArticle Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('doit mettre à jour les champs de saisie quand l utilisateur tape dedans', () => {
    render(<AddArticle onArticleAdded={mockOnArticleAdded} />);
    
    const titleInput = screen.getByPlaceholderText(/Ex: Carte Pokémon/i);
    const priceInput = screen.getByPlaceholderText(/Ex: 150.00/i);

    fireEvent.change(titleInput, { target: { value: 'Console GameBoy' } });
    fireEvent.change(priceInput, { target: { value: '80' } });

    expect(titleInput.value).toBe('Console GameBoy');
    expect(priceInput.value).toBe('80');
  });

  it('doit envoyer les données et vider le formulaire en cas de succès', async () => {
    const fakeResponse = { data: { id: 1, title: 'Console GameBoy', price: 80 } };
    api.post.mockResolvedValue(fakeResponse);

    render(<AddArticle onArticleAdded={mockOnArticleAdded} />);
    
    const titleInput = screen.getByPlaceholderText(/Ex: Carte Pokémon/i);
    const priceInput = screen.getByPlaceholderText(/Ex: 150.00/i);
    const submitButton = screen.getByRole('button', { name: /Publier l'annonce/i });
    fireEvent.change(titleInput, { target: { value: 'Console GameBoy' } });
    fireEvent.change(priceInput, { target: { value: '80' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/articles', { title: 'Console GameBoy', price: 80 });
      expect(mockOnArticleAdded).toHaveBeenCalledWith(fakeResponse.data);
      expect(titleInput.value).toBe('');
      expect(priceInput.value).toBe('');
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Article créé'));
    });
  });

  it('doit afficher une erreur en console et une alerte si l API échoue', async () => {
    api.post.mockRejectedValue(new Error('Erreur API'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<AddArticle onArticleAdded={mockOnArticleAdded} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Publier l'annonce/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Erreur de création'));
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });
});