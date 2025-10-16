import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Define public routes that don't require authentication
const publicRoutes = [
  "/auth/gmail/callback",
  "/auth/callback",
  "/api/gmail/oauth",
  "/api/gmail/connect",
  "/api/auth/google",
  "/api/debug/supabase",
  "/auth/login",
  "/auth/login-new",
];

// Define protected routes that require authentication
const protectedRoutes = [
  "/mail",
  "/settings",
  "/api/mail",
  "/api/gmail",
  "/api/user",
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create a Supabase client using the new SSR package
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );
  
  const { pathname } = req.nextUrl;
  
  // Check if the route is public
  if (publicRoutes.some(route => pathname.startsWith(route) || pathname === route)) {
    return res;
  }

  // Check auth status
  const { data: { session } } = await supabase.auth.getSession();
  
  // Redirect unauthenticated users from protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !session) {
    const signInUrl = new URL("/auth/login-new", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Special handling for Gmail connection routes - allow even if user is authenticated
  if (pathname.startsWith("/api/gmail/connect") || pathname.startsWith("/auth/gmail")) {
    return res;
  }

  // Redirect authenticated users from auth pages to inbox
  if (session && (pathname === "/auth/login" || pathname === "/auth/login-new" || pathname === "/")) {
    return NextResponse.redirect(new URL("/mail/inbox", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}