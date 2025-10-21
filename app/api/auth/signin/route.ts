import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { verifyPassword, createToken } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    console.log('=== SIGNIN REQUEST ===');
    const body = await request.json();
    console.log('Request body:', { email: body.email, hasPassword: !!body.password, rememberMe: body.rememberMe });
    
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Looking up user:', email);
    const user = await prisma.user.findUnique({
      where: { email },
    }) as any;

    console.log('User found:', user ? 'yes' : 'no');
    if (!user || !user.password) {
      console.log('User not found or no password');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Verifying password...');
    const isValid = await verifyPassword(password, user.password);
    console.log('Password valid:', isValid);

    if (!isValid) {
      console.log('Invalid password');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Creating token...');
    const token = await createToken(user.id, user.email!, user.role);
    console.log('Token created');

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // If rememberMe is true, set cookie for 7 days, otherwise 24 hours
    const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24;
    console.log('Setting cookie with maxAge:', maxAge / (60 * 60 * 24), 'days');

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
    });

    console.log('=== SIGNIN SUCCESS ===');
    return response;
  } catch (error) {
    console.error('=== SIGNIN ERROR ===');
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
