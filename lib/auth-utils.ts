import { NextRequest } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './database';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createToken(userId: string, email: string, role: string): Promise<string> {
  return new SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload;
  } catch (error) {
    return null;
  }
}

export async function getUserFromRequest(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload || !payload.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: { id: true, email: true, name: true, role: true },
    });

    return user;
  } catch (error) {
    return null;
  }
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const user = await getUserFromRequest(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return handler(request, { ...context, user });
  };
}

export function requireAdmin(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    return handler(request, { ...context, user });
  };
}

/**
 * Wrapper to add CSRF protection to mutation endpoints
 */
export function withCsrf(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    // Skip CSRF for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return handler(request, context);
    }

    const headerToken = request.headers.get('x-csrf-token');
    const cookieToken = request.cookies.get('csrf-token')?.value;

    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
      return Response.json({ error: 'Invalid request' }, { status: 403 });
    }

    return handler(request, context);
  };
}

/**
 * Sanitize error messages to prevent information leakage
 */
export function safeError(error: unknown, fallbackMessage = 'An error occurred'): string {
  // In development, return the actual error
  if (process.env.NODE_ENV === 'development' && error instanceof Error) {
    return error.message;
  }
  // In production, return generic message
  return fallbackMessage;
}
