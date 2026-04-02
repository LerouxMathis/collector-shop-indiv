import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Catalog from './Catalog';


vi.mock('../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: [
        { id: 1, title: 'Figurine DBZ', price: 25.5, ownerId: 'user-789' }
      ]
    })
  }
}));

describe('Composant Catalog', () => {
  it('doit récupérer et afficher les articles de l\'API', async () => {
    render(<Catalog />);
    expect(await screen.findByText('Figurine DBZ')).toBeInTheDocument();
    expect(await screen.findByText(/25.50 €/)).toBeInTheDocument();
  });
});