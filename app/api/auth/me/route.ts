import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-utils';
import { apiRateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const token = request.cookies.get('auth-token')?.value;
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 Auth check - Cookie present:', !!token);
    }
    
    const user = await getUserFromRequest(request);

    if (!user) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('❌ Auth check - No user found');
      }
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Auth check - User found:', user.email);
    }
    return NextResponse.json({ user });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Auth check error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
