/**
 * URL configuration utility for different environments
 */

export type Environment = 'development' | 'preview' | 'production';

export interface URLConfig {
  baseUrl: string;
  apiUrl: string;
  authUrl: string;
  gmailCallbackUrl: string;
  environment: Environment;
}

/**
 * Get the current environment based on the URL
 */
export function getCurrentEnvironment(): Environment {
  if (typeof window === 'undefined') {
    // Server-side: check environment variables
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    if (appUrl.includes('localhost')) return 'development';
    if (appUrl.includes('preview')) return 'preview';
    return 'production';
  }

  // Client-side: check current URL
  const hostname = window.location.hostname;
  if (hostname === 'localhost') return 'development';
  if (hostname.includes('preview')) return 'preview';
  return 'production';
}

/**
 * Get URL configuration for the current environment
 */
export function getURLConfig(): URLConfig {
  const environment = getCurrentEnvironment();
  
  switch (environment) {
    case 'development':
      return {
        baseUrl: 'http://localhost:3000',
        apiUrl: 'http://localhost:3000/api',
        authUrl: 'http://localhost:3000/auth',
        gmailCallbackUrl: 'http://localhost:3000/auth/gmail/callback',
        environment: 'development',
      };
    
    case 'preview':
      return {
        baseUrl: 'https://preview.mastermail.live',
        apiUrl: 'https://preview.mastermail.live/api',
        authUrl: 'https://preview.mastermail.live/auth',
        gmailCallbackUrl: 'https://preview.mastermail.live/auth/gmail/callback',
        environment: 'preview',
      };
    
    case 'production':
    default:
      return {
        baseUrl: 'https://mastermail.live',
        apiUrl: 'https://mastermail.live/api',
        authUrl: 'https://mastermail.live/auth',
        gmailCallbackUrl: 'https://mastermail.live/auth/gmail/callback',
        environment: 'production',
      };
  }
}

/**
 * Get the base URL for the current environment
 */
export function getBaseURL(): string {
  return getURLConfig().baseUrl;
}

/**
 * Get the API URL for the current environment
 */
export function getAPIURL(): string {
  return getURLConfig().apiUrl;
}

/**
 * Get the Gmail OAuth callback URL for the current environment
 */
export function getGmailCallbackURL(): string {
  return getURLConfig().gmailCallbackUrl;
}

/**
 * Check if we're in production environment
 */
export function isProduction(): boolean {
  return getCurrentEnvironment() === 'production';
}

/**
 * Check if we're in development environment
 */
export function isDevelopment(): boolean {
  return getCurrentEnvironment() === 'development';
}

/**
 * Check if we're in preview environment
 */
export function isPreview(): boolean {
  return getCurrentEnvironment() === 'preview';
}

/**
 * Get environment-specific Google OAuth redirect URIs
 */
export function getGoogleOAuthRedirectURIs(): string[] {
  const config = getURLConfig();
  return [
    `${config.baseUrl}/auth/gmail/callback`,
    `${config.baseUrl}/api/gmail/oauth`,
  ];
}

/**
 * Get environment-specific Google OAuth JavaScript origins
 */
export function getGoogleOAuthJavaScriptOrigins(): string[] {
  const config = getURLConfig();
  return [config.baseUrl];
}
