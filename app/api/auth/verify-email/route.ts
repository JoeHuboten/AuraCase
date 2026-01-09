import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { sendEmailVerificationSuccess } from '@/lib/email';
import { createLogger, getRequestId } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request.headers);
  const logger = createLogger('api:auth:verify-email').withRequestId(requestId);
  
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required', requestId },
        { status: 400, headers: { 'x-request-id': requestId } }
      );
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      logger.warn('Invalid verification token', { token: token.substring(0, 8) + '...' });
      return NextResponse.json(
        { error: 'Invalid or expired verification link', requestId },
        { status: 400, headers: { 'x-request-id': requestId } }
      );
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      logger.warn('Expired verification token', { identifier: verificationToken.identifier });
      
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      });

      return NextResponse.json(
        { error: 'Verification link has expired. Please request a new one.', requestId },
        { status: 400, headers: { 'x-request-id': requestId } }
      );
    }

    // Check if token is for email verification
    if (verificationToken.type !== 'EMAIL_VERIFICATION') {
      return NextResponse.json(
        { error: 'Invalid verification token type', requestId },
        { status: 400, headers: { 'x-request-id': requestId } }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      logger.warn('User not found for verification token', { identifier: verificationToken.identifier });
      return NextResponse.json(
        { error: 'User not found', requestId },
        { status: 404, headers: { 'x-request-id': requestId } }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      logger.info('Email already verified', { userId: user.id });
      
      // Delete token
      await prisma.verificationToken.delete({
        where: { token },
      });

      return NextResponse.json(
        { 
          success: true, 
          message: 'Email already verified. You can now sign in.',
          alreadyVerified: true,
          requestId 
        },
        { headers: { 'x-request-id': requestId } }
      );
    }

    // Update user emailVerified
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    // Delete verification token
    await prisma.verificationToken.delete({
      where: { token },
    });

    // Send success email
    await sendEmailVerificationSuccess(user.email!, {
      name: user.name || 'there',
    });

    logger.info('Email verified successfully', { userId: user.id, email: user.email });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now sign in and make purchases.',
      requestId,
    }, { headers: { 'x-request-id': requestId } });
  } catch (error) {
    logger.error('Email verification error', { error });
    return NextResponse.json(
      { error: 'Verification failed. Please try again.', requestId },
      { status: 500, headers: { 'x-request-id': requestId } }
    );
  }
}
