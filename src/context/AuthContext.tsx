import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, TechnicalDomain, ExperienceLevel } from '../types';
import { api, setApiAuthToken, getStoredAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    targetDomain?: TechnicalDomain,
    targetLevel?: ExperienceLevel
  ) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  loginAsAdmin: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredAuthToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const { user } = await api.getMe();
        setUser(user);
      } catch (err) {
        console.warn('Session expired or invalid, clearing token', err);
        setApiAuthToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    setApiAuthToken(data.token);
    setUser(data.user);
    setIsAuthModalOpen(false);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    targetDomain?: TechnicalDomain,
    targetLevel?: ExperienceLevel
  ) => {
    const data = await api.register(name, email, password, targetDomain, targetLevel);
    setApiAuthToken(data.token);
    setUser(data.user);
    setIsAuthModalOpen(false);
  };

  const loginAsDemo = async () => {
    await login('alex@techinterviews.io', 'password123');
  };

  const loginAsAdmin = async () => {
    await login('admin@techinterviews.io', 'password123');
  };

  const refreshUser = async () => {
    try {
      const { user: refreshed } = await api.getMe();
      setUser(refreshed);
    } catch {
      // ignore
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore
    } finally {
      setApiAuthToken(null);
      setUser(null);
    }
  };

  const updateName = async (name: string) => {
    const { user: updated } = await api.updateProfile(name);
    setUser(updated);
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        loginAsDemo,
        loginAsAdmin,
        logout,
        refreshUser,
        updateName,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        authModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
