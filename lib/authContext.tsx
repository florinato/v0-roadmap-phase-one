
'use client';

import { supabase } from '@/lib/supabase';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  user_metadata: any;
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Initialize from Supabase Auth - Only once on mount
  useEffect(() => {
    const savedOnboarding = localStorage.getItem('escolarapp_onboarding');

    if (savedOnboarding) {
      setHasSeenOnboarding(true);
    }

    // Listen to auth state changes in Supabase
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (isAuthenticating) return; // Prevent infinite loop

      if (session?.user) {
        // User is authenticated
        setIsAuthenticating(true);
        const { data: userData, error: userError } = await supabase
          .from('profiles') // Cambiado de 'users' a 'profiles'
          .select('name, avatar_url')
          .eq('id', session.user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') { // PGRST116 means no rows found
          console.error('[v0] Error fetching user data:', userError);
        }

        const mappedUser: User = {
          id: session.user.id,
          name: userData?.name || session.user.email?.split('@')[0] || 'Usuario',
          email: session.user.email || '',
          avatarUrl: userData?.avatar_url ||
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
          user_metadata: undefined
        };
        setUser(mappedUser);
        localStorage.setItem('escolarapp_user', JSON.stringify(mappedUser));
        setIsAuthenticating(false);
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('[v0] Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      localStorage.removeItem('escolarapp_user');
    } catch (error) {
      console.error('[v0] Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function signup(email: string, password: string, name: string) {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({ email, password });
      console.log("[v0] Supabase signup response data:", data);
      if (error) throw error;
      // La inserción manual en la tabla 'users' ha sido eliminada. El perfil se crea automáticamente mediante un Trigger de base de datos.
    } catch (error) {
      console.error("[v0] Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  function completeOnboarding() {
    localStorage.setItem("escolarapp_onboarding", "true");
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
