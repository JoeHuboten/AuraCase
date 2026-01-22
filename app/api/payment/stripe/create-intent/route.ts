import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUserFromRequest } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// Check if Stripe is configured
const STRIPE_CONFIGURED = process.env.STRIPE_SECRET_KEY && 
  process.env.STRIPE_SECRET_KEY !== 'sk_test_...' &&
  process.env.STRIPE_SECRET_KEY.startsWith('sk_');

const stripe = STRIPE_CONFIGURED 
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-12-15.clover' as const,
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

    const { items, discountCode, shippingAddress, paymentMethodType } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: 'Shipping address required' }, { status: 400 });
    }

    // Validate stock availability
    const stockErrors: string[] = [];
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        stockErrors.push(`Продуктът "${item.name}" не съществува`);
        continue;
      }

      if (product.stock < item.quantity) {
        if (product.stock === 0) {
          stockErrors.push(`"${item.name}" е изчерпан`);
        } else {
          stockErrors.push(`"${item.name}" има само ${product.stock} бр. налични`);
        }
      }
    }

    if (stockErrors.length > 0) {
      return NextResponse.json({ 
        error: 'Stock error',
        message: 'Някои продукти не са налични',
        stockErrors,
      }, { status: 400 });
    }

    // Calculate total
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    let discount = 0;

    // Apply discount if provided
    if (discountCode) {
      const code = await prisma.discountCode.findFirst({
        where: {
          code: discountCode,
          active: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
      });

      if (code) {
        discount = (subtotal * code.percentage) / 100;
      }
    }

    const total = Math.round((subtotal - discount) * 100); // Convert to cents

    if (total < 50) {
      return NextResponse.json({ 
        error: 'Invalid amount',
        message: 'Minimum order amount is €0.50'
      }, { status: 400 });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: {
        userId: user.id,
        discountCode: discountCode || '',
        paymentMethodType: paymentMethodType || 'card',
        shippingName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        shippingEmail: shippingAddress.email,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
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
