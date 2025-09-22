'use client';

import { useState, useEffect } from 'react';
import { Button } from '@supermail/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@supermail/components/ui/card';
import { GMAIL_SCOPES } from '@supermail/lib/auth';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      // Construct Google OAuth URL
      const scopes = encodeURIComponent(GMAIL_SCOPES.join(' '));
      const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      
      if (!clientId) {
        throw new Error('Google Client ID not configured');
      }
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}&access_type=offline&prompt=consent`;
      
      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">SuperMail</CardTitle>
          <CardDescription className="text-center">
            Sign in with your Google account to access your emails
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button 
            onClick={handleGoogleLogin} 
            disabled={isLoading} 
            className="w-full"
          >
            {isLoading ? 'Connecting...' : 'Sign in with Google'}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p className="text-center">
            SuperMail needs access to your Gmail account to provide email functionality.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
