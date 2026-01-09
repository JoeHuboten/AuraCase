import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { hashPassword } from '@/lib/auth-utils';
import { authRateLimit } from '@/lib/rate-limit';
import { emailSchema, passwordSchema } from '@/lib/validation';
import { sendEmailVerification } from '@/lib/email';
import { createLogger, getRequestId } from '@/lib/logger';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request.headers);
  const logger = createLogger('api:auth:signup').withRequestId(requestId);
  
  // Rate limiting - 5 attempts per 15 minutes
  const rateLimitResult = await authRateLimit(request);
  if (!rateLimitResult.success) {
    logger.warn('Rate limit exceeded');
    return NextResponse.json(
      { error: 'Too many signup attempts. Please try again later.', requestId },
      { status: 429, headers: { 'x-request-id': requestId } }
    );
  }

  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required', requestId },
        { status: 400, headers: { 'x-request-id': requestId } }
      );
    }

    // Validate email
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      return NextResponse.json(
        { error: 'Invalid email format', requestId },
        { status: 400, headers: { 'x-request-id': requestId } }
      );
    }

    // Validate password strength
    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with uppercase, lowercase, and number', requestId },
        { status: 400, headers: { 'x-request-id': requestId } }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists', requestId },
        { status: 400, headers: { 'x-request-id': requestId } }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Create user with emailVerified = null (unverified)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: 'USER',
        emailVerified: null, // User needs to verify email
      },
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store verification token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: expiresAt,
        type: 'EMAIL_VERIFICATION',
      },
    });

    // Generate verification URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verificationUrl = `${appUrl}/auth/verify-email?token=${verificationToken}`;

    // Send verification email
    logger.info('Sending verification email', { email });
    await sendEmailVerification(email, {
      name: name || 'there',
      verificationUrl,
    });

    logger.info('User registered successfully', { userId: user.id, email });

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      requiresVerification: true,
      requestId,
    }, { headers: { 'x-request-id': requestId } });
  } catch (error) {
    logger.error('Sign up error', { error });
    return NextResponse.json(
      { error: 'Registration failed. Please try again.', requestId },
      { status: 500, headers: { 'x-request-id': requestId } }
    );
  }
}
