import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/auth/gmail/callback",
  "/auth/callback",
  "/api/gmail/oauth",
  "/api/debug/supabase",
]);

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/mail(.*)",
  "/settings(.*)",
  "/api/mail(.*)",
  "/api/gmail(.*)",
  "/api/user(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute(req) && !userId) {
    const signInUrl = new URL("/auth/login", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users from auth pages to inbox
  if (userId && (pathname === "/auth/login" || pathname === "/")) {
    return NextResponse.redirect(new URL("/mail/inbox", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Standard Clerk matcher: run on all routes except static assets and Next internals
    "/((?!.*\\..*|_next).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};