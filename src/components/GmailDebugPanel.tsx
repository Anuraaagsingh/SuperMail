'use client';

import { useState } from 'react';
import { Button } from '@supermail/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@supermail/components/ui/card';
import { Badge } from '@supermail/components/ui/badge';
import { RefreshCw, Bug, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface GmailDebugPanelProps {
  gmailConnected: boolean;
  gmailMessage: string;
  gmailError: string | null;
  isLoadingEmails: boolean;
  emailCount: number;
  onRefresh: () => void;
}

export function GmailDebugPanel({
  gmailConnected,
  gmailMessage,
  gmailError,
  isLoadingEmails,
  emailCount,
  onRefresh
}: GmailDebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusIcon = () => {
    if (isLoadingEmails) return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (gmailError) return <XCircle className="h-4 w-4 text-red-500" />;
    if (gmailConnected) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (isLoadingEmails) return 'Loading...';
    if (gmailError) return 'Error';
    if (gmailConnected) return 'Connected';
    return 'Not Connected';
  };

  const getStatusColor = () => {
    if (isLoadingEmails) return 'bg-blue-100 text-blue-800';
    if (gmailError) return 'bg-red-100 text-red-800';
    if (gmailConnected) return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bug className="h-4 w-4" />
            Gmail Debug Panel
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor()}>
              {getStatusIcon()}
              <span className="ml-1">{getStatusText()}</span>
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Hide' : 'Show'} Details
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Status:</strong> {gmailConnected ? 'Connected' : 'Not Connected'}
              </div>
              <div>
                <strong>Emails:</strong> {emailCount}
              </div>
              <div>
                <strong>Loading:</strong> {isLoadingEmails ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Error:</strong> {gmailError ? 'Yes' : 'No'}
              </div>
            </div>
            
            {gmailMessage && (
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                <strong>Message:</strong> {gmailMessage}
              </div>
            )}
            
            {gmailError && (
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm">
                <strong>Error:</strong> {gmailError}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoadingEmails}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingEmails ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('Gmail Debug Info:', {
                    gmailConnected,
                    gmailMessage,
                    gmailError,
                    isLoadingEmails,
                    emailCount,
                    timestamp: new Date().toISOString()
                  });
                }}
              >
                Log to Console
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
