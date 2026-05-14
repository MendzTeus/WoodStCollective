import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

type User = {
  id: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (supabase) {
      // Check active sessions and sets the user
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ? { id: session.user.id, email: session.user.email || '' } : null);
        setIsLoading(false);
      });

      // Listen for changes on auth state
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ? { id: session.user.id, email: session.user.email || '' } : null);
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Dummy check for development if Supabase isn't configured
      const savedUser = localStorage.getItem('dummy_admin_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          // Ignore
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string) => {
    if (supabase && password) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error: error.message };
      return { error: null };
    } else {
      // Dummy login for development without Supabase keys
      if (email === 'admin@woodstreet.com') {
        const dummyUser = { id: 'dummy-1', email };
        localStorage.setItem('dummy_admin_user', JSON.stringify(dummyUser));
        setUser(dummyUser);
        return { error: null };
      }
      return { error: 'Invalid credentials. (Hint: use admin@woodstreet.com in preview mode)' };
    }
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('dummy_admin_user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
