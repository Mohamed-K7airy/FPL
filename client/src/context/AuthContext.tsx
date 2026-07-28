import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

export interface User {
  id: number;
  email: string;
  team_name: string;
  role: 'user' | 'admin';
  bank: number;
  free_transfers: number;
  squad_complete: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, teamName: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const data = await apiFetch<{ user: User }>('/auth/me');
      setUser(data.user);
    } catch {
      setUser(null);
      localStorage.removeItem('accessToken');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiFetch<{ user: User; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
  };

  const register = async (email: string, password: string, teamName: string) => {
    const data = await apiFetch<{ user: User; accessToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, teamName }),
    });
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
