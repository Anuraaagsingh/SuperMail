'use client';

import React, { useState } from 'react';
import { Button } from '@supermail/components/ui/button';
import { createSupabaseClient } from '@supermail/lib/supabase';
import { FcGoogle } from 'react-icons/fc';
import { Loader2 } from 'lucide-react';

interface SupabaseGoogleLoginProps {
  redirectTo?: string;
  className?: string;
}

export function SupabaseGoogleLogin({ 
  redirectTo = '/mail/inbox',
  className = ''
}: SupabaseGoogleLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const supabase = createSupabaseClient();
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirectTo}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
          scopes: 'email profile https://www.googleapis.com/auth/gmail.modify'
        }
      });
      
      if (error) {
        console.error('Google login error:', error);
        throw error;
      }
      
      // The redirect happens automatically by Supabase
    } catch (error) {
      console.error('Failed to sign in with Google:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className={`w-full flex items-center justify-center gap-2 ${className}`}
      onClick={handleGoogleLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FcGoogle className="h-5 w-5" />
      )}
      <span>Continue with Google</span>
    </Button>
  );
}