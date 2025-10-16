'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@supermail/lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (code: string, redirectUri: string) => Promise<void>;
  loginWithDemo: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const supabase = createSupabaseClient();
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const supabaseUser = session.user;
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.full_name || '',
          picture: supabaseUser.user_metadata?.avatar_url || '',
        });
      } else {
        // Check for demo user in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const demoUser = JSON.parse(storedUser);
            setUser(demoUser);
          } catch (error) {
            console.error('Error parsing stored user:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
          }
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      if (session?.user) {
        const supabaseUser = session.user;
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.full_name || '',
          picture: supabaseUser.user_metadata?.avatar_url || '',
        });
      } else if (!localStorage.getItem('user')) {
        setUser(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (code: string, redirectUri: string) => {
    // This method is no longer needed with Supabase
    throw new Error('Use Supabase authentication components instead');
  };

  const loginWithDemo = async () => {
    setIsLoading(true);
    
    try {
      // Import demo auth function
      const { loginWithDemo: demoLogin } = await import('@supermail/lib/demoAuth');
      const { token, user } = await demoLogin();
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      setIsLoading(false);
    } catch (error) {
      console.error('Demo login error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    const supabase = createSupabaseClient();
    
    if (session) {
      await supabase.auth.signOut();
    } else {
      // Fallback for demo users
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
    }
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      loginWithDemo,
      logout,
    }}>
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
