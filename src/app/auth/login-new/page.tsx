'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@supermail/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@supermail/components/ui/card';
import { Input } from '@supermail/components/ui/input';
import { Label } from '@supermail/components/ui/label';
import { SupabaseGoogleLogin } from '@supermail/components/SupabaseGoogleLogin';
import { useAuth } from '@supermail/hooks/useAuth';
import { getErrorMessage } from '@supermail/lib/utils';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function NewLoginPage() {
  const router = useRouter();
  const { loginWithDemo } = useAuth();
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    setError('');

    try {
      await loginWithDemo();
      router.push('/mail/inbox');
    } catch (error) {
      console.error('Demo login error:', error);
      setError(getErrorMessage(error));
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Content */}
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">SuperMail</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Modern Email Experience</p>
        </div>

        <Card className="shadow-md border-0">
          <CardHeader className="pb-0">
            <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Access your account to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            {/* Demo Login */}
            <div className="space-y-2">
              <Button
                onClick={handleDemoLogin}
                disabled={isDemoLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                variant="default"
              >
                {isDemoLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    Sign in with Demo
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Try SuperMail with demo data
              </p>
            </div>

              {/* Google Sign In */}
              <div className="space-y-2">
                <SupabaseGoogleLogin 
                  redirectTo="/mail/inbox"
                  className="w-full bg-white hover:bg-gray-100 text-gray-800 border border-gray-300"
                />
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Sign in with your Google account to access Gmail
                </p>
              </div>
              
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or
                  </span>
                </div>
              </div>
              
              {/* Email/Password Fields (placeholder for future implementation) */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full"
                    disabled
                  />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </Label>
                    <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full"
                    disabled
                  />
                </div>
                
                <Button className="w-full" disabled>
                  Sign in
                </Button>
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  {error}
                </div>
              )}
              
              {/* Sign Up Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                    Sign up
                  </a>
                </p>
              </div>
              
              {/* Terms */}
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                    Terms of Service
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>


    </div>
  );
}
