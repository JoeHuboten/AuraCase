import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { hashPassword, createToken } from '@/lib/auth-utils';
import { authRateLimit } from '@/lib/rate-limit';
import { emailSchema, passwordSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  // Rate limiting - 5 attempts per 15 minutes
  const rateLimitResult = await authRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many signup attempts. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with uppercase, lowercase, and number' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: 'USER',
      },
    });

    const token = await createToken(user.id, user.email!, user.role);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
