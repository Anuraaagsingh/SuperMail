'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';

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
  const { isLoaded, isSignedIn, signOut } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && clerkUser) {
        setUser({
          id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: clerkUser.fullName || '',
          picture: clerkUser.imageUrl,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn, clerkUser]);

  const login = async (code: string, redirectUri: string) => {
    // This method is no longer needed with Clerk
    throw new Error('Use Clerk authentication components instead');
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
    if (isSignedIn) {
      await signOut();
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
