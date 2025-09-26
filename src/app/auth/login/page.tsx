'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@supermail/components/ui/button';
import { Input } from '@supermail/components/ui/input';
import { Label } from '@supermail/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@supermail/components/ui/card';
import { Separator } from '@supermail/components/ui/separator';
import { SignInButton } from '@clerk/nextjs';
import { useAuth } from '@supermail/hooks/useAuth';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Chrome,
  User,
  LogOut
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithDemo, user, logout } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    setError('');
    try {
      await loginWithDemo();
      router.push('/mail/inbox');
    } catch (error) {
      console.error('Demo login failed:', error);
      setError('Demo login failed. Please try again.');
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {/* Login Card */}
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">MasterMail</CardTitle>
            <CardDescription className="text-white/80">
              Welcome back! Login to access your emails.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              {/* Demo Login Button */}
              <Button 
                onClick={handleDemoLogin}
                disabled={isDemoLoading}
                className="w-full bg-black hover:bg-gray-800 text-white border-0"
              >
                {isDemoLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                Demo Login
              </Button>

              {/* Apple Login Button */}
              <Button 
                variant="secondary" 
                className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white"
                onClick={() => {
                  // Apple login functionality - you can implement this later
                  console.log('Apple login clicked');
                }}
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Login with Apple
              </Button>
              
              {/* Google Login Button with Clerk */}
              <SignInButton
                mode="modal"
                fallbackRedirectUrl="/mail/inbox"
              >
                <Button 
                  variant="secondary" 
                  className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white"
                >
                  <Chrome className="h-4 w-4 mr-2" />
                  Login with Google
                </Button>
              </SignInButton>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/20 border border-red-400/30 text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Separator */}
            <div className="relative">
              <Separator className="bg-white/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-transparent px-2 text-sm text-white/60">Or continue with</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <button className="text-sm text-white/80 hover:text-white transition-colors">
                    Forgot your password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                className="w-full bg-white text-gray-900 hover:bg-white/90 font-medium"
                onClick={handleDemoLogin}
                disabled={isDemoLoading}
              >
                {isDemoLoading ? 'Signing in...' : 'Login'}
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-white/80">
                Don't have an account?{' '}
                <button className="text-white hover:underline font-medium">
                  Sign up
                </button>
              </p>
            </div>

            {/* Legal Text */}
            <div className="text-center">
              <p className="text-xs text-white/60">
                By clicking continue, you agree to our{' '}
                <button className="text-white/80 hover:text-white underline">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button className="text-white/80 hover:text-white underline">
                  Privacy Policy
                </button>
                .
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Box for Previously Logged In Users */}
        {user && (
          <Card className="w-full max-w-md mx-auto mt-6 bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{user.name || 'User'}</h3>
                  <p className="text-sm text-white/80">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/mail/inbox')}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <User className="h-4 w-4 mr-2" />
                  Continue as {user.name?.split(' ')[0] || 'User'}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={logout}
                  className="w-full border-white/30 text-white hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}