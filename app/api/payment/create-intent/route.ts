import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUserFromRequest } from '@/lib/auth-utils';

// Check if Stripe is configured
const STRIPE_CONFIGURED = process.env.STRIPE_SECRET_KEY && 
  process.env.STRIPE_SECRET_KEY !== 'sk_test_...' &&
  process.env.STRIPE_SECRET_KEY.startsWith('sk_');

const stripe = STRIPE_CONFIGURED 
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-11-20.acacia',
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!STRIPE_CONFIGURED || !stripe) {
      console.error('Stripe is not configured. Please add valid Stripe keys to .env.local');
      return NextResponse.json({ 
        error: 'Payment system not configured',
        message: 'Stripe keys are missing or invalid. Please contact support.',
        configured: false,
      }, { status: 503 });
    }

    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json({ 
        error: 'Email not verified',
        message: 'Please verify your email address before making purchases. Check your inbox for the verification link.',
        requiresVerification: true,
      }, { status: 403 });
    }

    const { items, discountCode } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate total
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    let discount = 0;

    // Apply discount if provided
    if (discountCode) {
      // Validate discount code here if needed
      // For now, we'll trust the client-side validation
    }

    const total = Math.round((subtotal - discount) * 100); // Convert to cents

    if (total < 50) {
      return NextResponse.json({ 
        error: 'Invalid amount',
        message: 'Minimum order amount is $0.50'
      }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
      metadata: {
        userId: user.id,
        discountCode: discountCode || '',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      configured: true,
    });
  } catch (error: any) {
    console.error('Payment intent error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create payment intent',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
