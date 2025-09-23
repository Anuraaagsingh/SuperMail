'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@supermail/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@supermail/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@supermail/components/ui/tabs';
import { Input } from '@supermail/components/ui/input';
import { useAuth } from '@supermail/hooks/useAuth';
import { getErrorMessage } from '@supermail/lib/utils';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  X,
  Smartphone,
  Globe
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithDemo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('signup');

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

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError('');
    
    try {
      window.location.href = '/api/auth/google';
    } catch (error) {
      console.error('Google login error:', error);
      setError(getErrorMessage(error));
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Glass Morphism Card */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border-white/20 dark:border-slate-700/30 shadow-2xl">
          <CardHeader className="space-y-6 pb-8">
            {/* Close Button */}
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Logo */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">SuperMail</h1>
              <p className="text-white/70 text-sm">Modern Email Experience</p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border border-white/20">
                <TabsTrigger 
                  value="signup" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
                >
                  Sign up
                </TabsTrigger>
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
                >
                  Sign in
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signup" className="space-y-6 mt-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">Create an account</h2>
                  
                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Input
                          placeholder="John"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                        />
                        <label className="absolute -top-2 left-3 bg-slate-900/80 px-1 text-xs text-white/70">
                          First name
                        </label>
                      </div>
                      <div className="relative">
                        <Input
                          placeholder="Last name"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                        />
                        <label className="absolute -top-2 left-3 bg-slate-900/80 px-1 text-xs text-white/70">
                          Last name
                        </label>
                      </div>
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                      <Input
                        placeholder="Enter your email"
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                      />
                    </div>

                    <div className="relative">
                      <div className="flex items-center">
                        <div className="flex items-center bg-white/10 border border-white/20 rounded-l-md px-3 py-2">
                          <Globe className="w-4 h-4 text-white/50 mr-2" />
                          <span className="text-white/70 text-sm">🇺🇸</span>
                        </div>
                        <Input
                          placeholder="(775) 351-6501"
                          className="rounded-l-none bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Create Account Button */}
                  <Button 
                    className="w-full bg-white text-slate-900 hover:bg-white/90 font-medium py-3 mt-6"
                    onClick={handleDemoLogin}
                    disabled={isDemoLoading}
                  >
                    {isDemoLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900"></div>
                    ) : (
                      <>
                        Create an account
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  {/* Social Login */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-slate-900/80 text-white/70">OR SIGN IN WITH</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2.156-.172-4.25 1.246-5.36 1.246-1.1 0-2.8-1.221-4.61-1.18-2.37.04-4.55 1.38-5.76 3.5-2.45 4.25-.63 10.55 1.75 14.01 1.18 1.69 2.58 3.59 4.42 3.52 1.78-.07 2.45-1.15 4.6-1.15 2.13 0 2.78 1.15 4.6 1.11 1.88-.04 3.09-1.7 4.25-3.39 1.33-1.95 1.88-3.85 1.91-3.95-.04-.02-3.65-1.4-3.65-5.45z"/>
                      </svg>
                      Apple
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="signin" className="space-y-6 mt-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">Welcome back</h2>
                  
                  {/* Demo Login */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-blue-500/20 border border-blue-400/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">Demo Account</p>
                          <p className="text-blue-200 text-xs">Try SuperMail with demo data</p>
                        </div>
                      </div>
                      <Button
                        onClick={handleDemoLogin}
                        disabled={isDemoLoading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        {isDemoLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          'Sign in with Demo'
                        )}
                      </Button>
                    </div>

                    {/* Google Login */}
                    <div className="p-4 rounded-lg bg-green-500/20 border border-green-400/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <Globe className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">Google Account</p>
                          <p className="text-green-200 text-xs">Connect your Gmail</p>
                        </div>
                      </div>
                      <Button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          'Sign in with Google'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/20 border border-red-400/30 text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Terms */}
            <div className="text-center">
              <p className="text-xs text-white/60">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-white/80 hover:text-white underline">
                  Terms & Service
                </a>
              </p>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}