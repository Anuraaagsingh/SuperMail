import { clerkMiddleware } from "@clerk/nextjs/server";

// Mark Gmail OAuth callback as a public route; protect everything else by default
export default clerkMiddleware({
  publicRoutes: ["/auth/gmail/callback"],
});

export const config = {
  matcher: [
    // Standard Clerk matcher: run on all routes except static assets and Next internals
    "/((?!.*\\..*|_next).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};