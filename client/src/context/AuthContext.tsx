import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { supabase } from '../supabaseClient';

export interface User {
  id: number;
  email: string;
  team_name: string;
  role: 'user' | 'admin';
  bank: number;
  free_transfers: number;
  squad_complete: boolean;
  rank?: number;
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

    // Listen for Supabase OAuth Callback Session (Google, Facebook, Apple)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.email) {
        const sbEmail = session.user.email;
        // Generate a cryptographically random password for social users
        const socialPassword = crypto.randomUUID() + '_social_' + Date.now();
        try {
          const data = await apiFetch<{ user: User; accessToken: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: sbEmail, password: socialPassword, isSocialAuth: true }),
          });
          localStorage.setItem('accessToken', data.accessToken);
          setUser(data.user);

          const target = sessionStorage.getItem('auth_return_url');
          if (target && !target.includes('/login') && !target.includes('/register')) {
            sessionStorage.removeItem('auth_return_url');
            if (window.location.pathname === '/login' || window.location.pathname === '/register') {
              window.location.href = target;
            }
          }
        } catch {
          try {
            const teamName = session.user.user_metadata?.full_name || sbEmail.split('@')[0] + ' FC';
            const regData = await apiFetch<{ user: User; accessToken: string }>('/auth/register', {
              method: 'POST',
              body: JSON.stringify({ email: sbEmail, password: socialPassword, teamName, isSocialAuth: true }),
            });
            localStorage.setItem('accessToken', regData.accessToken);
            setUser(regData.user);

            const target = sessionStorage.getItem('auth_return_url');
            if (target && !target.includes('/login') && !target.includes('/register')) {
              sessionStorage.removeItem('auth_return_url');
              if (window.location.pathname === '/login' || window.location.pathname === '/register') {
                window.location.href = target;
              }
            }
          } catch (err) {
            console.error('Supabase OAuth sync error:', err);
          }
        }
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
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
