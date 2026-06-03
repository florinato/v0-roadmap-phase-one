'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/services/firebase';
import {
  signupWithEmail,
  loginWithEmail,
  logoutUser,
  getCurrentUserData,
} from '@/lib/services/db';

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

  // Initialize from Firebase Auth y localStorage
  useEffect(() => {
    const savedOnboarding = localStorage.getItem('escolarapp_onboarding');

    if (savedOnboarding) {
      setHasSeenOnboarding(true);
    }

    // Si auth no está disponible, cargar solo desde localStorage
    if (!auth) {
      console.log('[v0] Firebase auth not available, using localStorage');
      const savedUser = localStorage.getItem('escolarapp_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
      return;
    }

    // Escuchar cambios de autenticación en Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Usuario autenticado en Firebase
        const userData = await getCurrentUserData(firebaseUser.uid);
        const mappedUser: User = {
          id: firebaseUser.uid,
          name: userData?.name || firebaseUser.displayName || 'Usuario',
          email: firebaseUser.email || '',
          avatarUrl:
            userData?.avatarUrl ||
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
        };
        setUser(mappedUser);
        localStorage.setItem('escolarapp_user', JSON.stringify(mappedUser));
      } else {
        // Usuario no autenticado
        const savedUser = localStorage.getItem('escolarapp_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const firebaseUser = await loginWithEmail(email, password);
      const userData = await getCurrentUserData(firebaseUser.uid);
      const mappedUser: User = {
        id: firebaseUser.uid,
        name: userData?.name || firebaseUser.displayName || email.split('@')[0],
        email: firebaseUser.email || '',
        avatarUrl:
          userData?.avatarUrl ||
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
      };
      setUser(mappedUser);
      localStorage.setItem('escolarapp_user', JSON.stringify(mappedUser));
    } catch (error) {
      console.error('[v0] Login failed:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const firebaseUser = await signupWithEmail(name, email, password);
      const mappedUser: User = {
        id: firebaseUser.uid,
        name,
        email,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      };
      setUser(mappedUser);
      localStorage.setItem('escolarapp_user', JSON.stringify(mappedUser));
    } catch (error) {
      console.error('[v0] Signup failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      localStorage.removeItem('escolarapp_user');
    } catch (error) {
      console.error('[v0] Logout failed:', error);
    }
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
