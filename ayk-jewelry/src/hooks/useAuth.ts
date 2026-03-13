'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/queryClient';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('ayk_token');
    if (!token) { setIsLoading(false); return; }
    api.get('/auth/verify')
      .then(() => setIsAuthenticated(true))
      .catch(() => { localStorage.removeItem('ayk_token'); localStorage.removeItem('ayk_user'); })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true); setError(null);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('ayk_token', data.data.token);
      localStorage.setItem('ayk_user', data.data.username);
      setIsAuthenticated(true);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ayk_token');
    localStorage.removeItem('ayk_user');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, error, login, logout };
}
