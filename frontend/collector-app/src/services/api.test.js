import { describe, it, expect, vi, beforeEach } from 'vitest';
import keycloak from '../config/keycloak';

vi.mock('../config/keycloak', () => ({
  default: {
    token: null
  }
}));

describe('API Service (Axios Interceptor)', () => {
  
  beforeEach(() => {
    vi.resetModules();
    keycloak.token = null;
  });

  it('doit ajouter le header Authorization si un token est présent', async () => {
    const api = (await import('./api')).default;
    keycloak.token = 'fake-jwt-token';
    const config = { headers: {} };
    const requestInterceptor = api.interceptors.request.handlers[0].fulfilled;
    const resultConfig = requestInterceptor(config);
    expect(resultConfig.headers.Authorization).toBe('Bearer fake-jwt-token');
  });

  it('ne doit pas ajouter de header Authorization si le token est absent', async () => {
    const api = (await import('./api')).default;
    keycloak.token = null;
    const config = { headers: {} };
    const requestInterceptor = api.interceptors.request.handlers[0].fulfilled;
    const resultConfig = requestInterceptor(config);
    expect(resultConfig.headers.Authorization).toBeUndefined();
  });

  it('doit rejeter la promesse en cas d erreur d intercepteur', async () => {
    const api = (await import('./api')).default;
    const error = new Error('Axios Error');
    const errorInterceptor = api.interceptors.request.handlers[0].rejected;
    await expect(errorInterceptor(error)).rejects.toThrow('Axios Error');
  });
});