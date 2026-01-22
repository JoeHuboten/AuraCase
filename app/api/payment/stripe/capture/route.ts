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
      return NextResponse.json({ 
        error: 'Payment system not configured',
        message: 'Stripe is not configured',
      }, { status: 503 });
    }

    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentIntentId, items, discountCode, shippingAddress } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Payment intent ID required' }, { status: 400 });
    }

    // Retrieve the payment intent to verify status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const status = paymentIntent.status;

    if (status !== 'succeeded') {
      // For automatic capture, payment should already be succeeded
      return NextResponse.json({ 
        error: 'Payment not completed',
        message: `Payment status: ${status}`,
      }, { status: 400 });
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    let discount = 0;
    let discountCodeRecord = null;

    if (discountCode) {
      discountCodeRecord = await prisma.discountCode.findFirst({
        where: {
          code: discountCode,
          active: true,
        },
      });

      if (discountCodeRecord) {
        discount = (subtotal * discountCodeRecord.percentage) / 100;
      }
    }

    const total = subtotal - discount;

    // Prepare order data
    const orderData: any = {
      userId: user.id,
      total,
      subtotal,
      discount,
      deliveryFee: 0,
      status: 'PROCESSING',
      paymentType: 'CARD', // Apple Pay uses card payment type
      paymentIntentId: paymentIntentId,
      discountCodeId: discountCodeRecord?.id,
      trackingNumber: `AP${Date.now()}`,
      items: {
        create: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          color: item.color || null,
          size: item.size || null,
        })),
      },
    };

    // Add shipping address if provided
    if (shippingAddress && shippingAddress.firstName) {
      const addressRecord = await prisma.address.create({
        data: {
          userId: user.id,
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          phone: shippingAddress.phone || '',
          address1: shippingAddress.address,
          city: shippingAddress.city,
          state: '',
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country || 'България',
          isDefault: false,
        },
      });
      orderData.shippingAddressId = addressRecord.id;
      orderData.customerNotes = shippingAddress.notes || null;
    }

    // Create order in database
    const order = await prisma.order.create({
      data: orderData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update product stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
        },
      });

      // Check if product should be marked as out of stock
      const updatedProduct = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { stock: true },
      });

      if (updatedProduct && updatedProduct.stock <= 0) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { inStock: false },
        });
      }
    }

    // Update discount code usage
    if (discountCodeRecord) {
      await prisma.discountCode.update({
        where: { id: discountCodeRecord.id },
        data: { currentUses: { increment: 1 } },
      });
    }

    // Create initial status history
    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: 'PROCESSING',
        notes: 'Payment completed via Apple Pay. Order is being processed.',
        createdBy: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
    });
  } catch (error: any) {
    console.error('Stripe capture error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process payment',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
