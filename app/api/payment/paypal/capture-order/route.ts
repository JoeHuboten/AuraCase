import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, items, shippingAddress, discountCode } = await request.json();

    // Double-check stock availability before capturing payment
    const productIds = items.map((item: any) => item.id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, stock: true, inStock: true },
    });

    const stockErrors: string[] = [];
    for (const item of items) {
      const product = products.find((p) => p.id === item.id);
      if (!product) {
        stockErrors.push(`Продуктът "${item.name}" не е наличен`);
      } else if (!product.inStock) {
        stockErrors.push(`"${product.name}" е изчерпан`);
      } else if (product.stock !== null && product.stock < item.quantity) {
        if (product.stock === 0) {
          stockErrors.push(`"${product.name}" е изчерпан`);
        } else {
          stockErrors.push(`Само ${product.stock} бр. от "${product.name}" са налични`);
        }
      }
    }

    if (stockErrors.length > 0) {
      return NextResponse.json({
        error: 'Недостатъчна наличност',
        message: 'Някои продукти вече не са налични. Моля, обновете количката си.',
        stockErrors,
      }, { status: 400 });
    }

    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
    const PAYPAL_API = process.env.PAYPAL_MODE === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    // Get PayPal access token
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const tokenResponse = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const { access_token } = await tokenResponse.json();

    // Capture the order
    const captureResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    const captureData = await captureResponse.json();

    if (!captureResponse.ok || captureData.status !== 'COMPLETED') {
      return NextResponse.json({
        error: 'Payment capture failed',
        message: captureData.message || 'Payment was not completed',
      }, { status: 400 });
    }

    // Calculate amounts
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    let discount = 0;

    // Get discount code details
    let discountCodeRecord = null;
    if (discountCode) {
      discountCodeRecord = await prisma.discountCode.findUnique({
        where: { code: discountCode },
      });
      if (discountCodeRecord && discountCodeRecord.active) {
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
      status: 'PROCESSING', // PayPal payment is complete, order is now processing
      paymentType: 'PAYPAL',
      paymentId: captureData.id,
      discountCodeId: discountCodeRecord?.id,
      trackingNumber: `PP${Date.now()}`,
      items: {
        create: items.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size,
        })),
      },
    };

    // Add shipping address if provided
    if (shippingAddress && shippingAddress.firstName) {
      // Create address record first
      const addressRecord = await prisma.address.create({
        data: {
          userId: user.id,
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          phone: shippingAddress.phone || '',
          address1: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state || '',
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country || 'България',
          isDefault: true,
        },
      });
      orderData.shippingAddressId = addressRecord.id;
      orderData.customerNotes = shippingAddress.notes || null;
    }

    // Create order in database
    const dbOrder = await prisma.order.create({
      data: orderData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update product stock quantities
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: {
          stock: { decrement: item.quantity },
          inStock: {
            set: true, // Will be updated based on stock level
          },
        },
      });

      // Check if product should be marked as out of stock
      const updatedProduct = await prisma.product.findUnique({
        where: { id: item.id },
        select: { stock: true },
      });

      if (updatedProduct && updatedProduct.stock <= 0) {
        await prisma.product.update({
          where: { id: item.id },
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
        orderId: dbOrder.id,
        status: 'PROCESSING',
        notes: 'Payment completed via PayPal. Order is being processed.',
        createdBy: user.id,
      },
    });

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(user.email!, {
        orderId: dbOrder.id,
        customerName: user.name || 'Customer',
        total: dbOrder.total,
        items: dbOrder.items.map((item: any) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
        })),
        trackingNumber: dbOrder.trackingNumber || undefined,
        language: 'bg', // Default to Bulgarian, can be determined from user preferences
      });
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: dbOrder.id,
      paypalOrderId: captureData.id,
    });
  } catch (error: any) {
    console.error('PayPal capture error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process payment',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
