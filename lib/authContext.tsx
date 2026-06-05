'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/services/db';
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

  // Initialize from Supabase Auth
  useEffect(() => {
    const savedOnboarding = localStorage.getItem('escolarapp_onboarding');

    if (savedOnboarding) {
      setHasSeenOnboarding(true);
    }

    // Listen to auth state changes in Supabase
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // User is authenticated
        const userData = await getCurrentUserData(session.user.id);
        const mappedUser: User = {
          id: session.user.id,
          name: userData?.name || session.user.email?.split('@')[0] || 'Usuario',
          email: session.user.email || '',
          avatarUrl:
            userData?.avatar_url ||
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
        };
        setUser(mappedUser);
        localStorage.setItem('escolarapp_user', JSON.stringify(mappedUser));
      } else {
        // User is not authenticated
        const savedUser = localStorage.getItem('escolarapp_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  async function login(email: string, password: string) {
    try {
      setIsLoading(true);
      await loginWithEmail(email, password);
    } catch (error) {
      console.error('[v0] Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function signup(name: string, email: string, password: string) {
    try {
      setIsLoading(true);
      await signupWithEmail(name, email, password);
    } catch (error) {
      console.error('[v0] Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      setIsLoading(true);
      await logoutUser();
      setUser(null);
      localStorage.removeItem('escolarapp_user');
    } catch (error) {
      console.error('[v0] Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function completeOnboarding() {
    localStorage.setItem('escolarapp_onboarding', 'true');
    setHasSeenOnboarding(true);
  }

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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
