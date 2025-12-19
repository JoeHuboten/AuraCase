import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that require authentication
const protectedRoutes = ['/account', '/orders', '/checkout', '/wishlist'];

// Routes that require admin access
const adminRoutes = ['/admin'];

// Routes that should redirect to home if already authenticated
const authRoutes = ['/auth/signin', '/auth/signup'];

async function verifyToken(token: string): Promise<{ userId: string; role: string } | null> {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET not configured');
      return null;
    }
    
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    
    return {
      userId: payload.userId as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

// Default export function for Next.js 16 proxy
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  // Check if user is authenticated
  let user: { userId: string; role: string } | null = null;
  if (token) {
    user = await verifyToken(token);
  }
  
  // Admin route protection - server-side redirect if not admin
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!user) {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    
    if (user.role !== 'ADMIN') {
      // Redirect non-admin users to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // Protected routes - require authentication
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!user) {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  // Auth routes - redirect to home if already authenticated
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (user) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
