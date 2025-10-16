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
    <div className="min-h-screen relative overflow-hidden">
      {/* Custom Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated circles */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border-white/20 dark:border-slate-700/30 shadow-2xl">
          <CardHeader className="space-y-6">
            {/* Logo */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">SuperMail</h1>
              <p className="text-white/70 text-sm">Modern Email Experience</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Welcome back</h2>
              
              {/* Demo Login */}
              <div className="p-4 rounded-lg bg-blue-500/20 border border-blue-400/30 mb-6">
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

              {/* Google Sign In */}
              <div className="p-4 rounded-lg bg-green-500/20 border border-green-400/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">Sign In</p>
                    <p className="text-green-200 text-xs">Access your account</p>
                  </div>
                </div>
                <SupabaseGoogleLogin 
                  redirectTo="/mail/inbox"
                  className="bg-green-500 hover:bg-green-600 text-white"
                />
                <p className="text-xs text-green-200/70 mt-2">
                  Sign in with your Google account to access Gmail.
                </p>
              </div>
            </div>

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
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
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
