'use client';

import { useState, useEffect } from 'react';
import { Button } from '@supermail/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@supermail/components/ui/card';
import { Badge } from '@supermail/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface EnvironmentStatus {
  gmailConfigured: boolean;
  supabaseConfigured: boolean;
  clerkConfigured: boolean;
}

export function EnvironmentChecker() {
  const [status, setStatus] = useState<EnvironmentStatus | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check environment variables (client-side only)
    const checkEnvironment = () => {
      const gmailConfigured = !!(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID);
      const supabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      const clerkConfigured = !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

      setStatus({
        gmailConfigured,
        supabaseConfigured,
        clerkConfigured,
      });
    };

    checkEnvironment();
  }, []);

  if (!status) return null;

  const allConfigured = status.gmailConfigured && status.supabaseConfigured && status.clerkConfigured;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-background/80 backdrop-blur-sm"
      >
        <AlertCircle className="h-4 w-4 mr-2" />
        Environment Status
      </Button>

      {isOpen && (
        <Card className="absolute bottom-12 right-0 w-80 bg-background/95 backdrop-blur-sm border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Environment Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Gmail API</span>
                <Badge variant={status.gmailConfigured ? "default" : "destructive"}>
                  {status.gmailConfigured ? (
                    <><CheckCircle className="h-3 w-3 mr-1" /> Configured</>
                  ) : (
                    <><XCircle className="h-3 w-3 mr-1" /> Not Configured</>
                  )}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Supabase</span>
                <Badge variant={status.supabaseConfigured ? "default" : "destructive"}>
                  {status.supabaseConfigured ? (
                    <><CheckCircle className="h-3 w-3 mr-1" /> Configured</>
                  ) : (
                    <><XCircle className="h-3 w-3 mr-1" /> Not Configured</>
                  )}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Clerk Auth</span>
                <Badge variant={status.clerkConfigured ? "default" : "destructive"}>
                  {status.clerkConfigured ? (
                    <><CheckCircle className="h-3 w-3 mr-1" /> Configured</>
                  ) : (
                    <><XCircle className="h-3 w-3 mr-1" /> Not Configured</>
                  )}
                </Badge>
              </div>
            </div>

            {!allConfigured && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">
                  Some services are not configured. The app will use demo mode for missing services.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => window.open('/GMAIL_SETUP_GUIDE.md', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Setup Guide
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-full text-xs"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
