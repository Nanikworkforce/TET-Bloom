import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Toggle enforcement via env var (same behaviour as client-side).
const ENFORCE_AUTH = process.env.NEXT_PUBLIC_ENFORCE_AUTH === 'true';

// List of public routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup', '/forgot-password'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // TEMPORARILY DISABLED FOR TESTING
  console.log('Middleware: Temporarily disabled for testing');
  return res;
  
  // --------------------------------------------------
  // Skip all authentication checks completely when auth
  // is disabled (local development / QA mode).
  // --------------------------------------------------
  if (!ENFORCE_AUTH) {
    console.log('Middleware: Auth not enforced, allowing through');
    return res;
  }
  
  // Get the current pathname
  const { pathname } = req.nextUrl;
  
  console.log('Middleware processing path:', pathname);
  
  const supabase = createMiddlewareClient({ req, res });

  // Check if the user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log('Middleware session check:', !!session, 'Session user:', session?.user?.email);

  // If the user is not authenticated and the route is not public, redirect to login
  if (!session && !publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    console.log('Middleware redirecting to login - no session and not public route');
    const redirectUrl = new URL('/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  console.log('Middleware allowing request through');
  return res;
}

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    // Apply to all routes except static files, api routes, etc.
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}; 