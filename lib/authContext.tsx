'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('escolarapp_user');
    const savedOnboarding = localStorage.getItem('escolarapp_onboarding');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedOnboarding) {
      setHasSeenOnboarding(true);
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    const mockUser: User = {
      id: 'user-123',
      name: email.split('@')[0],
      email,
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
    };
    setUser(mockUser);
    localStorage.setItem('escolarapp_user', JSON.stringify(mockUser));
  };

  const signup = async (name: string, email: string, password: string) => {
    // Mock signup
    const mockUser: User = {
      id: 'user-' + Date.now(),
      name,
      email,
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
    };
    setUser(mockUser);
    localStorage.setItem('escolarapp_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('escolarapp_user');
  };

  const completeOnboarding = () => {
    setHasSeenOnboarding(true);
    localStorage.setItem('escolarapp_onboarding', 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        hasSeenOnboarding,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
