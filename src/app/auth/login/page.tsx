'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@supermail/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@supermail/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@supermail/components/ui/tabs';
import { GMAIL_SCOPES } from '@supermail/lib/auth';
import { loginWithDemo } from '@supermail/lib/demoAuth';
import { Separator } from '@supermail/components/ui/separator';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('demo');
  
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
  
  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    
    try {
      // Login with demo account
      const { token, user } = await loginWithDemo();
      
      // Store token and user in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect to inbox
      router.push('/mail/inbox');
    } catch (error) {
      console.error('Demo login error:', error);
      setIsDemoLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 p-4">
      <div className="absolute inset-0 bg-grid-white/[0.2] bg-[length:20px_20px] opacity-20"></div>
      <Card className="w-full max-w-md shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-white/20 dark:border-gray-800/30 rounded-xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400"></div>
        <CardHeader className="space-y-2 pb-6">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">SuperMail</CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-300">
            Your modern email experience
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 pb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="demo" className="text-sm">Demo Account</TabsTrigger>
              <TabsTrigger value="google" className="text-sm">Google Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="demo" className="mt-0">
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md text-sm text-blue-700 dark:text-blue-300 mb-4">
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium mb-1">Demo Mode</p>
                      <p className="text-xs">Try SuperMail with pre-populated demo data. No real emails will be sent or received.</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleDemoLogin} 
                  disabled={isDemoLoading} 
                  className="w-full py-6 text-base font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md"
                >
                  {isDemoLoading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Sign in with Demo Account</span>
                    </div>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="google" className="mt-0">
              <div className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-md text-sm text-amber-700 dark:text-amber-300 mb-4">
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="font-medium mb-1">Setup Required</p>
                      <p className="text-xs">Google OAuth requires configuration. See the setup instructions below.</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleGoogleLogin} 
                  disabled={isLoading} 
                  className="w-full py-6 text-base font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                      </svg>
                      <span>Sign in with Google</span>
                    </div>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground pb-6">
          <Separator className="my-2" />
          <div className="w-full">
            <details className="text-xs">
              <summary className="cursor-pointer text-blue-500 hover:text-blue-700 font-medium">
                Gmail OAuth Setup Instructions
              </summary>
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-gray-700 dark:text-gray-300 space-y-2">
                <p className="font-medium">To set up Google OAuth:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Create a project in Google Cloud Console</li>
                  <li>Enable the Gmail API</li>
                  <li>Configure OAuth consent screen</li>
                  <li>Create OAuth credentials (Web application)</li>
                  <li>Add authorized redirect URI: <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">{`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}</code></li>
                  <li>Create a <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">.env.local</code> file with your credentials</li>
                </ol>
                <p className="text-xs mt-2">See the <a href="https://github.com/Anuraaagsingh/SuperMail" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">GitHub repository</a> for detailed instructions.</p>
              </div>
            </details>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
