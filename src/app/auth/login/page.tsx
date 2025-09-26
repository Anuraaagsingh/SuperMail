'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@supermail/components/ui/button';
import { Input } from '@supermail/components/ui/input';
import { Label } from '@supermail/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@supermail/components/ui/card';
import { Separator } from '@supermail/components/ui/separator';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Apple,
  Chrome
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate demo login
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/mail/inbox');
    } catch (error) {
      console.error('Demo login failed:', error);
    } finally {
      setIsLoading(false);
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
              <Button 
                variant="secondary" 
                className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                <Apple className="h-4 w-4 mr-2" />
                Login with Apple
              </Button>
              
              <Button 
                variant="secondary" 
                className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                <Chrome className="h-4 w-4 mr-2" />
                Login with Google
              </Button>
            </div>

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
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Login'}
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
      </div>
    </div>
  );
}